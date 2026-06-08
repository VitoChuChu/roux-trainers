import React, { Fragment } from 'react'

import CubeSim from './CubeSim'
import { useTheme, FormControl, FormLabel, Typography, Button, Grid, Paper, Box, IconButton } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { FaceletCube, Mask, MoveSeq, CubeUtil, CubieCube } from '../lib/CubeLib';

import { AppState, Action} from "../Types";
import 'typeface-roboto-mono';
import { Face } from '../lib/Defs';
import { CubeSim2D, CubeSimFlat3D } from './CubeSim2D'
import CaseVisualizer from './CaseVisualizer'

import clsx from 'clsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import { X } from '../Translation';

const useStyles = makeStyles(theme => ({
    container: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
      },
    },
    mainConsole: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 24,
      padding: theme.spacing(5),
      boxShadow: theme.palette.mode === 'dark' ? '0 8px 40px rgba(0,0,0,0.4)' : '0 8px 40px rgba(0,0,0,0.06)',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.1)'}`,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(4),
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
        borderRadius: 20,
        gap: theme.spacing(3),
      },
    },
    scrambleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '1px solid ' + (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: 16,
      },
    },
    setup: {
      fontFamily: '"SF Mono", "Roboto Mono", monospace',
      fontSize: "1.85rem",
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      color: theme.palette.text.primary,
      [theme.breakpoints.down('md')]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: "1.3rem",
      },
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: theme.spacing(5),
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
      },
    },
    solutionArea: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    },
    cubeArea: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
      borderRadius: 20,
      padding: theme.spacing(2),
    },
    title : {
        color: theme.palette.text.disabled,
        fontWeight: 800,
        fontSize: '1rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    button: {
      width: "100%",
      height: 64,
      borderRadius: 18,
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#007AFF',
      color: '#FFFFFF',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#0062CC',
        boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'scale(0.96) translateY(0)',
      },
      [theme.breakpoints.down('sm')]: {
        height: 56,
        fontSize: '1.1rem',
      },
    },
    revealButton: {
      borderRadius: 12,
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      padding: '12px 24px',
    },
}))

export function CmllTrainerView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
  let { state, dispatch } = props
  let cube = state.cube.state
  let classes = useStyles()
  const theme = useTheme()
  let facelet = FaceletCube.from_cubie(cube, Mask.solved_mask)

  const use3D = (state.config.cmll2D3DSelector.getActiveName() || "3D") === "3D"
  const useFlat3D = (state.config.cmll2D3DSelector.getActiveName() || "3D") === "flat3D"
  const flat3DShowLFace = (state.config.cmllflat3DFaceSelector.getActiveName() || "L") === "L"
  const _3DShowLFace = (state.config.cmll3DFaceSelector.getActiveName() || "L") === "L"
  let kataMode = state.config.cmllKataSelector.getActiveName()

  if (kataMode !== "off") {
    facelet = FaceletCube.as_kata(facelet)
  }

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

  const colorSchemeColors = state.colorScheme.getColorsForOri(state.cube.ori)
  const gt_md = useMediaQuery(theme.breakpoints.up('md'));
  const gt_sm = useMediaQuery(theme.breakpoints.up('sm'));
  const canvas_wh = (gt_md) ? [520, 420] : (gt_sm) ? [440, 360] : [340, 280]

  const isContinuous = state.config.continuousPracticeSelector && 
                       state.config.continuousPracticeSelector.getActiveName() === "on";
  const scrambleTitle = isContinuous ? X.CONFIG.INCREMENTAL_SCRAMBLE : X.COMMON.SCRAMBLE;

  let alg = ""
  let setup = ""
  if (state.case.desc.length >= 2) {
    setup = state.case.desc[state.case.desc.length - 1].algs[0]
  }
  if (reveal && state.case.desc.length >= 1) {
    alg = state.case.desc.slice(0, state.case.desc.length - 1).map(x => x.algs[0]).join(" ")
  }

  return (
  <Box className={classes.container}>
    <Box className={classes.mainConsole}>
      {/* Header: Scramble */}
      <Box className={classes.scrambleHeader}>
        <Box sx={{ flex: 1 }}>
          <Box className={classes.title} sx={{ color: isContinuous ? 'primary.main' : 'inherit' }}>
            {scrambleTitle}
          </Box>
          <Typography className={classes.setup} sx={{ color: isContinuous ? 'primary.main' : 'inherit' }}>
            {isContinuous ? (
              <>
                {setup && setup.includes(' // ') ? (
                  <>
                    <Box component="span" sx={{ opacity: 0.6, fontSize: '0.9em' }}>
                      <Box component="span" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5, fontWeight: 700 }}>{X.COMMON.RETURN_LABEL}</Box>
                      {setup.split(' // ')[0]}
                    </Box>
                    <Box component="span" sx={{ mx: 1.5, opacity: 0.4 }}>|</Box>
                    <Box component="span" sx={{ fontWeight: 500 }}>
                      <Box component="span" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5, fontWeight: 700 }}>{X.COMMON.NEXT_LABEL}</Box>
                      {setup.split(' // ')[1]}
                    </Box>
                  </>
                ) : (
                  <>
                    <Box component="span" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 1, opacity: 0.8, fontWeight: 500 }}>{X.COMMON.NEXT_LABEL}</Box>
                    {setup || ' '}
                  </>
                )}
              </>
            ) : setup || ' '}
          </Typography>
        </Box>
      </Box>

        {/* Content: Solutions and Cube */}
        <Box className={classes.contentGrid}>
          {/* Left Column: Case/Solution */}
          <Box className={classes.solutionArea}>
            { (setup || alg) ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Box className={classes.title}>CASE</Box>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  { (!reveal) ?
                    <Button onFocus={(evt) => evt.target.blur() } className={classes.revealButton}
                      variant="outlined" color="primary" onClick={handleClick}>
                        {X.COMMON.REVEAL}
                    </Button>
                    :
                    <div>
                      <Typography style={{fontSize: "1.75rem", fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20}}>
                        { alg }
                      </Typography>
                      <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: 16, p: 3, display: 'inline-block' }}>
                        <CaseVisualizer
                          name=""
                          size={140}
                          alg={alg}
                          mask="cmll"
                          color={colorSchemeColors}
                          cubeOptions={{}}
                        />
                      </Box>
                    </div>
                  }
                </div>
              </div>
            ) : null }
          </Box>

          {/* Right Column: Cube View */}
          <Box className={classes.cubeArea}>
            {use3D ?
                <Box margin="auto">
                <CubeSim
                  width={canvas_wh[0]}
                  height={canvas_wh[1]}
                  cube={facelet}
                  colorScheme={colorSchemeColors}
                  theme={state.config.theme.getActiveName()}
                  facesToReveal={ _3DShowLFace ? [Face.L] : []}
                />
                </Box>
             :
             useFlat3D ?
               <Box margin="auto">
               <CubeSimFlat3D
                 width={canvas_wh[0]}
                 height={canvas_wh[1]}
                 cube={facelet}
                 colorScheme={colorSchemeColors}
                 theme={state.config.theme.getActiveName()}
                 facesToReveal={[ flat3DShowLFace ? Face.L : Face.R]}
               />
               </Box>
             :
                <Box margin="auto">
                <CubeSim2D
                  width={canvas_wh[0]}
                  height={canvas_wh[1]}
                  cube={facelet}
                  colorScheme={colorSchemeColors}
                  theme={state.config.theme.getActiveName()}
                />
                </Box>
            }
          </Box>
        </Box>

        {/* Footer: Main Action Button */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button onFocus={(evt) => evt.target.blur() } className={classes.button}
                variant="contained"
                onClick={handleNext}>
                  {X.COMMON.NEXT}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
    );
}

export function OllcpTrainerView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
  let { state, dispatch } = props
  let cube = state.cube.state
  let classes = useStyles()
  const theme = useTheme()
  let facelet = FaceletCube.from_cubie(cube, Mask.solved_mask)

  const use3D = (state.config.cmll2D3DSelector.getActiveName() || "3D") === "3D"
  let kataMode = state.config.cmllKataSelector.getActiveName()

  if (kataMode !== "off") {
    facelet = FaceletCube.as_kata(facelet)
  }

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

  const colorSchemeColors = state.colorScheme.getColorsForOri(state.cube.ori)
  const gt_md = useMediaQuery(theme.breakpoints.up('md'));
  const gt_sm = useMediaQuery(theme.breakpoints.up('sm'));
  const canvas_wh = (gt_md) ? [520, 420] : (gt_sm) ? [440, 360] : [340, 280]

  const isContinuous = state.config.continuousPracticeSelector && 
                       state.config.continuousPracticeSelector.getActiveName() === "on";
  const scrambleTitle = isContinuous ? X.CONFIG.INCREMENTAL_SCRAMBLE : X.COMMON.SCRAMBLE;

  let alg = ""
  let setup = ""
  if (state.case.desc.length >= 2) {
    setup = state.case.desc[state.case.desc.length - 1].algs[0]
  }
  if (reveal && state.case.desc.length >= 1) {
    // For OLLCP, join middle parts as solution
    const solutionDesc = state.case.desc.slice(0, state.case.desc.length - 1);
    const moves = new MoveSeq(solutionDesc.map(d => d.algs[0]).join(" "))
    let moves_c = moves.collapse()
    if (moves_c.moves.length > 0) {
      if (moves_c.moves[0].name[0] === "U") {
        alg += "(" + moves_c.moves[0].name + ") ";
        moves_c.moves = moves_c.moves.slice(1)
      }
      alg += moves_c.toString()
    }
  }

  return (
  <Box className={classes.container}>
    <Box className={classes.mainConsole}>
      {/* Header: Scramble */}
      <Box className={classes.scrambleHeader}>
        <Box sx={{ flex: 1 }}>
          <Box className={classes.title} sx={{ color: isContinuous ? 'primary.main' : 'inherit' }}>
            {scrambleTitle}
          </Box>
          <Typography className={classes.setup} sx={{ color: isContinuous ? 'primary.main' : 'inherit' }}>
            {isContinuous ? (
              <>
                {setup && setup.includes(' // ') ? (
                  <>
                    <Box component="span" sx={{ opacity: 0.6, fontSize: '0.9em' }}>
                      <Box component="span" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5, fontWeight: 700 }}>{X.COMMON.RETURN_LABEL}</Box>
                      {setup.split(' // ')[0]}
                    </Box>
                    <Box component="span" sx={{ mx: 1.5, opacity: 0.4 }}>|</Box>
                    <Box component="span" sx={{ fontWeight: 500 }}>
                      <Box component="span" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 0.5, fontWeight: 700 }}>{X.COMMON.NEXT_LABEL}</Box>
                      {setup.split(' // ')[1]}
                    </Box>
                  </>
                ) : (
                  <>
                    <Box component="span" sx={{ fontSize: '0.8rem', verticalAlign: 'middle', mr: 1, opacity: 0.8, fontWeight: 500 }}>{X.COMMON.NEXT_LABEL}</Box>
                    {setup || ' '}
                  </>
                )}
              </>
            ) : setup || ' '}
          </Typography>
        </Box>
      </Box>

      {/* Content: Solutions and Cube */}
      <Box className={classes.contentGrid}>
        {/* Left Column: Case/Solution */}
        <Box className={classes.solutionArea}>
          { (setup || alg) ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Box className={classes.title}>CASE</Box>
              <Box>
                { (!reveal) ?
                  <Button onFocus={(evt) => evt.target.blur() } className={classes.revealButton}
                    variant="outlined" color="primary" onClick={handleClick}>
                      {X.COMMON.REVEAL}
                  </Button>
                  :
                  <Box>
                    <Typography style={{fontSize: "1.75rem", fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20}}>
                      { alg }
                    </Typography>
                    <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: 16, p: 3, display: 'inline-block' }}>
                      <CaseVisualizer
                        name=""
                        size={140}
                        alg={alg}
                        mask="cmll"
                        color={colorSchemeColors}
                        cubeOptions={{}}
                      />
                    </Box>
                  </Box>
                }
              </Box>
            </div>
          ) : null }
        </Box>

        {/* Right Column: Cube View */}
        <Box className={classes.cubeArea}>
          {use3D ?
              <Box margin="auto">
              <CubeSim
                width={canvas_wh[0]}
                height={canvas_wh[1]}
                cube={facelet}
                colorScheme={colorSchemeColors}
                theme={state.config.theme.getActiveName()}
                facesToReveal={[Face.L]}
              />
              </Box>
           :
              <Box margin="auto">
              <CubeSim2D
                width={canvas_wh[0]}
                height={canvas_wh[1]}
                cube={facelet}
                colorScheme={colorSchemeColors}
                theme={state.config.theme.getActiveName()}
              />
              </Box>
          }
        </Box>
      </Box>

      {/* Footer: Main Action Button */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button onFocus={(evt) => evt.target.blur() } className={classes.button}
              variant="contained"
              onClick={handleNext}>
                {X.COMMON.NEXT}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Box>
  );
}

export default CmllTrainerView
