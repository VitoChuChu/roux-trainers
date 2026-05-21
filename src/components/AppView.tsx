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
  },
  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  scrollArea: {
    paddingRight: 4,
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: 2,
    },
  },
  container: {
    display: "flex"
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
    <AnalyzerView {...{state, dispatch}} />,
    <BlockTrainerView {...{state, dispatch}} />, // fs
    <BlockTrainerView {...{state, dispatch}} />, // fsdr
    <BlockTrainerView {...{state, dispatch}} />, // fbdr
    <BlockTrainerView {...{state, dispatch}} />, // fbss
    <BlockTrainerView {...{state, dispatch}} />, // ss
    <CmllTrainerView {...{state, dispatch}} />,
    <BlockTrainerView {...{state, dispatch}} />,
    <BlockTrainerView {...{state, dispatch}} />,
  ]);

  const mainContent = (
    value === -1 ? (
      <Grid container className={classes.container} spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <TabPanel value={value} index={4}>
            <PanoramaView {...{state, dispatch}} />
          </TabPanel>
        </Grid>
      </Grid>
    ) : (
      <Grid container className={classes.container} spacing={2}>
        <Grid item md={sidebarOpen && !isMobile ? 8 : 12} sm={sidebarOpen && !isMobile ? 7 : 12} xs={12}>
          <Box className={classes.scrollArea}>
          {tabPanelsContent}
          </Box>
        </Grid>

        {!isMobile && (
          <Grid item hidden={!sidebarOpen} md={4} sm={5} xs={12}>
            <Box className={classes.scrollArea}>
              {showFav && <FavListView {...{state, dispatch}} />}
              {showSettings && <SettingsDrawer {...{state, dispatch}} />}
            </Box>
          </Grid>
        )}
      </Grid>
    )
  );

  return (
    <Box className={classes.root}>
      <Dialog open={open} onClose={handleInfoClose}
        PaperProps={{sx: {borderRadius: 8, padding: 2, maxWidth: 520}}}>
      <DialogContent>
        <Intro></Intro>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleInfoClose}
          sx={{borderRadius: 4, textTransform: 'none', fontWeight: 500}}>
          {X.NAV.GOT_IT}
        </Button>
      </DialogActions>
      </Dialog>

      <TopBarView value={value}
        handleInfoOpen={handleInfoOpen} toggleBright={toggleBright}
        toggleFav={toggleFav} toggleSettings={toggleSettings}
        toggleLanguage={() => dispatch({ type: "language", content: state.language === "zh" ? "en" : "zh" })}
        language={state.language}
      />

      <Box className={classes.content}>
        <Container maxWidth={sidebarOpen && !isMobile ? "lg" : "md"}>
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
