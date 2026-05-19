import React from "react";

import makeStyles from '@mui/styles/makeStyles';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import IconButton from "@mui/material/IconButton";
import { SelectChangeEvent } from '@mui/material/Select';
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
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid ' + (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      minHeight: 52,
    },
    select: {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
      color: theme.palette.text.primary,
      borderRadius: 20,
      paddingLeft: 18,
      paddingRight: 8,
      marginLeft: 12,
      height: 38,
      fontWeight: 500,
      fontSize: "0.9rem",
      lineHeight: '38px',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 14,
        marginRight: -5,
        marginLeft: 8,
        fontSize: "0.8rem",
        height: 34,
      },
      [theme.breakpoints.down(400)]: {
        maxWidth: 150,
      },
      '& .MuiSelect-icon': {
        color: theme.palette.text.secondary,
      },
    },
    toolbarBtn: {
      color: theme.palette.text.secondary,
      borderRadius: 18,
      width: 36,
      height: 36,
      transition: 'all 0.15s ease',
      '&:active': {
        transform: 'scale(0.92)',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      },
    },
    langBtn: {
      fontSize: "0.8rem",
      fontWeight: 600,
      color: theme.palette.primary.main,
      borderRadius: 14,
      minWidth: 32,
      height: 32,
      lineHeight: '32px',
      textAlign: 'center',
      padding: '0 10px',
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(159,164,194,0.12)' : 'rgba(85,108,214,0.08)',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.15s ease',
      '&:active': {
        transform: 'scale(0.94)',
      },
    }
}))


function TopBarView(props: { value: number, onChange: (x: number) => void,
    toggleFav: () => void, toggleBright: () => void, handleInfoOpen: () => void,
    toggleLanguage: () => void, language: string } )
{
    let classes = useStyles()
    let { value, onChange, toggleFav, toggleBright, handleInfoOpen, toggleLanguage, language } = props
    const modes = getTabModes();
    let value_str = modes[value][1] || ""
    let handleChange = (event: SelectChangeEvent<String>) =>  {
        let tab_idx = modes.findIndex(x => x[1] === (event.target.value as string))
        onChange(tab_idx)
        //
    }
    const is_sm = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div>
            <Box boxShadow={0} >
            <Toolbar className={classes.bar} disableGutters>
            <Box paddingX={is_sm ? 1.5 : 2}>
              <Typography style={{fontSize: "0.85rem", fontWeight: 600, color: theme.palette.text.primary,
                letterSpacing: '-0.01em', whiteSpace: 'nowrap'}} >
                {is_sm ? X.NAV.APP_TITLE_SHORT : X.NAV.APP_TITLE}
              </Typography>
            </Box>
            <Box>
                <Select
                     fullWidth
                     value={value_str}
                     className={classes.select}
                     onChange={handleChange}
                     onFocus={(e) => e.target.blur()}
                     variant="standard"
                     disableUnderline
                >
                    { modes.map( (s, i) =>
                      <MenuItem key={i} value={s[1]} sx={{mx: 1.5}} style={{fontSize: "1.0rem", marginBottom: 4,
                        borderRadius: 10, margin: '2px 6px', padding: '8px 14px'}}>
                        {is_sm ? s[2] : s[1]}
                      </MenuItem>
                    )}
                </Select>
            </Box>
            <Box style={{flexGrow: 10}}> </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.25, paddingRight: 1}}>
              <button onClick={toggleLanguage} className={classes.langBtn}
                  onFocus={(e) => e.target.blur()}>
                  {language === "zh" ? "EN" : "中"}
              </button>
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
            </Box>
            </Toolbar>
            </Box>
        </div>
    );
}

export default TopBarView;
