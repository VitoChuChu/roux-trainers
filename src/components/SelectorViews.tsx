import React from 'react'

import {
  FormControlLabel,
  FormGroup,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';

import SettingsIcon from '@mui/icons-material/Settings';

import Radio from '@mui/material/Radio';

import { AppState, Action, SliderOpt } from '../Types';
import Selector from '../lib/Selector';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { X } from '../Translation';

const SlimRadio = styled(Radio)(({ theme }) => ({
  padding: 6,
  '& .MuiSvgIcon-root': {
    fontSize: 18,
  },
  '&.MuiRadio-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
  },
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}))

const SlimCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: 6,
  '& .MuiSvgIcon-root': {
    fontSize: 18,
  },
  '&.MuiCheckbox-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
  },
}))

const useStyles = makeStyles(theme => ({
    container: {
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default
    },
    button: {
      width: "100%",
    },
    paper: {
      padding: theme.spacing(3),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    canvasPaper: {
      padding: theme.spacing(0),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    infoColumn: {
      color: theme.palette.background.paper
    },
    scrambleColumn: {
      paddingLeft: theme.spacing(3)
    },
    textColumn: {
      [theme.breakpoints.up('sm')]: {
        minHeight: 138
      },
    },
    fixedHeight: {
      height: 250,
    },
    title : {
        flexGrow: 1,
    },
    select: {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(0.5),
      [theme.breakpoints.down(768)]: {
        '& .MuiFormGroup-root': {
          flexDirection: 'column',
        },
        '& .MuiFormControlLabel-root': {
          paddingTop: 4,
          paddingBottom: 4,
        },
        '& .MuiFormControlLabel-label': {
          fontSize: '0.95rem',
        },
        '& .MuiRadio-root, & .MuiCheckbox-root': {
          padding: 12,
        },
      },
    },
    selectLabel: {
      color: theme.palette.text.disabled,
      fontSize: '0.6rem',
      fontWeight: 600,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      marginBottom: 8,
      [theme.breakpoints.down(768)]: {
        fontSize: '0.7rem',
        marginBottom: 8,
      },
    },
    multiSelectGrid: {
      [theme.breakpoints.down(768)]: {
        gridTemplateColumns: '1fr !important',
      },
    }

}))

function SliderThumbComponent(props: any) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

const LevelSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-markLabel': {
    fontSize: "0.675rem",
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  '& .MuiSlider-thumb': {
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    border: '1.5px solid ' + theme.palette.primary.main,
    boxShadow: 'none',
    '&:hover, &.Mui-active': {
      boxShadow: '0 0 0 6px rgba(85,108,214,0.08)',
    },
  },
  '& .MuiSlider-rail': {
    height: 3,
    borderRadius: 1.5,
    opacity: 0.14,
  },
  '& .MuiSlider-track': {
    height: 3,
    borderRadius: 1.5,
    border: 'none',
  },
  '& .MuiSlider-mark': {
    width: 3,
    height: 3,
    borderRadius: '50%',
    marginLeft: -1,
  },
}))

function SliderView(props: {
  slider: SliderOpt, onChange: (n: number) => void}) {
  let { slider } = props
  let classes = useStyles()
  const handleChange = (_: any, newValue: number|number[]) => {
      let v = Array.isArray(newValue) ? newValue[0] : newValue
      if ((slider.l - 1<= v && v <= slider.r))
        props.onChange(v)
  }
  let label = slider.label
  let marks = React.useMemo(() => {
    let obj = [{value: slider.l - 1, label: X.LEVEL_SELECT.ANY}]
    for (let i = slider.l; i <= slider.r; i++) {
      let suffix = ""
      if (i === slider.l && slider.extend_l) suffix = "-";
      if (i === slider.r && slider.extend_r) suffix = "+";
      obj.push({value: i, label: i.toString() + suffix})
    }
    return obj
  }, [slider.l, slider.r, slider.extend_l, slider.extend_r])
  return (
  <Box>
    <FormLabel component="legend" className={classes.selectLabel} >{X.LEVEL_SELECT.LEVEL}</FormLabel>
    <Box paddingX={4}>
      <LevelSlider
      marks={marks}
      track={false}
      min={slider.l - 1}
      max={slider.r}
      value={slider.value}
      onChange={handleChange}
      onFocus={(evt) => evt.target.blur()}
      />
    </Box>
  </Box>)
}

function SliderSelect(props: {state: AppState, dispatch: React.Dispatch<Action>,
  select: string}) {
    let sliderName = props.select
    let sliderOpt = (props.state.config as any)[sliderName] as SliderOpt
    return <SliderView
      slider={(props.state.config as any)[sliderName] as SliderOpt}
      onChange={(n: number) => {
        props.dispatch( { type: "config",
         content: { [sliderName]: ({...sliderOpt, value:n }) }
        } )
      }}
    />
}


function SingleSelect(props: {state: AppState, dispatch: React.Dispatch<Action>,
    select: string, label?: string, filterNames?: Set<string>}) {
  let { state, dispatch, select, filterNames } = props
  let { config } = state
  let sel = (config as any)[select] as Selector
  let classes = useStyles()
  const theme = useTheme()

  const handleChange = (name: string) => {
    let { names } = sel
    let n = names.length
    let new_flags = Array(n).fill(0)
    for (let i = 0; i < names.length; i++) {
      if (names[i] === name) {
        new_flags[i] = 1
      }
    }
    dispatch( { type: "config", content: {[select]: sel.setFlags(new_flags) } } )
  }

  let label = sel.label || props.label || ""
  return (
  <FormControl component="fieldset" className={classes.select}>
    <FormLabel component="legend" className={classes.selectLabel} >
      {label}
    </FormLabel>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
      {sel.names.map((name, i) => {
        if (filterNames && filterNames.has(name)) return null
        const active = sel.flags[i] === 1
        const total = sel.names.filter(n => !filterNames || !filterNames.has(n)).length
        return (
          <Button
            key={name}
            disableRipple
            onClick={() => handleChange(name)}
            onFocus={(evt) => evt.target.blur()}
            sx={{
              textTransform: 'none',
              borderRadius: 0,
              border: '1px solid',
              borderColor: active ? 'primary.main' : 'divider',
              bgcolor: active ? (theme.palette.mode === 'dark' ? 'rgba(139,158,240,0.1)' : 'rgba(85,108,214,0.05)') : 'transparent',
              color: active ? 'primary.main' : 'text.secondary',
              fontWeight: active ? 600 : 400,
              fontSize: '0.72rem',
              px: 1.2,
              py: 0.3,
              minWidth: 0,
              '&:hover': {
                bgcolor: active
                  ? (theme.palette.mode === 'dark' ? 'rgba(139,158,240,0.16)' : 'rgba(85,108,214,0.1)')
                  : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
              },
              '&:first-of-type': { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
              '&:last-of-type': { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
              '&:not(:first-of-type)': { ml: '-1px' },
            }}
          >
            {sel.getDisplayName(i)}
          </Button>
        )
      })}
    </Box>
  </FormControl>)
}



type MultiSelectOptions = {
  label?: string, noDialog?: boolean,
  manipulators?: {name: string, enableIdx: number[]}[]
}


function MultiSelectContent(props: {state: AppState, dispatch: React.Dispatch<Action>, select: string, options?: MultiSelectOptions }) {
  let { state, dispatch, select, options } = props
  options = options || {}
  let { config } = state
  let classes = useStyles()
  const theme = useTheme()
  const is_mobile = useMediaQuery(theme.breakpoints.down(768))

  let sel = (config as any)[select] as Selector
  const handleChange = (evt: { target: { value: string; checked: boolean }; }) => {
    let { names, flags } = sel
    let new_flags = [...flags]

    for (let i = 0; i < names.length; i++) {
      if (names[i] === evt.target.value) {
        new_flags[i] = (evt.target.checked)? 1 : 0
      }
    }
    dispatch( { type: "config", content: {[select]: sel.setFlags(new_flags) } } )
  }

  let makeBox = (name: string, checked: boolean, displayName?: string) => {
    return (
    <FormControlLabel
        control={
        <SlimCheckbox color="primary" checked={checked} onChange={handleChange} />
        }
        label={displayName || name}
        key={name}
        value={name}
        sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: '0.72rem', fontWeight: 400, color: theme.palette.text.secondary } }}
    />)
  }

  const [manipChecked, setManipChecked] = React.useState< { [ name: string ]: boolean } >({})
  let label = sel.label || options.label || ""
  let makeManipulator = (manip: {name: string, enableIdx: number[]}) => {
    let {name, enableIdx} = manip
    let handleChange = (evt: { target: { value: string; checked: boolean }; }) => {
      setManipChecked( {...manipChecked, [name] : evt.target.checked } )
      let fillValue = (evt.target.checked);
      let { flags } = sel
      let new_flags = [...flags]
      for (let i of enableIdx) {
        new_flags[i] = fillValue ? 1 : 0;
      }
      dispatch( { type: "config", content: {[select]: sel.setFlags(new_flags) } } )
    }
    return (
      <FormControlLabel
      control={
      <SlimCheckbox color="primary" checked={manipChecked[name]} onChange={handleChange} />
      }
      label={name}
      key={name}
      value={name}
      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.72rem' } }}
      />)
  }
  let manipulator_row = options.manipulators ?
    (<FormGroup row>
    {options.manipulators.map(x => makeManipulator(x)) }
    </FormGroup>) : null;
  const gridClass = is_mobile ? classes.multiSelectGrid : ''
  const content = (
    <React.Fragment>
      {manipulator_row}
      <Box className={gridClass} sx={{ display: 'grid', gridTemplateColumns: is_mobile ? '1fr' : 'repeat(2, 1fr)', gap: is_mobile ? '12px 0' : '4px 24px' }}>
      {sel.names.map( (name, i) => makeBox(name, !!sel.flags[i], sel.getDisplayName(i)))}
      </Box>
    </React.Fragment>
  )
  return {label, content}
}

function MultiSelect(props: {state: AppState, dispatch: React.Dispatch<Action>, select: string, options?: MultiSelectOptions }) {
  let { state, dispatch, select, options } = props
  let {label, content} = MultiSelectContent({state, dispatch, select, options})
  options = options || {}

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  }
  let classes = useStyles()
  const theme = useTheme()
  const is_mobile = useMediaQuery(theme.breakpoints.down(768))

  if (options.noDialog)
  return (
    <FormControl component="fieldset" className={`${classes.select} multi-select`}>
      <FormLabel component="legend" className={classes.selectLabel} >{label}</FormLabel>
      {content}
    </FormControl>
  )

  return (
  <Box className="multi-select">
    <FormLabel component="legend" className={classes.selectLabel}>{label}</FormLabel>
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
      <DialogTitle sx={{fontSize: '0.95rem', fontWeight: 600, pb: 0.5}}> {label} </DialogTitle>
      <DialogContent sx={{pt: 1}}>
        {content}
      </DialogContent>
      <DialogActions sx={{pt: 0}}>
          <Button onClick={handleClose} color="primary"
            sx={{borderRadius: 4, textTransform: 'none', fontWeight: 500, fontSize: '0.85rem'}}>
            {X.COMMON.OK}
          </Button>
      </DialogActions>
    </Dialog>
  </Box>
  )
}


export { SingleSelect, MultiSelectContent, MultiSelect, SliderSelect }
