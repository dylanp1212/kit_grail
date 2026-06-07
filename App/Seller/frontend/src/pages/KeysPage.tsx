import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

import {createKey, listKeys, revokeKey} from '../api/keys';
import type {KeyCreated, KeyMetadata} from '../api/keys';
import {LoadingError} from '../components/LoadingError';

export const KeysPage = () => {
  const {t} = useTranslation();
  const [keys, setKeys] = useState<KeyMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [created, setCreated] = useState<KeyCreated | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => {
    setLoading(true);
    setError(null);
    return listKeys()
        .then(setKeys)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
  };

  useEffect(() => {
    listKeys()
        .then(setKeys)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    setCreating(true);
    try {
      const result = await createKey(label.trim());
      setCreateOpen(false);
      setLabel('');
      setCreated(result);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = (id: string) => {
    if (!window.confirm(t('keysRevokeConfirm'))) return;
    revokeKey(id)
        .then(refresh)
        .catch((err: Error) => setError(err.message));
  };

  const copyPlaintext = (plaintext: string) => {
    void navigator.clipboard.writeText(plaintext);
  };

  return (
    <Box sx={{p: 3}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography variant='h3'>{t('keysTitle')}</Typography>
        <Button variant='contained' onClick={() => setCreateOpen(true)}>
          {t('keysCreateButton')}
        </Button>
      </Box>

      <Typography sx={{mt: 1}} color='text.secondary'>
        {t('keysSubtitle')}
      </Typography>

      <LoadingError loading={loading} error={error} />

      {!loading && !error && keys.length === 0 && (
        <Typography sx={{mt: 3}}>{t('keysEmpty')}</Typography>
      )}

      {!loading && !error && keys.length > 0 && (
        <Paper sx={{mt: 3}}>
          <Table aria-label='api keys'>
            <TableHead>
              <TableRow>
                <TableCell>{t('keysLabel')}</TableCell>
                <TableCell>{t('keysPrefix')}</TableCell>
                <TableCell>{t('keysCreatedAt')}</TableCell>
                <TableCell>{t('keysStatus')}</TableCell>
                <TableCell align='right'>{t('keysActions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>{k.label ?? '—'}</TableCell>
                  <TableCell><code>{k.prefix}</code></TableCell>
                  <TableCell>
                    {k.created_at ?
                      new Date(k.created_at).toLocaleString() :
                      '—'}
                  </TableCell>
                  <TableCell>
                    {k.revoked_at ? t('keysRevoked') : t('keysActive')}
                  </TableCell>
                  <TableCell align='right'>
                    {!k.revoked_at && (
                      <IconButton
                        aria-label={t('keysRevoke')}
                        onClick={() => handleRevoke(k.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
        <DialogTitle>{t('keysCreateTitle')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label={t('keysLabel')}
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={t('keysLabelPlaceholder')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>
            {t('keysCancel')}
          </Button>
          <Button
            variant='contained'
            onClick={() => void submit()}
            disabled={creating || !label.trim()}
          >
            {t('keysCreateButton')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!created} fullWidth>
        <DialogTitle>{t('keysShowTitle')}</DialogTitle>
        <DialogContent>
          <Typography color='warning.main' sx={{mb: 2}}>
            {t('keysShowWarning')}
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <Box
              component='code'
              sx={{
                flex: 1,
                p: 1,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              {created?.plaintext}
            </Box>
            <IconButton aria-label={t('keysCopy')}
              onClick={() => created && copyPlaintext(created.plaintext)}>
              <ContentCopyIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setCreated(null)}>
            {t('keysShowDone')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
