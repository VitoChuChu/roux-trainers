import React, { Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Divider, Typography, FormControl, FormLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { AppState, Action, Mode } from '../Types';
import { SingleSelect, MultiSelect, SliderSelect } from './SelectorViews';
import { ColorPanel } from './Input';
import CaseSelectDialog from './CaseSelectView';
import { cmll_algs_raw, nmcll_display_parity, nmcll_to_cmll_mapping, ollcp_algs_raw } from '../lib/Algs';
import { X } from '../Translation';
import { getTabModes } from './AppView';

const cmll_name_to_alg = Object.fromEntries(cmll_algs_raw)
const nmcll_display_algs = nmcll_to_cmll_mapping.map( ([x, y], i) => {
  let parity = nmcll_display_parity[i]
  let alg = cmll_name_to_alg[y[0][0]]
  alg = parity[2] + " " + alg + " " + parity[1]
  return [x, alg] as [string, string]
})

const useStyles = makeStyles(theme => ({
  drawer: {
    padding: theme.spacing(1.5, 2, 2, 2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 6,
  },
  modeSelect: {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    borderRadius: 4,
    height: 32,
    fontWeight: 500,
    fontSize: '0.8rem',
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    },
    '& .MuiSelect-icon': {
      color: theme.palette.text.secondary,
    },
    '& .MuiSelect-select': {
      paddingTop: 5,
      paddingBottom: 5,
    },
    [theme.breakpoints.down('md')]: {
      height: 44,
      '& .MuiSelect-select': {
        paddingTop: 10,
        paddingBottom: 10,
      },
    },
  },
  sectionTitle: {
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: theme.palette.text.disabled,
    marginBottom: 8,
    marginTop: 20,
  },
  sectionTitleFirst: {
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: theme.palette.text.disabled,
    marginBottom: 8,
  },
  configPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  selectLabel: {
    color: theme.palette.text.disabled,
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  prompt: {
    color: theme.palette.text.secondary,
    '& pre': {
      fontFamily: 'inherit',
      lineHeight: 1.6,
      fontSize: '0.8rem',
    },
  },
}));

function NMCLLSelect(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const { state, dispatch } = props;
  const groups = ["o", "s", "as", "t", "u", "l", "pi", "h"];
  return <CaseSelectDialog {...{ state, dispatch, settings: {
    selector: "nmcllSelector",
    groups,
    algs: nmcll_display_algs,
    visualizeMask: "cmll",
    cubeOptions: {
      colorScheme: { 0: '#ffffff', 1: '#ee0000', 2: '#404040', 3: '#404040', 4: '#ffa100', 5: '#404040' }
    }
  },
    title: X.CONFIG.NMCLL_DIALOG_TITLE,
    label: X.CONFIG.SELECT_BY_NMCLL
  }} />;
}

function BlockConfigPanel(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const { state, dispatch } = props;
  const classes = useStyles();
  const mode = state.mode;

  if (mode === "ss") {
    let DRManip = [
      { name: X.LEVEL_SELECT.TOGGLE_SELECT_ALL, enableIdx: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
      { name: X.LEVEL_SELECT.TOGGLE_ALL_ORIENTED, enableIdx: [0, 2, 4, 6, 8, 10, 12, 14, 16] },
    ];
    return (
      <Box className={classes.configPanel}>
        <SliderSelect {...{ state, dispatch, select: "ssLevelSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "ssSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "ssPairOnlySelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <SingleSelect {...{ state, dispatch, select: "showCube" }} />
        <Box>
          <SingleSelect {...{ state, dispatch, select: "obscureNonLRSelector" }} />
          {state.config.obscureNonLRSelector.getActiveName() === "On" &&
            <SingleSelect {...{ state, dispatch, select: "obscureStickerWidthSelector" }} />
          }
          {state.config.obscureNonLRSelector.getActiveName() === "On" &&
            <SingleSelect {...{ state, dispatch, select: "obscureCornerMaskSelector" }} />
          }
        </Box>
        <MultiSelect {...{ state, dispatch, select: "ssPosSelector", options: { manipulators: DRManip } }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  } else if (mode === "fbdr") {
    let LPEdgeManip = [
      { name: X.LEVEL_SELECT.TOGGLE_SELECT_ALL, enableIdx: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
    ];
    return (
      <Box className={classes.configPanel}>
        <SliderSelect {...{ state, dispatch, select: "fbdrLevelSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbOnlySelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbdrSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbPairSolvedSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbdrScrambleSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <SingleSelect {...{ state, dispatch, select: "showCube" }} />
        <MultiSelect {...{ state, dispatch, select: "fbdrPosSelector1", options: { manipulators: LPEdgeManip } }} />
        <MultiSelect {...{ state, dispatch, select: "fbdrPosSelector3", options: { manipulators: LPEdgeManip } }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  } else if (mode === "fb") {
    return (
      <Box className={classes.configPanel}>
        <SliderSelect {...{ state, dispatch, select: "fbLevelSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbPieceSolvedSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <SingleSelect {...{ state, dispatch, select: "showCube" }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  } else if (mode === "fs" || mode === "fsdr") {
    return (
      <Box className={classes.configPanel}>
        <SliderSelect {...{ state, dispatch, select: "fsLevelSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fsSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <SingleSelect {...{ state, dispatch, select: "showCube" }} />
        <SingleSelect {...{ state, dispatch, select: "chainTargetSelector" }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  } else if (mode === "fbss") {
    return (
      <Box className={classes.configPanel}>
        <SliderSelect {...{ state, dispatch, select: "fbssLevelSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbssLpSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "fbssSsSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  } else if (mode === "4c") {
    return (
      <Box className={classes.configPanel}>
        <SingleSelect {...{ state, dispatch, select: "lseStageSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "lseMCSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "lseBarSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <SingleSelect {...{ state, dispatch, select: "showCube" }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  } else if (mode === "eopair") {
    return (
      <Box className={classes.configPanel}>
        <MultiSelect {...{ state, dispatch, select: "lseEOSelector", options: { noDialog: true } }} />
        <SingleSelect {...{ state, dispatch, select: "lseEOLRMCSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "lseBarbieSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "lseEOLRScrambleSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "solutionNumSelector" }} />
        <SingleSelect {...{ state, dispatch, select: "moveCountHint" }} />
        <SingleSelect {...{ state, dispatch, select: "showCube" }} />
        <ColorPanel {...{ state, dispatch }} />
      </Box>
    );
  }
  return null;
}

function CmllConfigPanel(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const { state, dispatch } = props;
  const classes = useStyles();

  const cmllcubemaskSel = "cmllCubeMaskSelector";
  const cmllaufSel = "cmllAufSelector";
  const triggerSel = "triggerSelector";
  const hyperoriSel = "hyperOriSelector";
  const _2d3dSel = "cmll2D3DSelector";
  const kataSel = "cmllKataSelector";

  const use3D = (state.config.cmll2D3DSelector.getActiveName() || "3D") === "3D";
  const useFlat3D = (state.config.cmll2D3DSelector.getActiveName() || "3D") === "flat3D";
  const hyperori = state.config.hyperOriSelector.getActiveName() || "off";

  return (
    <Box className={classes.configPanel}>
      <CaseSelectDialog {...{ state, dispatch, settings: {
        selector: "cmllCaseSelector",
        algs: cmll_algs_raw,
        groups: ["o", "s", "as", "t", "u", "l", "pi", "h"],
        visualizeMask: "cmll",
        cubeOptions: {
          colorScheme: { 0: '#FEFE00', 1: '#ffa100', 2: '#00b800', 3: '#404040', 4: '#ee0000', 5: '#0000f2' }
        }
      },
        label: X.CONFIG.SELECT_CMLL_CASES
      }} />

      <MultiSelect {...{ state, dispatch, select: cmllaufSel, options: { label: X.CONFIG.CMLL_AUF, noDialog: true } }} />
      <MultiSelect {...{ state, dispatch, select: triggerSel, options: { label: X.CONFIG.SB_LAST_PAIR_TRIGGER, noDialog: true } }} />

      <Divider />

      <SingleSelect {...{ state, dispatch, select: cmllcubemaskSel, label: X.CONFIG.VIRTUAL_CUBE }} />
      <SingleSelect {...{ state, dispatch, select: _2d3dSel, label: X.CONFIG.VISUALIZE_AS }} />

      {use3D && <SingleSelect {...{ state, dispatch, select: "cmll3DFaceSelector", label: X.CONFIG.SHOW_L_FACE }} />}
      {useFlat3D && <SingleSelect {...{ state, dispatch, select: "cmllflat3DFaceSelector", label: X.CONFIG.LR_FACES_REVEAL }} />}

      <SingleSelect {...{ state, dispatch, select: kataSel, label: X.CONFIG.RECOG_STICKERS_ONLY }} />
      <ColorPanel {...{ state, dispatch }} />

      <Divider />

      <SingleSelect {...{ state, dispatch, select: hyperoriSel, label: X.CONFIG.NMCLL_RECOG_MODE }} />
      {hyperori !== "off" && <NMCLLSelect {...{ state, dispatch }} />}
    </Box>
  );
}

function OllcpConfigPanel(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const { state, dispatch } = props;
  const classes = useStyles();
  const _2d3dSel = "cmll2D3DSelector";
  const kataSel = "cmllKataSelector";

  return (
    <Box className={classes.configPanel}>
      <CaseSelectDialog {...{ state, dispatch, settings: {
        selector: "ollcpCaseSelector",
        algs: ollcp_algs_raw,
        groups: ["34", "39", "45", "51", "56", "13", "14"],
        visualizeMask: "coll",
        cubeOptions: {
          colorScheme: { 0: '#FEFE00', 1: '#ffa100', 2: '#00b800', 3: '#404040', 4: '#ee0000', 5: '#0000f2' }
        }
      },
        label: X.CONFIG.SELECT_OLLCP_CASES
      }} />
      <SingleSelect {...{ state, dispatch, select: _2d3dSel, label: X.CONFIG.VISUALIZE_AS }} />
      <SingleSelect {...{ state, dispatch, select: kataSel, label: X.CONFIG.RECOG_STICKERS_ONLY }} />
      <ColorPanel {...{ state, dispatch }} />
    </Box>
  );
}

function AnalyzerConfigPanel(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const { state, dispatch } = props;
  const ac = state.analyzerConfig;
  const classes = useStyles();

  const updateAc = (patch: Partial<typeof ac>) => {
    dispatch({
      type: "custom",
      content: (s: AppState) => ({ ...s, analyzerConfig: { ...s.analyzerConfig, ...patch } })
    });
  };

  return (
    <Box className={classes.configPanel}>
      <Box>
        <FormLabel component="legend" className={classes.selectLabel}>{X.CONFIG.FB_ORIENTATION}</FormLabel>
        <Select
          fullWidth size="small" variant="standard" disableUnderline
          value={ac.orientation + "," + ac.pre_orientation}
          onChange={(e) => {
            const [o, p] = (e.target.value as string).split(",");
            updateAc({ orientation: o, pre_orientation: p || "" });
          }}
          sx={{ fontSize: '0.8rem', mt: 0.5 }}
        >
          <MenuItem value={"x2y,"} dense>{X.CONFIG.ORI_X2Y_WY}</MenuItem>
          <MenuItem value={"x2y,x"} dense>{X.CONFIG.ORI_X2Y_BG}</MenuItem>
          <MenuItem value={"x2y,z"} dense>{X.CONFIG.ORI_X2Y_RO}</MenuItem>
          <MenuItem value={"cn,"} dense>{X.CONFIG.ORI_CN}</MenuItem>
        </Select>
      </Box>

      <Box>
        <FormLabel component="legend" className={classes.selectLabel}>{X.CONFIG.ORGANIZE}</FormLabel>
        <Select
          fullWidth size="small" variant="standard" disableUnderline
          value={ac.show_mode}
          onChange={(e) => updateAc({ show_mode: e.target.value as string })}
          sx={{ fontSize: '0.8rem', mt: 0.5 }}
        >
          <MenuItem value={"foreach"} dense>{X.CONFIG.ORGANIZE_BY_FB}</MenuItem>
          <MenuItem value={"combined"} dense>{X.CONFIG.ORGANIZE_COMBINED}</MenuItem>
        </Select>
      </Box>

      <Box>
        <FormLabel component="legend" className={classes.selectLabel}>{X.CONFIG.NUM_SOLUTIONS}</FormLabel>
        <Select
          fullWidth size="small" variant="standard" disableUnderline
          value={ac.num_solution}
          onChange={(e) => updateAc({ num_solution: Number(e.target.value) })}
          sx={{ fontSize: '0.8rem', mt: 0.5 }}
        >
          <MenuItem value={1} dense>1</MenuItem>
          <MenuItem value={3} dense>3</MenuItem>
          <MenuItem value={5} dense>5</MenuItem>
          <MenuItem value={10} dense>10</MenuItem>
          <MenuItem value={25} dense>25</MenuItem>
        </Select>
      </Box>

      <Box>
        <FormLabel component="legend" className={classes.selectLabel}>{X.CONFIG.FB_STAGE}</FormLabel>
        <Select
          fullWidth size="small" variant="standard" disableUnderline
          value={ac.fb_stage}
          onChange={(e) => updateAc({ fb_stage: e.target.value as string })}
          sx={{ fontSize: '0.8rem', mt: 0.5 }}
        >
          <MenuItem value={"fb"} dense>{X.CONFIG.FB_STAGE_FB}</MenuItem>
          <MenuItem value={"fs"} dense>{X.CONFIG.FB_STAGE_FS}</MenuItem>
          <MenuItem value={"pseudo-fs"} dense>{X.CONFIG.FB_STAGE_PSEUDO_FS}</MenuItem>
          <MenuItem value={"felinep1"} dense>{X.CONFIG.FB_STAGE_ELINE}</MenuItem>
          <MenuItem value={"fs-combo"} dense>{X.CONFIG.FB_STAGE_FS_LINE}</MenuItem>
        </Select>
      </Box>

      <Box>
        <FormLabel component="legend" className={classes.selectLabel}>{X.CONFIG.HINTS}</FormLabel>
        <Select
          fullWidth size="small" variant="standard" disableUnderline
          value={ac.hide_solutions ? "true" : "false"}
          onChange={(e) => updateAc({ hide_solutions: e.target.value === "true" })}
          sx={{ fontSize: '0.8rem', mt: 0.5 }}
        >
          <MenuItem value={"true"} dense>{X.COMMON.YES}</MenuItem>
          <MenuItem value={"false"} dense>{X.COMMON.NO}</MenuItem>
        </Select>
      </Box>
    </Box>
  );
}

export default function SettingsDrawer(props: { state: AppState, dispatch: React.Dispatch<Action> }) {
  const { state, dispatch } = props;
  const classes = useStyles();
  const mode = state.mode;

  const blockModes = ["fb", "fs", "fsdr", "fbdr", "fbss", "ss", "4c", "eopair"];

  const modes = getTabModes();
  const currentModeIdx = modes.findIndex(x => x[0] === mode);
  const currentModeFull = modes[currentModeIdx] ? modes[currentModeIdx][1] : "";

  const handleModeChange = (event: SelectChangeEvent<string>) => {
    const selectedFullName = event.target.value;
    const found = modes.find(m => m[1] === selectedFullName);
    if (found) {
      dispatch({ type: "mode", content: found[0] });
    }
  };

  return (
    <Box className={classes.drawer}>
      <Select
        fullWidth
        value={currentModeFull}
        className={classes.modeSelect}
        onChange={handleModeChange as any}
        onFocus={(e) => e.target.blur()}
        variant="standard"
        disableUnderline
      >
        {modes.map((s, i) =>
          <MenuItem key={i} value={s[1]} sx={{ fontSize: '0.85rem', borderRadius: 4, m: '2px 6px', py: 0.75, px: 1.5 }}>
            {s[1]}
          </MenuItem>
        )}
      </Select>

      <Box height={24} />

      {blockModes.includes(mode) && <BlockConfigPanel {...{ state, dispatch }} />}
      {mode === "cmll" && <CmllConfigPanel {...{ state, dispatch }} />}
      {mode === "analyzer" && <AnalyzerConfigPanel {...{ state, dispatch }} />}
      {/* ollcp mode not yet added to Mode type */}

      {/* Usage hints for block modes */}
      {mode === "4c" || mode === "eopair" ? (
        <Box className={classes.prompt} style={{ marginTop: 16 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <pre>{X.LSE.USAGE}</pre>
            </FormLabel>
          </FormControl>
        </Box>
      ) : null}
      {mode === "cmll" ? (
        <Box className={classes.prompt} style={{ marginTop: 16 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <pre>{X.CMLL.USAGE}</pre>
            </FormLabel>
          </FormControl>
        </Box>
      ) : null}
    </Box>
  );
}
