import { red } from '@mui/material/colors';
import { createTheme, adaptV4Theme } from '@mui/material/styles';

const iosShape = {
  borderRadius: 14,
};

const iosShadows = [
  'none',
  '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
  '0 2px 8px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)',
  '0 4px 16px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.06)',
  '0 8px 24px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)',
  '0 12px 32px rgba(0,0,0,0.07), 0 6px 16px rgba(0,0,0,0.07)',
];

const iosTypography = {
  fontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Public Sans", "Roboto", sans-serif`,
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
};

const components = {
  shape: iosShape,
  shadows: iosShadows,
  typography: iosTypography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
        },
        elevation1: {
          boxShadow: iosShadows[1],
        },
        elevation2: {
          boxShadow: iosShadows[2],
        },
        elevation4: {
          boxShadow: iosShadows[3],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: '0.01em',
          transition: 'all 0.2s ease',
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        containedPrimary: {
          boxShadow: '0 2px 8px rgba(85,108,214,0.25)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(85,108,214,0.35)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        sizeLarge: {
          borderRadius: 14,
          padding: '12px 24px',
          fontSize: '1.05rem',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          padding: '15px 0',
        },
        rail: {
          height: 6,
          borderRadius: 3,
          opacity: 0.15,
        },
        track: {
          height: 6,
          borderRadius: 3,
        },
        thumb: {
          width: 26,
          height: 26,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:active': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          },
        },
        mark: {
          width: 4,
          height: 4,
          borderRadius: 2,
        },
        markLabel: {
          fontSize: '0.8rem',
          fontWeight: 500,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: 10,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: 8,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&:active': {
            transform: 'scale(0.9)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&:active': {
            transform: 'scale(0.9)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 0.4,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.95rem',
          fontWeight: 400,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          fontWeight: 500,
        },
      },
    },
  },
};

const theme = createTheme(adaptV4Theme({
  name: "bright",
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#d32f2f',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f2f2f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1c1e',
      secondary: '#8e8e93',
      disabled: '#556cd6',
    },
  },
  ...components,
}));

const themeDark = createTheme(adaptV4Theme({
  name: "dark",
  palette: {
    primary: {
      main: '#9FA4C2',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#000000',
      paper: '#1c1c1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aeaeb2',
      disabled: '#9FA4C2',
    },
  },
  ...components,
}));

export { theme, themeDark };
