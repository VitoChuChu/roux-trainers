import React, { Fragment } from 'react'

import CubeSim from './CubeSim'
import { useTheme, FormControl, FormLabel, Typography, Button } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { FaceletCube, Mask, MoveSeq } from '../lib/CubeLib';

import { AppState, Action } from "../Types";
import clsx from 'clsx';
import { MultiSelect, SingleSelect } from './SelectorViews';
import { ColorPanel } from './Input';
import CaseSelectDialog from './CaseSelectView';
import { cmll_algs_raw, nmcll_display_parity, nmcll_to_cmll_mapping, ollcp_algs_raw } from '../lib/Algs';

import CaseVisualizer from './CaseVisualizer';
import { CubeSim2D, CubeSimFlat3D } from './CubeSim2D';
import { Face } from '../lib/Defs';
import { X } from '../Translation';

const useStyles = makeStyles(theme => ({
    container: {
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.down(768)]: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
    paper: {
      padding: theme.spacing(2.5),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      borderRadius: 6,
      border: 'none',
      boxShadow: 'none',
      backgroundColor: theme.palette.background.paper,
    },
    fixedHeight: {
      height: 350,
    },
    canvasPaper: {
      padding: theme.spacing(0),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      borderRadius: 6,
    },
    title : {
        color: theme.palette.text.disabled,
        fontWeight: 500,
        fontSize: '0.7rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
    },
    prompt: {
      color: theme.palette.text.secondary,
    },
    button: {
      width: "100%",
      height: 38,
      borderRadius: 6,
      fontSize: '0.9rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      boxShadow: 'none',
      [theme.breakpoints.down(768)]: {
        height: 44,
        fontSize: '1rem',
        borderRadius: 6,
      },
    },
    revealButton: {
      borderRadius: 4,
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.85rem',
    },
    usageText: {
      padding: '20px 0',
      '& pre': {
        fontFamily: 'inherit',
        lineHeight: 1.7,
        fontSize: '0.825rem',
      },
    },
}))

const cmll_name_to_alg = Object.fromEntries(cmll_algs_raw)
const nmcll_display_algs = nmcll_to_cmll_mapping.map( ([x, y], i) => {
  let parity = nmcll_display_parity[i]
  let alg = cmll_name_to_alg[y[0][0]]
  alg = parity[2] + " " + alg + " " + parity[1]
  return [x, alg] as [string, string]
})
//console.log(nmcll_display_algs)

function NMCLLSelect(props:  { state: AppState, dispatch: React.Dispatch<Action> } ) {
  const {state, dispatch} = props
  const groups = ["o", "s", "as", "t", "u", "l", "pi", "h"]
  return <CaseSelectDialog {...{state, dispatch, settings: {
    selector: "nmcllSelector",
    groups,
    algs: nmcll_display_algs,
    visualizeMask: "cmll",
    cubeOptions: {
      colorScheme: {
        0: '#ffffff', // URFDLB. U = white
        1: '#ee0000', // R = red
        2: '#404040', // F = green
        3: '#404040', // D = yellow
        4: '#ffa100', // L = orange
        5: '#404040', // B = blue
      }
    }
    },
    title: X.CONFIG.NMCLL_DIALOG_TITLE,
    label: X.CONFIG.SELECT_BY_NMCLL
  } }/>
}

function _getMask(name: string) {
  switch (name) {
    case "Show": return Mask.solved_mask;
    case "Hide": return Mask.empty_mask;
    case "Hide LSE": return Mask.lse_mask;
    default: return Mask.solved_mask
  }
}
export function CmllTrainerView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
    let { state, dispatch } = props
    let cube = state.cube.state
    let classes = useStyles()
    const canvasPaper = clsx(classes.canvasPaper, classes.fixedHeight);
    let facelet = FaceletCube.from_cubie(cube,
      _getMask( state.config.cmllCubeMaskSelector.getActiveName() || "Show"))


    let cmll2D3DActiveName = (state.config.cmll2D3DSelector.getActiveName() || "3D")
    const use3D = cmll2D3DActiveName === "3D"
    const useFlat3D = cmll2D3DActiveName === "flat3D"
    let kataMode = state.config.cmllKataSelector.getActiveName()
    let flat3DShowLFace = state.config.cmllflat3DFaceSelector.getActiveName() === "L"
    let _3DShowLFace = state.config.cmll3DFaceSelector.getActiveName() === "Show"

    let hyperori = state.config.hyperOriSelector.getActiveName() || "off"
    if (hyperori !== "off") {
      // if hyperori on
      if (hyperori === "F/B") {
        facelet = FaceletCube.as_actrm(facelet, "fb", true)
      } else {
        facelet = FaceletCube.as_actrm(facelet, "lr", true)
      }
    } else {
      // if kata mode is on, we mask out all non-U stickers that are not used by recognition
      // we will go with the following (OO) recognition schema courtesy of James Macdiarmid:
      // Pi/H: U face
      // S/As/T/U: the T shape
      // L: the U face plus the FUR and BUL
      if (kataMode !== "off") {
        // for now, let's add support for T-shape kata only.
        // This may be used for T,U,Pi,H obviously, but also for Sune/AntiSune with the James Macdiarmid recog methdo
        facelet = FaceletCube.as_kata(facelet)
      }
    }
    const theme = useTheme()

    React.useEffect( () =>  {
      setReveal(false)
    }, [ state ])
    const [reveal, setReveal] = React.useState(false)
    const handleClick = () => {
      setReveal(true)
    }
    const handleNext = () => {
      dispatch({type: "key", content: "#space"})
    }

    React.useEffect(() => {
      function downHandler(event: KeyboardEvent) {
        if (event.key === " ") {
          const tag = (document.activeElement?.tagName || "").toLowerCase();
          if (tag === "input" || tag === "textarea") return;
          event.preventDefault();
          (document.activeElement as HTMLElement)?.blur();
        }
        state.keyMapping.handle(event, dispatch);
        if (event.key === "/") {
          setReveal(true)
        }
      }
      window.addEventListener('keydown', downHandler);
      return () => {
        window.removeEventListener('keydown', downHandler);
      };
    });

    let alg = ""
    let setup = ""
    if (state.case.desc.length === 4) {
      setup = state.case.desc[3].algs[0]
    }
    if (reveal && state.case.desc.length >= 3) {
      const moves = new MoveSeq(state.case.desc[1].algs[0] + state.case.desc[2].algs[0] )
      let moves_c = moves.collapse()
      if (moves_c.moves.length > 0) {
        if (moves_c.moves[0].name[0] === "U") {
          alg += "(" + moves_c.moves[0].name + ") ";
          moves_c.moves = moves_c.moves.slice(1)
        }
        alg += moves_c.toString()
      }
    }
    const colorSchemeColors = state.colorScheme.getColorsForOri(state.cube.ori)
    return (
    <Box className={classes.container}>
    <Grid container >
      <Grid item xs={12} >
          {use3D ?
            <Paper className={canvasPaper}>
              <Box margin="auto">
              {<CubeSim
                width={400}
                height={350}
                cube={facelet}
                colorScheme={colorSchemeColors}
                theme={state.config.theme.getActiveName()}
                facesToReveal={ _3DShowLFace ? [Face.L] : []}
              />}
              </Box>
            </Paper>
           :
           useFlat3D ?
           <Paper className={canvasPaper}>
             <Box margin="auto">
             {<CubeSimFlat3D
               width={400}
               height={350}
               cube={facelet}
               colorScheme={colorSchemeColors}
               theme={state.config.theme.getActiveName()}
               facesToReveal={[ flat3DShowLFace ? Face.L : Face.R]}
             />}
             </Box>
           </Paper>
           :
            <Paper className={canvasPaper}>
              <Box margin="auto">
              {<CubeSim2D
                width={400}
                height={350}
                cube={facelet}
                colorScheme={colorSchemeColors}
                theme={state.config.theme.getActiveName()}
              />}
              </Box>
            </Paper>
          }
      </Grid>
    </Grid>

    <Box height = {5}/>

    <Paper className={classes.paper}>
    <Grid container spacing={2}>

      <Grid item xs={12}>
        <Box className={classes.title} style={{marginBottom: 4}}>
          {X.COMMON.SCRAMBLE}
        </Box>
        <Typography style={{whiteSpace: 'pre-line', fontSize: '1.1rem', fontWeight: 400}}>
          { setup }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.title} style={{marginBottom: 4}}>
          Case
        </Box>
      { (!reveal) ?
      <Button onFocus={(evt) => evt.target.blur() } className={classes.revealButton}
      size="small" variant="outlined" color="primary" onClick={handleClick}>
          Show
      </Button>
      :
      <Box>
        <Typography style={{whiteSpace: 'pre-line', fontSize: '1.1rem', fontWeight: 400, marginBottom: 12}}>
          { alg }
        </Typography>
        <CaseVisualizer
          name=""
          size={100}
          alg={alg}
          mask="cmll"
          color={colorSchemeColors}
          cubeOptions={{}}
        />
      </Box>
      }
      </Grid>
    </Grid>
    <Box height={24}/>

    <Grid container spacing={0}>
        <Grid item xs={12} sm={4} md={3}>
          <Button onFocus={(evt) => evt.target.blur() } className={classes.button}
          variant="outlined" color="primary" onClick={handleNext}>
              Next
          </Button>
        </Grid>
    </Grid>
    </Paper>

    </Box>
    );
}

//export default CmllTrainerView


export function OllcpTrainerView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
  let { state, dispatch } = props
  let cube = state.cube.state
  let classes = useStyles()
  const canvasPaper = clsx(classes.canvasPaper, classes.fixedHeight);
  let facelet = FaceletCube.from_cubie(cube, Mask.solved_mask)

  const use3D = (state.config.cmll2D3DSelector.getActiveName() || "3D") === "3D"
  let kataMode = state.config.cmllKataSelector.getActiveName()

  if (kataMode !== "off") {
    facelet = FaceletCube.as_kata(facelet)
  }


  React.useEffect( () =>  {
    setReveal(false) // todo: drive this from props. now there's a delay which causes the answer to leak for a split second
  }, [ state ])
  const [reveal, setReveal] = React.useState(false)
  const handleClick = () => {
    setReveal(true)
  }
  const handleNext = () => {
    dispatch({type: "key", content: "#space"})
  }

  React.useEffect(() => {
    function downHandler(event: KeyboardEvent) {
      if (event.key === " ") {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        event.preventDefault();
        (document.activeElement as HTMLElement)?.blur();
      }
      state.keyMapping.handle(event, dispatch);
      // intercept keyboard event for local control
      if (event.key === "/") {
        setReveal(true)
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  });

  let alg = ""
  let setup = ""
  if (state.case.desc.length === 4) {
    setup = state.case.desc[3].algs[0]
  }
  if (reveal && state.case.desc.length >= 3) {
    const moves = new MoveSeq(state.case.desc[1].algs[0] + state.case.desc[2].algs[0] )
    let moves_c = moves.collapse()
    if (moves_c.moves.length > 0) {
      if (moves_c.moves[0].name[0] === "U") {
        alg += "(" + moves_c.moves[0].name + ") ";
        moves_c.moves = moves_c.moves.slice(1)
      }
      alg += moves_c.toString()
    }
  }
  const colorSchemeColors = state.colorScheme.getColorsForOri(state.cube.ori)
  return (
  <Box className={classes.container}>
  <Grid container >
    <Grid item xs={12} >
        {use3D ?
          <Paper className={canvasPaper}>
            <Box margin="auto">
            {<CubeSim
              width={400}
              height={350}
              cube={facelet}
              colorScheme={colorSchemeColors}
              theme={state.config.theme.getActiveName()}
              facesToReveal={[Face.L]}
            />}
            </Box>
          </Paper>
         :
          <Paper className={canvasPaper}>
            <Box margin="auto">
            {<CubeSim2D
              width={400}
              height={350}
              cube={facelet}
              colorScheme={colorSchemeColors}
              theme={state.config.theme.getActiveName()}
            />}
            </Box>
          </Paper>
        }
    </Grid>
  </Grid>

  <Box height = {5}/>

  <Paper className={classes.paper}>
  <Grid container spacing={2}>

    <Grid item xs={12}>
      <Box className={classes.title} style={{marginBottom: 4}}>
        Scramble
      </Box>
      <Typography style={{whiteSpace: 'pre-line', fontSize: '1.1rem', fontWeight: 400}}>
        { setup }
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Box className={classes.title} style={{marginBottom: 4}}>
        Case
      </Box>
    { (!reveal) ?
    <Button onFocus={(evt) => evt.target.blur() } className={classes.revealButton}
    size="small" variant="outlined" color="primary" onClick={handleClick}>
        Show
    </Button>
    :
    <Box>
      <Typography style={{whiteSpace: 'pre-line', fontSize: '1.1rem', fontWeight: 400, marginBottom: 12}}>
        { alg }
      </Typography>
      <CaseVisualizer
        name=""
        size={100}
        alg={alg}
        mask="cmll"
        color={colorSchemeColors}
        cubeOptions={{}}
      />
    </Box>
    }
    </Grid>
  </Grid>
  <Box height={24}/>

  <Grid container spacing={0}>
      <Grid item xs={12} sm={4} md={3}>
        <Button onFocus={(evt) => evt.target.blur() } className={classes.button}
        variant="outlined" color="primary" onClick={handleNext}>
            Next
        </Button>
      </Grid>
  </Grid>
  </Paper>


  </Box>
  );
}
