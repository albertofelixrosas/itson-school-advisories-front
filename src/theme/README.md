# 🎨 Theme

Configuración del tema de Material-UI y estilos globales.

## 📁 Archivos

### `index.ts`
Configuración principal del tema MUI:
```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

export const theme = createTheme({
  palette: { ... },
  typography: { ... },
  components: { ... }
});

export function AppThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
```

### `colors.ts`
Paleta de colores del sistema:
```tsx
export const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#dc004e',
    light: '#f50057',
    dark: '#c51162',
  },
  // ... colores adicionales
};
```

### `typography.ts`
Configuración de tipografía:
```tsx
export const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    // ...
  ].join(','),
  h1: { fontSize: '2.5rem', fontWeight: 500 },
  h2: { fontSize: '2rem', fontWeight: 500 },
  // ... más configuración
};
```

### `components.ts`
Overrides de componentes MUI:
```tsx
export const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none', // Sin uppercase
        borderRadius: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
  },
  // ... más overrides
};
```

## 🎯 Características

- **Responsive:** Breakpoints definidos
- **Accesible:** Contraste de colores adecuado
- **Español:** Date pickers en español (es locale)
- **Consistente:** Componentes con estilo uniforme
- **Dark mode ready:** Preparado para modo oscuro futuro

## 🌍 Localization

El tema incluye LocalizationProvider configurado con:
- **date-fns** como adaptador
- **Locale español (es)** para fechas
- **Timezone:** America/Mexico_City

## 🔧 Uso

Envolver la app con `AppThemeProvider`:
```tsx
<AppThemeProvider>
  <App />
</AppThemeProvider>
```
