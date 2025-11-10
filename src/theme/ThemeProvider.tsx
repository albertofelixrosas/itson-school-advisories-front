/**
 * Theme Provider Component
 * 
 * This component wraps the entire app with:
 * - MUI ThemeProvider
 * - CssBaseline for consistent styling
 * - LocalizationProvider for date pickers in Spanish
 */

import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import theme from './index';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

/**
 * AppThemeProvider Component
 * 
 * Wraps the application with necessary providers for theming and localization
 */
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline provides consistent baseline styles */}
      <CssBaseline />
      
      {/* LocalizationProvider for date pickers with Spanish locale */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        {children}
      </LocalizationProvider>
    </MuiThemeProvider>
  );
}

export default AppThemeProvider;
