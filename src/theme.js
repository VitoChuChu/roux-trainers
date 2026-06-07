import { red } from '@mui/material/colors';
import { createTheme, adaptV4Theme } from '@mui/material/styles';

const shape = {
  borderRadius: 12, // iOS 大圓角風格
};

const shadows = [
  'none',
  '0 2px 8px rgba(0,0,0,0.04)',
  '0 4px 12px rgba(0,0,0,0.05)',
  '0 4px 20px rgba(0,0,0,0.06)',
  '0 8px 24px rgba(0,0,0,0.08)',
  // ... rest can be none as we use specific elevation for Apple style
].concat(Array(20).fill('none'));

const typography = {
  fontFamily: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "PingFang TC", "Microsoft JhengHei", sans-serif`,
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
          borderRadius: 12,
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:active': {
            transform: 'scale(0.96)',
          },
          '&:hover': {
            boxShadow: 'none',
          }
        },
        containedPrimary: {
          backgroundColor: '#007AFF',
          '&:hover': {
            backgroundColor: '#0062CC',
          },
        },
        outlined: {
          borderWidth: '1px !important',
          borderColor: 'rgba(0,0,0,0.08)',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderColor: 'rgba(0,0,0,0.12)',
          },
        },
        sizeLarge: {
          borderRadius: 14,
          padding: '12px 28px',
          fontSize: '1rem',
        },
        sizeSmall: {
          borderRadius: 10,
          padding: '6px 16px',
          fontSize: '0.85rem',
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
          opacity: 0.1,
          backgroundColor: '#8E8E93',
        },
        track: {
          height: 6,
          borderRadius: 3,
          border: 'none',
        },
        thumb: {
          width: 26,
          height: 26,
          backgroundColor: '#ffffff',
          boxShadow: '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)',
          border: '0.5px solid rgba(0,0,0,0.04)',
          '&:hover, &.Mui-active': {
            boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 3px 1px rgba(0,0,0,0.04)',
          },
          '&::after': {
            display: 'none',
          },
        },
        mark: {
          width: 2,
          height: 2,
          borderRadius: 1,
          backgroundColor: 'currentColor',
        },
        markLabel: {
          fontSize: '0.85rem',
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: 8,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 700,
          textAlign: 'center',
          padding: '24px 24px 8px 24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,0,0,0.05)',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#8E8E93',
          marginBottom: 8,
        },
      },
    },
  },
};

const theme = createTheme(adaptV4Theme({
  name: "bright",
  palette: {
    primary: {
      main: '#007AFF', // iOS Blue
    },
    secondary: {
      main: '#FF2D55', // iOS Red
    },
    error: {
      main: '#FF3B30',
    },
    background: {
      default: '#F2F2F7', // iOS Grouped Background
      paper: '#FFFFFF',   // iOS Plain Table Cell
    },
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      disabled: '#8E8E93',
    },
  },
  ...components,
}));

const themeDark = createTheme(adaptV4Theme({
  name: "dark",
  palette: {
    primary: {
      main: '#0A84FF', // iOS Dark Blue
    },
    secondary: {
      main: '#FF375F', // iOS Dark Red
    },
    error: {
      main: '#FF453A',
    },
    background: {
      default: '#000000', // OLED Black
      paper: '#1C1C1E',   // iOS Dark Gray Card
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5',
      disabled: '#8E8E93',
    },
  },
  ...components,
  components: {
    ...components.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          ...components.components.MuiPaper.styleOverrides.root,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.1)',
        },
      },
    },
  },
}));

export { theme, themeDark };
