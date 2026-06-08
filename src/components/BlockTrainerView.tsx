import React, { Fragment } from 'react'

import CubeSim from './CubeSim'
import { Button, Typography, useTheme, FormControl, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import FavoriteIcon from '@mui/icons-material/Favorite';
import useMediaQuery from '@mui/material/useMediaQuery';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';


import { FaceletCube, Mask, MoveSeq } from '../lib/CubeLib';

import { AppState,  Action, FavCase, Mode} from "../Types";
import 'typeface-roboto-mono';
import { Face } from '../lib/Defs';

import { SingleSelect, MultiSelect, SliderSelect } from './SelectorViews';
import { ColorPanel } from './Input';
import { CaseDesc } from '../lib/Algs';
import { ScrambleInputView } from './ScrambleInputView';
import { CustomTooltip } from './Tooltip';
import { X } from '../Translation';
import { getInitialState } from '../reducers/InitialState';
import { StateFactory } from '../reducers/StateFactory';
import { BlockTrainerStateM } from '../reducers/BlockTrainerStateM';

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
      gap: 20,
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
    chainButton: {
      textTransform: 'none',
      fontSize: '0.85rem',
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 8,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 122, 255, 0.08)',
      color: theme.palette.primary.main,
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.25)' : 'rgba(0, 122, 255, 0.15)',
      },
    },
  }))


function getMask(state: AppState) : Mask {
    if (state.mode === "fbdr") {
      const fbOnly = (state.case.desc.length === 0 || state.case.desc[0].kind === "fb")
      //   getActiveName(state.config.fbOnlySelector) === "FB Last Pair"
      return fbOnly ? Mask.fb_mask : Mask.fbdr_mask
    }
    else if (state.mode === "fs") {
      let name = state.config.fsSelector.getActiveName()
      if (name === "Both" && state.case.desc.length > 0) {
        let kind = state.case.desc[0].kind;
        return (kind === "fs-back") ? Mask.fs_back_mask : Mask.fs_front_mask;
      }
      return ({
        "Front FS": Mask.fs_front_mask,
        "Back FS": Mask.fs_back_mask,
        "Both": Mask.fs_front_mask // fallback
      } as any)[name]
    }
    else if (state.mode === "fsdr") {
      let name = state.config.fsDrPosSelector.getActiveName()
      if (name === "Both" && state.case.desc.length > 0) {
        let kind = state.case.desc[0].kind;
        return (kind === "fsdr-back") ? Mask.fsdr_back_mask : Mask.fsdr_front_mask;
      }
      return ({
        "Front FS": Mask.fsdr_front_mask,
        "Back FS": Mask.fsdr_back_mask,
        "Both": Mask.fsdr_front_mask // fallback
      } as any)[name]
    }
    else if (state.mode === "ss") {
      if (state.case.desc.length === 0) return Mask.sb_mask
      let name = state.config.ssSelector.getActiveName()
      let dpair = state.config.ssPairOnlySelector.getActiveName() === "D-Pair only"

      switch (name) {
        case "Front SS": return dpair ? Mask.ssdp_front_mask : Mask.ss_front_mask;
        case "Back SS": return dpair ? Mask.ssdp_back_mask : Mask.ss_back_mask;
        default : return dpair ? Mask.ssdp_both_mask : Mask.f2b_mask
      }
    }
    else if (state.mode === "fb") {
      if (state.case.desc.length === 0 || state.case.desc[0].kind === "fb" || state.case.desc[0].kind.startsWith("fb@")) {
        return Mask.fb_mask
      }
      else if (state.case.desc[0].kind === "fbdr") {
        return Mask.fbdr_mask
      } else {
        return Mask.solved_mask
      }
    }
    else if (state.mode === "fbss") {
      let name = state.config.fbssSsSelector.getActiveName()
      return ({
        "Front SS": Mask.ss_front_mask,
        "Back SS": Mask.ss_back_mask,
        "Both": Mask.f2b_mask
      } as any)[name]
    }
    else if (state.mode === "4c" || state.mode === "eopair") {
      return Mask.solved_mask
    }
    else return Mask.sb_mask
}

function BlockTrainerView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
    let { state, dispatch } = props
    let cube = state.cube.state
    let classes = useStyles()

    let facelet = FaceletCube.from_cubie(cube, getMask(state))

    let desc : CaseDesc[] = state.case.desc.length ? state.case.desc :
       [ { algs: [""], setup: X.COMMON.NO_SOLUTION, id: "", kind: ""} ]

    let spaceButtonText = (state.name === "hiding") ? X.COMMON.REVEAL : X.COMMON.NEXT
    let showMoveCountHint = state.config.moveCountHint.getActiveName() === "Show"

    let describe_hide = (desc: CaseDesc[]) => {
      let minMove = desc.map( d =>
        d.algs.map(a => new MoveSeq(a).remove_setup().moves.length))
        .flat()
        .reduce( (a, b) => Math.min(a, b), 100 )
      return `(Min = ${minMove} STM)`
    }
    const handleSpace = () => {
      dispatch({type: "key", content: "#space"})
      if (state.name === "revealed") {
        setFav(false)
      }
    }

    const setup = desc.length ? desc[0].setup! : ""
    const showChainButtons = (state.mode === "fb" || state.mode === "fs" || state.mode === "fsdr" || state.mode === "fbdr")
      && (state.name === "revealed" || state.name === "revealed_all");
    const handleChainTrain = (alg: string) => {
      const currentOri = state.cube.ori;
      let targetMode: Mode;
      if (state.mode === "fb") {
        targetMode = "ss";
      } else if (state.mode === "fs" || state.mode === "fsdr") {
        const targetName = state.config.chainTargetSelector.getActiveName();
        targetMode = (targetName === "FBLP + SS") ? "fbss" : "fbdr";
      } else {
        // state.mode === "fbdr" → force jump to SS
        targetMode = "ss";
      }
      const newScramble = setup + " " + alg;
      dispatch({
        type: "custom",
        content: (state: AppState) => {
          let newState = getInitialState(targetMode);
          newState = { ...newState, scrambleInput: [newScramble] };
          const stateM = StateFactory.create(newState);
          let result = (stateM as BlockTrainerStateM)._updateCase();
          result.cube.ori = currentOri;
          return result;
        }
      });
    };
    const theme = useTheme()

    // source
    // Add event listeners
    React.useEffect(() => {
      function downHandler(event: KeyboardEvent) {
        if (event.key === " ") {
          const tag = (document.activeElement?.tagName || "").toLowerCase();
          if (tag === "input" || tag === "textarea") return;
          event.preventDefault();
          (document.activeElement as HTMLElement)?.blur();
        }
        if (event.key === " " && spaceButtonText === "Next") {
          setFav(false)
        }
        state.keyMapping.handle(event, dispatch);
      }
      window.addEventListener('keydown', downHandler);
      return () => {
        window.removeEventListener('keydown', downHandler);
      };
    }, [state.keyMapping, dispatch, spaceButtonText]);

    const [favSelected, setFav] = React.useState(false)
    const handleFav = () => {
      if (state.case.desc.length === 0) return
      const case_ : FavCase = {
        mode: state.mode,
        solver: state.case.desc.map(x => x.kind),
        setup: setup || ""
      }
      if (!favSelected){
        setFav(true)
        dispatch({type: "favList", content: [ case_ ], action: "add"})
      } else {
        setFav(false)
        dispatch({type: "favList", content: [ case_ ], action: "remove" })
      }
    }

    const gt_sm = useMediaQuery(theme.breakpoints.up('sm'));
    const gt_md = useMediaQuery(theme.breakpoints.up('md'));
    const canvas_wh = (gt_md) ? [520, 420] : (gt_sm) ? [440, 360] : [340, 280]
    const ADD_STR = (gt_sm) ? X.COMMON.ADD : "";

    let levelSelectionWarning = X.LEVEL_FAIL_WARNING
    let levelSelectionSuccess = state.cube.levelSuccess

    const scramblePanel =
          <Box style={{display: "flex", flexWrap: "wrap", padding: 0, gap: 8, alignItems: "center"}}>
            <ScrambleInputView display = {setup}
                dispatch={dispatch} scrambles={state.scrambleInput}/>

            <Box>
            {
              gt_sm ?
              <Button variant="outlined"
                  color="primary"
                  size="small"
                  name="fav"
                  onClick={handleFav}
                  startIcon={<FavoriteIcon/>}
                  sx={{ borderRadius: 4, textTransform: 'none', fontWeight: 500 }}
                  >
                  {favSelected ? "✓" : ADD_STR}
              </Button>
              :
              null
            }
            </Box>
          </Box>

    const isContinuous = state.config.continuousPracticeSelector && 
                         state.config.continuousPracticeSelector.getActiveName() === "on";
    const scrambleTitle = isContinuous ? X.CONFIG.INCREMENTAL_SCRAMBLE : X.COMMON.SCRAMBLE;

    return (
    <Box className={classes.container}>
      <Box className={classes.mainConsole}>
        {/* Header: Scramble and Action Icons */}
        <Box className={classes.scrambleHeader}>
          <Box sx={{ flex: 1 }}>
            <Box className={classes.title} sx={{ color: isContinuous ? 'primary.main' : 'inherit' }}>
              {scrambleTitle}
            </Box>
            <Typography className={classes.setup} sx={{ color: isContinuous ? 'primary.main' : 'inherit' }}>
              {isContinuous ? (
                <>
                  {setup.includes(' // ') ? (
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
                      {setup}
                    </>
                  )}
                </>
              ) : setup}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {gt_sm && scramblePanel}
          </Box>
        </Box>

        {/* Content: Solutions and Cube */}
        <Box className={classes.contentGrid}>
          {/* Left Column: Solutions */}
          <Box className={classes.solutionArea}>
            {(state.name === "hiding" || state.name === "revealed" || state.name === "revealed_all") ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Box className={classes.title}>{X.COMMON.SOLUTIONS}</Box>
                <Box>
                  {(state.name === "hiding") ? (
                    <Typography style={{fontSize: "1.4rem", fontWeight: 500, color: theme.palette.text.secondary, opacity: 0.7}}>
                      {showMoveCountHint ? describe_hide(desc) : "···"}
                    </Typography>
                  ) : (
                    desc.map((caseDesc, ci) => (
                      <Box key={ci} sx={{ mb: ci < desc.length - 1 ? 3 : 0 }}>
                        {desc.length > 1 && (
                          <Typography style={{fontWeight: 700, fontSize: "0.9rem", color: theme.palette.primary.main, marginBottom: 8}}>
                            {caseDesc.kind.toUpperCase()}
                          </Typography>
                        )}
                        {caseDesc.algs.map((alg, ai) => (
                          <Box key={ai} style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
                            <Typography style={{flex: 1, fontSize: "1.45rem", fontWeight: 600, letterSpacing: '-0.01em'}}>
                              {alg}
                            </Typography>
                            {showChainButtons && alg && (
                              <Button size="small" className={classes.chainButton}
                                onClick={() => handleChainTrain(alg)}>
                                {X.COMMON.CHAIN_PRACTICE}
                              </Button>
                            )}
                          </Box>
                        ))}
                      </Box>
                    ))
                  )}
                </Box>
              </div>
            ) : null}
          </Box>

          {/* Right Column: Cube View */}
          <Box className={classes.cubeArea}>
            { props.state.config.showCube.getActiveName() === "Show" ?
              <CubeSim
                width={canvas_wh[0]}
                height={canvas_wh[1]}
                cube={facelet}
                colorScheme={state.colorScheme.getColorsForOri(state.cube.ori)}
                hintDistance={ (state.mode === "4c" || state.mode === "eopair") ? 3 : 7 }
                theme={state.config.theme.getActiveName()}
                facesToReveal={ [Face.L, Face.B, Face.D]  }
                obscureNonLR={state.mode === "ss" && state.config.obscureNonLRSelector.getActiveName() === "On"}
                obscureStickerWidth={state.mode === "ss" ? state.config.obscureStickerWidthSelector.getActiveName() : undefined}
                obscureCornerMask={state.mode === "ss" && state.config.obscureCornerMaskSelector.getActiveName() === "On"}
              /> : null }
          </Box>
        </Box>

        {/* Footer: Main Action Button */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button onFocus={(evt) => evt.target.blur() } className={classes.button}
                variant="contained"
                onClick={handleSpace}>
                  {spaceButtonText}
              </Button>
            </Grid>
            {!levelSelectionSuccess && (
              <Grid item>
                <CustomTooltip title={levelSelectionWarning}>
                  <IconButton color="error">
                    <ErrorOutlineIcon sx={{ fontSize: 32 }}/>
                  </IconButton>
                </CustomTooltip>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
    );
}



export default BlockTrainerView
