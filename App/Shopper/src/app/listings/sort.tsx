'use client'
import {useState, type Dispatch} from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SortIcon from '@mui/icons-material/Sort'
import type {KitListing} from '../../kit_listing'

type SortOption = 'price-asc' | 'price-desc' | 'alpha-asc' | 'alpha-desc'

const OPTIONS: {label: string, value: SortOption}[] = [
  {label: 'Price: Low to High', value: 'price-asc'},
  {label: 'Price: High to Low', value: 'price-desc'},
  {label: 'Name: A to Z',       value: 'alpha-asc'},
  {label: 'Name: Z to A',       value: 'alpha-desc'},
]

function sortListings(listings: KitListing[], sort: SortOption): KitListing[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case 'price-asc':  return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'alpha-asc':  return a.title.localeCompare(b.title)
      case 'alpha-desc': return b.title.localeCompare(a.title)
    }
  })
}

interface Props {
  listings: KitListing[]
  onSort: Dispatch<KitListing[]>
}

export function Sort({listings, onSort}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const handleSelect = (option: SortOption) => {
    setAnchor(null)
    onSort(sortListings(listings, option))
  }

  return (
    <>
      <Button
        aria-label="sort"
        variant="outlined"
        onClick={(e) => { setAnchor(e.currentTarget); }}
        startIcon={<SortIcon />}
        sx={{
          color: '#154212',
          borderColor: '#154212',
          fontFamily: '"Work Sans", sans-serif',
          textTransform: 'none',
          mb: 1,
          '&:hover': {bgcolor: '#f0ebe0', borderColor: '#154212'},
        }}
      >
        Sort
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => { setAnchor(null); }}>
        {OPTIONS.map(({label, value}) => (
          <MenuItem key={value} onClick={() => { handleSelect(value); }}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
