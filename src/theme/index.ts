/**
 * Material-UI Theme Configuration
 * School Advisories System
 * 
 * This file configures the MUI theme with:
 * - Custom colors matching the brand
 * - Typography settings
 * - Component overrides
 * - Spanish localization for date pickers
 */

import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Environment variables for theme configuration
const THEME_MODE = import.meta.env.VITE_THEME_MODE || 'light';
const PRIMARY_COLOR = import.meta.env.VITE_THEME_PRIMARY_COLOR || '#1976d2';
const SECONDARY_COLOR = import.meta.env.VITE_THEME_SECONDARY_COLOR || '#dc004e';

/**
 * Theme Options Configuration
 */
const themeOptions: ThemeOptions = {
  palette: {
    mode: THEME_MODE as 'light' | 'dark',
    primary: {
      main: PRIMARY_COLOR,
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: SECONDARY_COLOR,
      light: '#f50057',
      dark: '#c51162',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: THEME_MODE === 'dark' ? '#121212' : '#f5f5f5',
      paper: THEME_MODE === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: THEME_MODE === 'dark' ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
      secondary: THEME_MODE === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      disabled: THEME_MODE === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
    },
  },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // No uppercase buttons
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 8, // Rounded corners
  },

  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.10)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.14)',
    '0px 12px 24px rgba(0,0,0,0.16)',
    '0px 14px 28px rgba(0,0,0,0.18)',
    '0px 16px 32px rgba(0,0,0,0.20)',
    '0px 18px 36px rgba(0,0,0,0.22)',
    '0px 20px 40px rgba(0,0,0,0.24)',
    '0px 22px 44px rgba(0,0,0,0.26)',
    '0px 24px 48px rgba(0,0,0,0.28)',
    '0px 26px 52px rgba(0,0,0,0.30)',
    '0px 28px 56px rgba(0,0,0,0.32)',
    '0px 30px 60px rgba(0,0,0,0.34)',
    '0px 32px 64px rgba(0,0,0,0.36)',
    '0px 34px 68px rgba(0,0,0,0.38)',
    '0px 36px 72px rgba(0,0,0,0.40)',
    '0px 38px 76px rgba(0,0,0,0.42)',
    '0px 40px 80px rgba(0,0,0,0.44)',
    '0px 42px 84px rgba(0,0,0,0.46)',
    '0px 44px 88px rgba(0,0,0,0.48)',
    '0px 46px 92px rgba(0,0,0,0.50)',
    '0px 48px 96px rgba(0,0,0,0.52)',
  ],

  components: {
    // Button component customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
      defaultProps: {
        disableElevation: false,
      },
    },

    // Card component customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },

    // Paper component customization
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },

    // TextField component customization
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    // Table component customization
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: THEME_MODE === 'dark' ? '#2d2d2d' : '#f5f5f5',
        },
      },
    },

    // Chip component customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    // AppBar component customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },

    // Dialog customization
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },

    // Tooltip customization
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(97, 97, 97, 0.95)',
          fontSize: '0.75rem',
        },
      },
    },
  },
};

/**
 * Create and export the theme
 */
export const theme = createTheme(themeOptions);

export default theme;
