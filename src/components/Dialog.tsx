import React from 'react';
import { FormLabel, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { X } from '../Translation';

export interface DialogProps {
  label: string,
  title?: string,
}
export interface DialogOptions {
  fullWidth? : boolean
}
const defaultOptions = {
  fullWidth: false
}

const makeDialog = <P extends object>(
  Component: React.ComponentType<P>, options?: DialogOptions
) => (function DialogView(props: P & DialogProps) {
  options = options || defaultOptions
  const title = props.title || props.label
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  }

  return (
  <Box>
    <FormLabel component="legend" sx={{ color: 'text.disabled', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{props.label}</FormLabel>
    <Box height={6}/>
    <Button color="primary" variant="outlined" size="small"
      sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 500, borderWidth: 1, '&:hover': { borderWidth: 1 } }}
      onClick={handleClickOpen}>
      <SettingsIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
        {X.COMMON.SELECT}
    </Button>
    <Box height={8}/>


    <Dialog disableEscapeKeyDown open={open} onClose={handleClose} maxWidth="md"
      PaperProps={{ sx: { borderRadius: 8, padding: 2 } }}>
      <DialogTitle sx={{ fontSize: '0.95rem', fontWeight: 600, pb: 0.5 }}> {title} </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box paddingLeft={1}>
          <Component {...props}/>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pt: 0 }}>
          <Button onClick={handleClose} color="primary"
            sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>
            {X.COMMON.CLOSE}
          </Button>
      </DialogActions>
    </Dialog>
    </Box>
  )

})

export {makeDialog}