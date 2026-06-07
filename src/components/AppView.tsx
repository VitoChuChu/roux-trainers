import React from 'react'
import { AppState, Mode, Action } from "../Types";
import { X } from "../Translation";

import { Box, Typography, Button, Drawer } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { Grid, Container } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CmllTrainerView, OllcpTrainerView } from './CmllTrainerView';
import BlockTrainerView from './BlockTrainerView';
import PanoramaView from './PanoramaView';

import FavListView from './FavListView';
import SettingsDrawer from './SettingsDrawer';
import TopBarView from './TopBarView';
import AnalyzerView from './AnalyzerView';

import Markdown from 'markdown-to-jsx';

import { theme } from '../theme';

interface TabPanelProps {
  value: number,
  index: number,
  children: any,
  [key: string]: any
}
function TabPanel(props: TabPanelProps ) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}
const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    overflowX: 'hidden',
    position: 'relative',
  },
  content: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(2),
    },
  },
  mainWrapper: {
    display: 'flex',
    gap: theme.spacing(4),
    width: '100%',
    margin: '0 auto',
    maxWidth: 1400,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
  },
  canvasArea: {
    flex: 1,
    minWidth: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  sidebarArea: {
    width: 380,
    flexShrink: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('lg')]: {
      width: 340,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  scrollArea: {
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: 10,
    },
  },
}))

export const getTabModes = (): [Mode, string, string][] => [
  ["fb", X.MODES.FB.full, X.MODES.FB.short],
  ["fs", X.MODES.FS.full, X.MODES.FS.short],
  ["fsdr", X.MODES.FSDR.full, X.MODES.FSDR.short],
  ["analyzer", X.MODES.ANALYZER.full, X.MODES.ANALYZER.short],
  ["fbdr", X.MODES.FBDR.full, X.MODES.FBDR.short],
  ["fbss", X.MODES.FBSS.full, X.MODES.FBSS.short],
  ["ss", X.MODES.SS.full, X.MODES.SS.short],
  ["cmll", X.MODES.CMLL.full, X.MODES.CMLL.short],
  ["4c", X.MODES.LSE_4C.full, X.MODES.LSE_4C.short],
  ["eopair", X.MODES.EOLR.full, X.MODES.EOLR.short]
]

function _getInitialHashLocation() {
  const modes = getTabModes();
  const default_idx = modes.findIndex(x => x[0] === "fs")
  if (window.location.hash) {
    let idx = modes.findIndex(x => x[0] === window.location.hash.slice(1))
    if (idx === -1) {
      window.location.hash = "";
      return default_idx;
    } else {
      return idx;
    }
  } else {
    return default_idx
  }
}

function Intro() {
  return <Markdown>{X.INTRO.MARKDOWN}</Markdown>
}

function AppView(props: { state: AppState, dispatch: React.Dispatch<Action> } ) {
  let { state, dispatch } = props
  let classes = useStyles()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = React.useCallback( (newValue:number) => {
    if (newValue < getTabModes().length) {
      setValue(newValue)
      let mode = getTabModes()[newValue][0]
      dispatch({type: "mode", content: mode})
    }
  }, [dispatch])

  const [ open, setOpen ] = React.useState(false)

  const [value, setValue] = React.useState(_getInitialHashLocation());
  React.useEffect( () => {
    dispatch({type: "mode", content: getTabModes()[_getInitialHashLocation()][0]})
  }, [dispatch])

  React.useEffect(() => {
    const idx = getTabModes().findIndex(x => x[0] === state.mode);
    if (idx !== -1 && idx !== value) {
      setValue(idx);
      window.location.hash = state.mode;
    }
  }, [state.mode, value]);

  const handleInfoOpen = () => { setOpen(true) }
  const handleInfoClose = () => { setOpen(false) }

  const toggleBright = () => {
    const theme_flag = [...state.config.theme.flags]
    theme_flag[0] = 1 - theme_flag[0]
    theme_flag[1] = 1 - theme_flag[1]
    dispatch({ type: "config", content: {
      theme: state.config.theme.setFlags(theme_flag)
    }})
  }
  const toggleFav = () => { setFav(!showFav); if (showSettings) setSettings(false); }
  const toggleSettings = () => { setSettings(!showSettings); if (showFav) setFav(false); }

  const [ showFav, setFav ] = React.useState(false)
  const [ showSettings, setSettings ] = React.useState(true)

  const sidebarOpen = showFav || showSettings;

  const createTabPanels = (elements: any[]) => {
    return <React.Fragment>
    {
      elements.map( (el, i) => <TabPanel key={i} value={value} index={i}>{el}</TabPanel>)
    }
    </React.Fragment>
  }

  const tabPanelsContent = createTabPanels([
    <BlockTrainerView {...{state, dispatch}} />, // fb
    <BlockTrainerView {...{state, dispatch}} />, // fs
    <BlockTrainerView {...{state, dispatch}} />, // fsdr
    <AnalyzerView {...{state, dispatch}} />,     // analyzer
    <BlockTrainerView {...{state, dispatch}} />, // fbdr
    <BlockTrainerView {...{state, dispatch}} />, // fbss
    <BlockTrainerView {...{state, dispatch}} />, // ss
    <CmllTrainerView {...{state, dispatch}} />,
    <BlockTrainerView {...{state, dispatch}} />,
    <BlockTrainerView {...{state, dispatch}} />,
  ]);

  const mainContent = (
    <Box className={classes.mainWrapper}>
      <Box className={classes.canvasArea}>
        {tabPanelsContent}
      </Box>

      {!isMobile && sidebarOpen && (
        <Box className={classes.sidebarArea}>
          <Box className={classes.scrollArea} sx={{ position: 'sticky', top: 88 }}>
            {showFav && <FavListView {...{state, dispatch}} />}
            {showSettings && <SettingsDrawer {...{state, dispatch}} />}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box className={classes.root}>
      <Dialog open={open} onClose={handleInfoClose}
        PaperProps={{sx: {borderRadius: 20, padding: 2, maxWidth: 560}}}>
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Intro></Intro>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4 }}>
        <Button color="primary" variant="contained" onClick={handleInfoClose} fullWidth
          sx={{borderRadius: 12, py: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '1rem'}}>
          {X.NAV.GOT_IT}
        </Button>
      </DialogActions>
      </Dialog>

      <TopBarView value={value}
        handleInfoOpen={handleInfoOpen} toggleBright={toggleBright}
        toggleFav={toggleFav} toggleSettings={toggleSettings}
        toggleLanguage={() => {
          const nextLang = state.language === "zh" ? "tw" : state.language === "tw" ? "en" : "zh";
          dispatch({ type: "language", content: nextLang });
        }}
        language={state.language}
      />

      <Box className={classes.content}>
        <Container maxWidth={false} sx={{ maxWidth: '1800px !important' }}>
          {mainContent}
        </Container>
      </Box>

      {isMobile && showSettings && (
        <Drawer
          anchor="bottom"
          open={showSettings}
          onClose={() => setSettings(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '85dvh',
              pb: 3,
            }
          }}
        >
          <Box sx={{
            display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5,
          }}>
            <Box sx={{
              width: 36, height: 4, borderRadius: 2,
              bgcolor: 'text.disabled', opacity: 0.3,
            }} />
          </Box>
          <SettingsDrawer {...{state, dispatch}} />
        </Drawer>
      )}

      {isMobile && showFav && (
        <Drawer
          anchor="bottom"
          open={showFav}
          onClose={() => setFav(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '85dvh',
              pb: 3,
            }
          }}
        >
          <Box sx={{
            display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5,
          }}>
            <Box sx={{
              width: 36, height: 4, borderRadius: 2,
              bgcolor: 'text.disabled', opacity: 0.3,
            }} />
          </Box>
          <FavListView {...{state, dispatch}} />
        </Drawer>
      )}
    </Box>
  )
}
export default AppView
