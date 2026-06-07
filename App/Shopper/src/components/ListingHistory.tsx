'use client'

import {useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import {useTranslations} from 'next-intl'

import {getListingHistory} from '../historian/actions'
import {Citation, ListingHistory as LH} from '../historian'

// Renders the model's summary with [N] markers rewritten as clickable
// superscript links. Handles single ([3]) and multi ([3, 4] or [3][4]).
function renderSummary(summary: string, citations: Citation[]): React.ReactNode[] {
  const byIndex = new Map<number, Citation>(citations.map((c) => [c.index, c]))
  const parts: React.ReactNode[] = []
  // Match either [N] or [N, M, ...] groups.
  const re = /\[(\d+(?:\s*,\s*\d+)*)\]/g
  let cursor = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(summary)) !== null) {
    if (match.index > cursor) {
      parts.push(summary.slice(cursor, match.index))
    }
    const indices = match[1].split(',').map((s) => parseInt(s.trim(), 10))
    for (const idx of indices) {
      const cit = byIndex.get(idx)
      if (!cit) continue
      parts.push(
        <sup key={`cit-${key++}`} style={{marginLeft: 2}}>
          <Link
            href={cit.url}
            target='_blank'
            rel='noopener noreferrer'
            underline='hover'
            sx={{fontSize: '0.7em'}}
          >
            [{idx}]
          </Link>
        </sup>,
      )
    }
    cursor = match.index + match[0].length
  }
  if (cursor < summary.length) {
    parts.push(summary.slice(cursor))
  }
  return parts
}

interface Props {
  listingId: string
}

export default function ListingHistory({listingId}: Props) {
  const t = useTranslations('History')
  const [history, setHistory] = useState<LH | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    void getListingHistory(listingId).then((h) => {
      if (!cancelled) setHistory(h)
    })
    return () => { cancelled = true }
  }, [listingId])

  // Loading or failed — render nothing. The page is fine without history.
  if (!history) return null

  return (
    <Box sx={{mt: 3, p: 2, bgcolor: '#f5f3ee', borderRadius: 1}}>
      <Typography variant='h6' sx={{fontWeight: 600, color: '#154212', mb: 1}}>
        {t('title')}
      </Typography>
      <Typography variant='body1' sx={{color: '#42493e', lineHeight: 1.6}}>
        {renderSummary(history.summary, history.citations)}
      </Typography>
      <Divider sx={{my: 1.5}} />
      <Typography variant='caption' sx={{color: '#7a7a7a', fontStyle: 'italic'}}>
        {t('disclaimer')}
      </Typography>
    </Box>
  )
}
