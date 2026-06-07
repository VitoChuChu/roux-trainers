import React, { Fragment } from 'react'

import {
    TextField,
    Divider,
    Button, Box,
    FormLabel, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';

import { AppState, Action } from '../Types';
import { ColorScheme } from '../lib/CubeLib';

import { MultiSelectContent } from './SelectorViews';
import { X } from '../Translation';

export function ColorSetter(props: {state: AppState, dispatch: React.Dispatch<Action>}) {
    const [text, setText] = React.useState(props.state.colorScheme.toUserInput().join(","))
    const handleChange = (event: any) => setText(event.target.value);
    const handleClick = () => {
        let arr = text.split(",")
        props.dispatch({
            type: "colorScheme",
            content: arr.length === 7? arr : ColorScheme.default_colors
        })
    }
    return (
        <Fragment>
        <Box marginBottom={1.5}>
        <TextField
            label={X.ANALYZER.COLOR}
            helperText={X.ANALYZER.COLOR_HELPER}
            onChange={handleChange}
            fullWidth
            value={text}
            size="small"
        /></Box>

        <Box>
        <Button variant="outlined" size="medium" color="primary" onClick={handleClick}
          sx={{borderRadius: 4, textTransform: 'none'}} >
            {X.ANALYZER.SET_COLOR}
        </Button>
        </Box>
        </Fragment>
    )
}

export function ColorPanel(props: {state: AppState, dispatch: React.Dispatch<Action>}) {
    let { state, dispatch } = props
    let select = "orientationSelector"
    let {content} = MultiSelectContent({state, dispatch, select})

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = (e: any, reason: string) => {
      if (reason === "backdropClick")
        setOpen(false);
    }

    return (
        <div className="color-panel">
        <FormLabel component="legend" sx={{ color: 'text.disabled', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{X.ANALYZER.ORI_AND_COLOR_SCHEME}</FormLabel>
        <Box height={6}/>
        <Button color="primary" variant="outlined" size="small"
          sx={{borderRadius: 4, textTransform: 'none', fontWeight: 500, borderWidth: 1, '&:hover': {borderWidth: 1}}}
          onClick={handleClickOpen}>
        <SettingsIcon fontSize="small" color="primary" style={{marginRight: 4}}></SettingsIcon>
          {X.COMMON.EDIT}
        </Button>
        <Box height={8}/>
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}
          maxWidth="sm" fullWidth
          PaperProps={{sx: {borderRadius: 8, padding: 2, boxSizing: 'border-box'}}}>
          <DialogTitle sx={{fontSize: '1.15rem', fontWeight: 600, pb: 0.5}}> {X.ANALYZER.FB_ORI_DIALOG_TITLE}  </DialogTitle>
          <DialogContent sx={{pt: 1}}>
            {content}
            <Box height={12}/>
                <Divider />
            <Box height={12}/>
            <ColorSetter {...{state, dispatch}}/>

          </DialogContent>
          <DialogActions sx={{pt: 0.5, pb: 1, px: 2}}>
              <Button onClick={() => setOpen(false)} color="primary"
                sx={{borderRadius: 4, textTransform: 'none', fontWeight: 600, fontSize: '1rem'}}>
                  {X.COMMON.CLOSE}
              </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
}
