import { red } from '@mui/material/colors';
import { createTheme, adaptV4Theme } from '@mui/material/styles';

const shape = {
  borderRadius: 6,
};

const shadows = [
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
  'none',
];

const typography = {
  fontFamily: `"Public Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif`,
  fontSize: 15,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
};

const components = {
  shape,
  shadows,
  typography,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          transition: 'all 0.15s ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#4a5fc4',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: 'rgba(0,0,0,0.03)',
          },
        },
        outlinedPrimary: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
        sizeLarge: {
          borderRadius: 6,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
        },
        sizeSmall: {
          borderRadius: 4,
          padding: '4px 12px',
          fontSize: '0.8rem',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 4,
          padding: '15px 0',
        },
        rail: {
          height: 4,
          borderRadius: 2,
          opacity: 0.08,
        },
        track: {
          height: 4,
          borderRadius: 2,
        },
        thumb: {
          width: 20,
          height: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        mark: {
          width: 3,
          height: 3,
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
          borderRadius: 4,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          padding: 4,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: 8,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 0.2,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.9rem',
          fontWeight: 400,
          lineHeight: 1.6,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.02em',
          lineHeight: 1.6,
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
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#1c1c1e',
      secondary: '#8e8e93',
      disabled: '#aeaeb2',
    },
  },
  ...components,
}));

const themeDark = createTheme(adaptV4Theme({
  name: "dark",
  palette: {
    primary: {
      main: '#8b9ef0',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#0a0a0b',
      paper: '#141415',
    },
    text: {
      primary: '#f5f5f7',
      secondary: '#aeaeb2',
      disabled: '#636366',
    },
  },
  ...components,
}));

export { theme, themeDark };
