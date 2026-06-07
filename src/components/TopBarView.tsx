import React from "react";

import makeStyles from '@mui/styles/makeStyles';
import Toolbar from '@mui/material/Toolbar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import TuneIcon from '@mui/icons-material/Tune';
import IconButton from "@mui/material/IconButton";
import { getTabModes } from "./AppView";
import { X } from "../Translation";

import { theme } from '../theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const useStyles = makeStyles(theme => ({
    page: {
      backgroundColor: theme.palette.background.default
    },
    container: {
      display: "flex"
    },
    icon: {
      minWidth: 0
    },
    root: {
      display: "flex"
    },
    topBarWrapper: {
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      padding: theme.spacing(2, 2, 0, 2),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5, 1.5, 0, 1.5),
      },
      pointerEvents: 'none',
    },
    bar: {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(28, 28, 30, 0.75)' : 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      border: '0.5px solid ' + (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
      borderRadius: 20,
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      minHeight: 56,
      boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      pointerEvents: 'auto',
      maxWidth: 1200,
      margin: '0 auto',
    },
    toolbarBtn: {
      color: theme.palette.text.secondary,
      borderRadius: 12,
      width: 40,
      height: 40,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        color: theme.palette.text.primary,
      },
      [theme.breakpoints.down('md')]: {
        width: 44,
        height: 44,
      },
    },
    langBtn: {
      fontSize: "0.85rem",
      fontWeight: 600,
      color: theme.palette.text.secondary,
      borderRadius: 12,
      minWidth: 40,
      height: 40,
      lineHeight: '40px',
      textAlign: 'center',
      padding: '0 10px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        color: theme.palette.text.primary,
      },
      [theme.breakpoints.down('md')]: {
        height: 44,
        lineHeight: '44px',
        minWidth: 44,
      },
    }
}))


function TopBarView(props: { value: number,
    toggleFav: () => void, toggleSettings: () => void, toggleBright: () => void, handleInfoOpen: () => void,
    toggleLanguage: () => void, language: string } )
{
    let classes = useStyles()
    let { value, toggleFav, toggleSettings, toggleBright, handleInfoOpen, toggleLanguage, language } = props
    const modes = getTabModes();
    let currentModeName = modes[value] ? (modes[value][2] || modes[value][1]) : ""
    const is_sm = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div className={classes.topBarWrapper}>
            <Toolbar className={classes.bar} disableGutters>
            <Box paddingX={is_sm ? 2.5 : 4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography style={{fontSize: "1.1rem", fontWeight: 800, color: theme.palette.text.primary,
                letterSpacing: '-0.02em', whiteSpace: 'nowrap'}} >
                {is_sm ? X.NAV.APP_TITLE_SHORT : X.NAV.APP_TITLE}
              </Typography>
              {!is_sm && <Box sx={{ width: 1, height: 20, backgroundColor: 'divider', opacity: 0.5 }} />}
              <Typography style={{fontSize: "0.95rem", fontWeight: 600, color: theme.palette.text.secondary,
                whiteSpace: 'nowrap'}}>
                {currentModeName}
              </Typography>
            </Box>
            <Box style={{flexGrow: 1}}> </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, paddingRight: 2}}>
              <IconButton onClick={toggleSettings} size="small" className={classes.toolbarBtn}
                onFocus={(e) => e.target.blur()}>
                  <TuneIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={toggleFav} size="small" className={classes.toolbarBtn}
                onFocus={(e) => e.target.blur()}>
                  <BookmarkIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={toggleBright} size="small" className={classes.toolbarBtn}
                onFocus={(e) => e.target.blur()}>
                  <Brightness6Icon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleInfoOpen} size="small" className={classes.toolbarBtn}
                onFocus={(e) => e.target.blur()}>
                  <InfoIcon fontSize="small" />
              </IconButton>
              <button onClick={toggleLanguage} className={classes.langBtn}
                  onFocus={(e) => e.target.blur()}>
                  {language === "zh" ? "简" : language === "tw" ? "繁" : "EN"}
              </button>
            </Box>
            </Toolbar>
        </div>
    );
}


export default TopBarView;
