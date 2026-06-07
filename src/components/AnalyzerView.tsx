import React, { Fragment } from 'react'

import CubeSim from './CubeSim'
import { Button, Typography, useTheme, FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { CubeUtil, CubieCube, FaceletCube, Mask, MoveSeq } from '../lib/CubeLib';

import { AppState, Action} from "../Types";
import 'typeface-roboto-mono';
import { Face, Typ } from '../lib/Defs';

import { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { AnalyzerState, SolutionDesc, initialState, analyze_roux_solve, fbStageT } from '../lib/Analyzer';

import { useAnalyzer } from "../lib/Hooks";

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

import Chip from '@mui/material/Chip';
import { CachedSolver } from '../lib/CachedSolver';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';

import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ColorScheme } from '../lib/CubeLib';
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
    button: {
      width: "100%",
      height: 48,
      borderRadius: 14,
      fontSize: '1rem',
      fontWeight: 700,
      textTransform: 'none',
      transition: 'all 0.2s',
      boxShadow: 'none',
    },
    configItem: {
      paddingRight: 15
    },
    formControl: {
      margin: theme.spacing(0),
      minWidth: 100,
    },
    menu: {
        '& .MuiMenuItem-root': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
    fgap: {
      flexGrow: 1,
    },
    stage: {
      paddingTop: 5,
      paddingLeft: 5,
    },
    stageText: {
      color: theme.palette.text.primary,
      textTransform: "none"
    },
    mySolutionPanel: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(3),
      borderRadius: 20,
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      border: '1px solid ' + (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
    }
  }))

const resetState = (state: AnalyzerState) => {
  return {
    ...state,
    postScramble: "",
    full_solution: [],
    scramble: "",
    stage: "fb"
  }
}
function ScrambleView(props: { state: AnalyzerState, setState: (newState: AnalyzerState) => void, dispatch: React.Dispatch<Action> }) {
    let { state, setState, dispatch } = props
    let classes = useStyles()
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    let [ value, setValue ] = React.useState(state.scramble)
    let [ editing, setEditing ] = React.useState(false)
    let textField = React.useRef<HTMLInputElement | null>(null)

    let onScrambleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event?.target.value)
      event.stopPropagation()
    }

    let handleGen = () => {
      let cube = CubeUtil.get_random_with_mask(Mask.empty_mask)
      let scramble = CachedSolver.get("min2phase").solve(cube,0,0,0)[0].inv().toString()
      setState({...resetState(state), scramble})
      setValue(scramble)
    }
    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation()
    }

    React.useEffect(() => {
      setValue(state.scramble)
    }, [state.scramble])

    return (
        <Box className={classes.scrambleHeader}>
      <div style={{ flex: 1 }}>
        <Box className={classes.title}>{X.COMMON.SCRAMBLE}</Box>
        <Typography className={classes.setup}>{value || ' '}</Typography>
      </div>

      <Box style={{display: "flex", flexWrap: "wrap", padding: 0, gap: 12, alignItems: "center", marginTop: isSmallScreen ? 12 : 0}}>
        <Button variant="outlined" color="primary" className={classes.button}
          onClick={() => setEditing(true)}
          sx={{ px: 3, width: 'auto' }}
          startIcon={<EditIcon />}>
          {X.COMMON.INPUT}
        </Button>
        <Button onFocus={(evt) => evt.target.blur()} onClick={handleGen}
              className={classes.button} variant="contained" color="primary"
              sx={{ px: 3, width: 'auto' }}>
                {X.ANALYZER.GEN}
        </Button>
      </Box>

      <Dialog open={editing}
              onClose={() => setEditing(false)}
              onKeyPress={onKeyPress}
              onKeyDown={onKeyPress}
              onKeyUp={onKeyPress}
              PaperProps={{ sx: { borderRadius: 20, p: 2 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>{X.ANALYZER.INPUT_SCRAMBLE_DIALOG}</DialogTitle>
          <DialogContent>
                <TextField
                    inputRef={textField}
                    multiline
                    size="medium"
                    fullWidth
                    maxRows={10}
                    rows={4}
                    autoFocus
                    value={value}
                    onChange={onScrambleChange}
                    variant="outlined"
                    sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 12 } }}>
                </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => {
                let cube = CubeUtil.get_random_with_mask(Mask.empty_mask)
                let scramble = CachedSolver.get("min2phase").solve(cube,0,0,0)[0].inv().toString()
                setValue(scramble)
              }} color="primary" variant="outlined" sx={{ borderRadius: 10, textTransform: 'none' }}>
                  {X.ANALYZER.GEN}
              </Button>
              <Button onClick={() => {
                setEditing(false)
                setState({...resetState(state), scramble: value})
              }} color="primary" variant="contained" sx={{ borderRadius: 10, textTransform: 'none' }}>
                  {X.COMMON.OK}
              </Button>
          </DialogActions>
      </Dialog>
    </Box> )
}


function SolutionInputView(props: { state: AnalyzerState, setState: (newState: AnalyzerState) => void}) {
  let [editing, setEditing] = React.useState(false)
  let [value, setValue] = React.useState("")
  let textField = React.useRef<HTMLInputElement | null>(null)
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
      event.stopPropagation()
  }
  const toggleEdit = () => {
      setEditing(true)
  }
  const handleClose = () => {
    setEditing(false)
    let full_solution = analyze_roux_solve(new CubieCube().apply(props.state.scramble), new MoveSeq(value))
    if ( (full_solution.length > 1) || (full_solution.length === 1 && full_solution[0].solution.moves.length > 0)) {
      props.setState({...props.state, full_solution})
    }
  }

  return <Box>
    <Box >
          <Button variant={editing ? "contained" : "outlined"}
              color="primary"
              size="small"
              onClick={toggleEdit}
              sx={{ borderRadius: 10, textTransform: 'none', px: 2 }}
              startIcon={<EditIcon />}
          >
              {X.ANALYZER.INPUT_YOUR_SOLUTION}
          </Button>
    </Box>

    <Dialog open={editing}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 20, p: 1 } }}
            >
          <DialogTitle sx={{ fontWeight: 700 }}> {X.ANALYZER.INPUT_SOLUTION_DIALOG} </DialogTitle>
          <DialogContent>
                <TextField
                    inputRef={textField}
                    multiline
                    size="medium"
                    fullWidth
                    maxRows={10}
                    rows={5}
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 12 } }}>
                </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleClose} color="primary" variant="contained" fullWidth sx={{ borderRadius: 10, py: 1 }} >
                  {X.COMMON.CONFIRM}
              </Button>
          </DialogActions>
    </Dialog>
  </Box>
}


// Generic memoization function
function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
    const cache = new Map<string, R>();

    return (arg: T) => {
        const key = String(arg);
        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = fn(arg);
        cache.set(key, result);
        return result;
    };
}

// The actual rotation shortening function without caching logic
function _shorten_rotation(rotation: string): string {
    const rotation_inv = new MoveSeq(rotation).inv();
    const cube = new CubieCube().apply(rotation_inv);
    const solution = CachedSolver.get("center").solve(cube, 0, 3, 1)[0];
    return solution.toString();
}

// Create the memoized version
export const get_shortened_rotation = memoize(_shorten_rotation);

// Add this color mapping at the top level
const colorMap : { [key: string]: string } = ColorScheme.default_colors;

// Add this component for the color squares
function ColorPair({ colors }: { colors: string[] }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.2}}>
      {colors.map((color, i) => (
        <Box
          key={i}
          sx={{
            width: '1.0rem',
            height: '1.1rem',
            backgroundColor: colorMap[color],
            border: '1px solid rgba(0,0,0,0.5)',
            display: 'inline-block'
          }}
        />
      ))}
    </Box>
  );
}

// Modify the _orientation_fb_name function to return colors instead of names
function _orientation_fb_colors(orientation: string): string[] {
    const cube = new CubieCube().apply(orientation)
    const dl_d = FaceletCube.color_of_sticker(cube, [5, 0, Typ.E])
    const dl_l = FaceletCube.color_of_sticker(cube, [5, 1, Typ.E])
    const color_lookup = ["W", "Y", "G", "B", "O", "R"]
    return [color_lookup[dl_d], color_lookup[dl_l]]
}
export const get_orientation_fb_colors = memoize(_orientation_fb_colors);

function StageSolutionView(props: { solution: SolutionDesc, shortestLength?: number }) {
  let { solution, stage, premove, orientation, fb_tag } = props.solution
  let getTags = () => {
    if (stage === "fb") {
      const colors = get_orientation_fb_colors(orientation || "")
      return [<ColorPair key="colors" colors={colors} />, fb_tag].filter(Boolean)
    } else if (stage === "ss-front" || stage === "ss-back"){
      return [ stage ]
    } else return []
  }
  let tags = getTags()
  const isShortest = props.shortestLength !== undefined && solution.moves.length === props.shortestLength
  const shortened_rotation = get_shortened_rotation(orientation + " " + premove)

  return (
    <Box style={{display: "flex", marginBottom: "4px", alignItems: "center", minWidth: 0}}>
      {tags.filter(x=>x).map( (t, i) =>
        <Chip variant="outlined" size="small" color="primary" label={t} key={i}
          sx={{ '& .MuiChip-label': { fontSize: '0.75rem', fontWeight: 600, padding: '0 6px',
                                      minWidth: "5ch", textAlign: "center",
                                      display: "flex",
                                      alignItems: "center", justifyContent: "center" } }} />
      )}
      <Box style={{width: "1ch"}} />
      <Box style={{minWidth: 0}}>
        <Typography sx={{
          fontSize: "1.1rem",
          fontWeight: 500,
          fontFamily: '"SF Mono", "Roboto Mono", monospace',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          lineHeight: 1.4,
        }}>
          {shortened_rotation + " " + solution.moves.map(m => m.name).join(" ")}
          {isShortest && " (*)"}
        </Typography>
      </Box>
    </Box>
  )
}


function StageSolutionListView(props: { solutions: SolutionDesc[], num_to_display: number, state: AnalyzerState, setState: (newState: AnalyzerState) => void} ) {
  let { solutions, num_to_display, state } = props
  if (solutions.length === 0) return null

  const [isRevealed, setIsRevealed] = React.useState(!state.hide_solutions)

  // Update isRevealed when hide_solutions changes
  React.useEffect(() => {
    setIsRevealed(!state.hide_solutions)
  }, [state.hide_solutions, solutions])

  // Find the shortest solution by STM length
  const shortestSolution = solutions.length > 0 ?
    solutions.reduce((shortest, current) =>
      current.solution.moves.length < shortest.solution.moves.length ? current : shortest
    ) : null

  const handleClick = () => {
    setIsRevealed(true)
  }

  const shortest_length = shortestSolution?.solution.moves.length || 0
  const shortest_solutions = solutions.filter(s => s.solution.moves.length === shortest_length)

  const tag_full_name : Record<string, string> = {
    "FS": "FS",
    "FB": "FB",
    "Ps": "Pseudo FS",
    "Line": "E-Line + 1c"
  }
  const shortest_solution_tag_names = shortest_solutions.map(s => ({tag: tag_full_name[s.fb_tag || "FB"], fb_name: get_orientation_fb_colors(s.orientation || "")}))
  const shortest_tag_names = shortest_solution_tag_names.reduce((acc, curr) => {
    if (!acc[curr.tag]) { acc[curr.tag] = new Set() }
    acc[curr.tag].add(curr.fb_name.join("-"))
    return acc
  }, {} as Record<string, Set<string>>)
  const shortest_tag_names_str = Object.entries(shortest_tag_names).map(([tag, fb_names]) => {
    const colorPairs = [...fb_names].map(name => {
      const [color1, color2] = name.split("-");
      return <ColorPair key={name} colors={[color1, color2]} />;
    });

    return (
      <React.Fragment key={tag}>
        <Box sx={{ width: "100%", mb: 1 }}>
          <Typography variant="body1" color="text.primary" sx={{ fontSize: "1.05rem", textAlign: "center", fontWeight: 500 }} >
            {X.ANALYZER.EXISTS_STM_SOLUTION(shortest_length, tag || "solution")}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.0, justifyContent: "center", mb: 2 }}>
          {colorPairs}
        </Box>
      </React.Fragment>
    );
  })

  return (
    <div style={{ lineHeight: 1 }}>
      {solutions.length > 0 && (
        <Box onClick={!isRevealed ? handleClick : undefined} sx={{ cursor: !isRevealed ? 'pointer' : 'default' }}>
          {!isRevealed ? (
            <Box sx={{ width: "100%" }}>
              {shortest_tag_names_str}
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: "1.0rem", textAlign: "center", fontStyle: 'italic' }}>
                {X.ANALYZER.CLICK_TO_REVEAL}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {solutions.slice(0, num_to_display).map((s, i) => (
                <StageSolutionView
                  solution={s}
                  key={i}
                  shortestLength={shortestSolution?.solution.moves.length}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </div>
  )
}

function FullSolutionView(props: { state: AnalyzerState, setState: (newState: AnalyzerState) => void} ) {
  let { state, setState } = props
  let classes = useStyles()

  let setStage = (i: number) => () => {
    setState({...state,
      stage: state.full_solution[i].stage,
      post_scramble: state.full_solution.slice(0, i).map(x => x.premove + x.solution.toString()).join(" ")
    })
  }
  let [show, setShow] = React.useState(-1)
  let stageView = (sol: SolutionDesc, i: number) => {
    return (
      <Box display="flex" key={i} className={classes.stage}
        onMouseLeave={ () => setShow(-1)} onMouseEnter={() => setShow(i)} onClick={() => setShow(show === i ? -1 : i)}>
        <Button variant={"text"}
              color="primary"
              size="small"
              onClick={setStage(i)}
              sx={{
                textTransform: 'none',
                marginLeft: 1,
                borderRadius: 8,
                px: 2,
                border: (show === i) ? "1px solid " + (initialState.orientation ? '#007AFF' : 'rgba(0,0,0,0.1)') : "1px solid transparent"
              }} >
        <Typography variant="body2" className={classes.stageText} sx={{ fontFamily: '"SF Mono", monospace', fontWeight: 600 }}>
          {sol.solution.toString()} <span style={{opacity: 0.4, margin: '0 8px'}}>//</span> {sol.stage}
        </Typography>
        <SearchIcon fontSize="small" sx={{ ml: 1, opacity: 0.6 }}/>
        </Button>

      </Box>
    )
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <SolutionInputView state={state} setState={setState}/>
        {state.full_solution.length > 0 && (
          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
            {X.ANALYZER.MY_SOLUTION.toUpperCase()}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        { props.state.full_solution.map( (desc, i) => stageView(desc, i))}
      </Box>
    </Box>
  )

}

function AnalyzerView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
    let { state: appState, dispatch } = props

    const theme = useTheme()
    let [ state, setState ] = React.useState(initialState)

    // Keyboard handler: space generates new scramble
    React.useEffect(() => {
      function downHandler(event: KeyboardEvent) {
        if (event.key !== " ") return
        const tag = (document.activeElement?.tagName || "").toLowerCase()
        if (tag === "input" || tag === "textarea") return
        event.preventDefault()
        let cube = CubeUtil.get_random_with_mask(Mask.empty_mask)
        let scramble = CachedSolver.get("min2phase").solve(cube, 0, 0, 0)[0].inv().toString()
        setState(prev => ({...resetState(prev), scramble}))
      }
      window.addEventListener('keydown', downHandler)
      return () => window.removeEventListener('keydown', downHandler)
    })

    let classes = useStyles()

    let mask = Mask.solved_mask
    let cubieCube = new CubieCube().apply(state.scramble).apply(state.post_scramble)
    let faceletCube = FaceletCube.from_cubie(cubieCube, mask)

    const analyzerData = useAnalyzer(state)

    let solutions_to_display = analyzerData.isRunning ? [] : (analyzerData.solutions || [])
    let num_solutions_to_display = solutions_to_display.length

    if (state.show_mode === "combined") {
      solutions_to_display = solutions_to_display.sort( (x, y) => x.score - y.score)
      num_solutions_to_display = state.num_solution
    }

    const gt_md = useMediaQuery(theme.breakpoints.up('md'));
    const gt_sm = useMediaQuery(theme.breakpoints.up('sm'));
    const canvas_wh = (gt_md) ? [520, 420] : (gt_sm) ? [440, 360] : [340, 280]

    // Sync local state from global analyzer config
    React.useEffect(() => {
      const ac = appState.analyzerConfig;
      setState(prev => ({
        ...prev,
        orientation: ac.orientation,
        pre_orientation: ac.pre_orientation,
        show_mode: ac.show_mode,
        num_solution: ac.num_solution,
        fb_stage: ac.fb_stage as fbStageT,
        hide_solutions: ac.hide_solutions,
      }));
    }, [appState.analyzerConfig]);

    return (
    <Box className={classes.container}>
      <Box className={classes.mainConsole}>
        <ScrambleView state={state} setState={setState} dispatch={dispatch}/>

        <Box className={classes.contentGrid}>
          {/* Left Column: Solutions */}
          <Box className={classes.solutionArea}>
            {solutions_to_display.length > 0 ? (
              <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Box className={classes.title}>{X.COMMON.SOLUTIONS}</Box>
                <Box sx={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                  <StageSolutionListView solutions={solutions_to_display} num_to_display={num_solutions_to_display} state={state} setState={setState}/>
                </Box>
              </div>
            ) : null}

            {/* My Solution Area (Integrated) */}
            <Box className={classes.mySolutionPanel}>
              <FullSolutionView state={state} setState={setState}/>
            </Box>
          </Box>

          {/* Right Column: Cube View */}
          <Box className={classes.cubeArea}>
            <Box style={{
              backgroundColor: "rgba(0, 0, 0, 0)",
              transform: `scale(${appState.analyzerConfig.cube_scale})`,
              transformOrigin: 'top center',
              maxWidth: '100%',
            }}>
              <CubeSim
                width={canvas_wh[0]}
                height={canvas_wh[1]}
                cube={faceletCube}
                colorScheme={appState.colorScheme.getColorsForOri("WG")}
                hintDistance={ 6 }
                theme={appState.config.theme.getActiveName()}
                facesToReveal={ [Face.L, Face.B, Face.D]  }
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
    );
}

export default AnalyzerView
