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
    bar: {
      backgroundColor: theme.palette.background.paper,
      borderBottom: '1px solid ' + (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      minHeight: 50,
    },
    select: {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      borderRadius: 4,
      paddingLeft: 12,
      paddingRight: 4,
      marginLeft: 8,
      height: 34,
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: '34px',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 10,
        marginRight: -5,
        marginLeft: 4,
        fontSize: "0.8rem",
        height: 32,
      },
      [theme.breakpoints.down(400)]: {
        maxWidth: 140,
      },
      '& .MuiSelect-icon': {
        color: theme.palette.text.secondary,
      },
    },
    toolbarBtn: {
      color: theme.palette.text.secondary,
      borderRadius: 4,
      width: 34,
      height: 34,
      transition: 'all 0.15s ease',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      },
      [theme.breakpoints.down('md')]: {
        width: 44,
        height: 44,
      },
    },
    langBtn: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: theme.palette.text.secondary,
      borderRadius: 4,
      minWidth: 30,
      height: 30,
      lineHeight: '30px',
      textAlign: 'center',
      padding: '0 8px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.15s ease',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        color: theme.palette.primary.main,
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
        <div>
            <Box boxShadow={0} >
            <Toolbar className={classes.bar} disableGutters>
            <Box paddingX={is_sm ? 1.5 : 2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography style={{fontSize: "0.85rem", fontWeight: 600, color: theme.palette.text.primary,
                letterSpacing: '-0.01em', whiteSpace: 'nowrap'}} >
                {is_sm ? X.NAV.APP_TITLE_SHORT : X.NAV.APP_TITLE}
              </Typography>
              <Typography style={{fontSize: "0.8rem", fontWeight: 400, color: theme.palette.text.secondary,
                whiteSpace: 'nowrap'}}>
                — {currentModeName}
              </Typography>
            </Box>
            <Box style={{flexGrow: 10}}> </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.25, paddingRight: 1}}>
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
                  {language === "zh" ? "EN" : "中"}
              </button>
            </Box>
            </Toolbar>
            </Box>
        </div>
    );
}

export default TopBarView;
