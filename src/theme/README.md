# 🎨 Theme Configuration

Material-UI theme configuration with Spanish localization and custom branding.

## 📁 Files

- **`index.ts`** - Main theme configuration with MUI customization
- **`ThemeProvider.tsx`** - Provider component with LocalizationProvider
- **`colors.ts`** - Centralized color palette with role/status colors
- **`typography.ts`** - Typography configuration and font settings

## 🎯 Features

### Theme Configuration
- Custom primary color: `#1976d2` (Blue)
- Custom secondary color: `#dc004e` (Pink/Red)
- Light/Dark mode support (configured via environment)
- Custom shadows (25 elevation levels)
- Rounded corners (8px default, 12px for cards)

### Component Customization
- **Button** - Custom padding, border radius, elevation
- **Card** - 12px border radius, subtle shadow
- **Paper** - 8px border radius
- **TextField** - Outlined variant by default
- **Table** - Bold headers with background color
- **Dialog** - Rounded corners
- **Tooltip** - Custom background and font size

### Localization
- **Date Pickers** - Spanish locale (es)
- **Adapter** - date-fns adapter
- **Timezone** - America/Mexico_City

### Color System
- **Role Colors**: student (blue), professor (green), admin (red)
- **Advisory Status**: active, inactive, completed, cancelled
- **Request Status**: pending, approved, rejected, cancelled
- **Invitation Status**: pending, accepted, declined, expired
- **Attendance Status**: present, absent, late

## 📚 Usage

### Basic Theme Usage

```tsx
import { Container, Typography, Button } from '@mui/material';

function MyComponent() {
  return (
    <Container>
      <Typography variant="h4" color="primary">
        School Advisories
      </Typography>
      <Button variant="contained" color="secondary">
        Click me
      </Button>
    </Container>
  );
}
```

### Using Color Utilities

```tsx
import { getRoleColor, getRequestStatusColor } from '@/theme/colors';
import { Chip } from '@mui/material';

function UserChip({ role }) {
  return (
    <Chip 
      label={role} 
      sx={{ bgcolor: getRoleColor(role) }} 
    />
  );
}

function StatusChip({ status }) {
  return (
    <Chip 
      label={status} 
      sx={{ bgcolor: getRequestStatusColor(status) }} 
    />
  );
}
```

### Date Picker with Spanish Locale

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';

function MyDatePicker() {
  const [value, setValue] = useState<Date | null>(null);
  
  return (
    <DatePicker
      label="Fecha de asesoría"
      value={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
}
```

## � Color Palette

### Primary Colors
```
primary.main:    #1976d2
primary.light:   #42a5f5
primary.dark:    #1565c0
```

### Secondary Colors
```
secondary.main:  #dc004e
secondary.light: #f50057
secondary.dark:  #c51162
```

### Status Colors
```
success: #4caf50 (Green)
error:   #f44336 (Red)
warning: #ff9800 (Orange)
info:    #2196f3 (Blue)
```

### Role Colors
```
student:   #2196f3 (Blue)
professor: #4caf50 (Green)
admin:     #f44336 (Red)
```

## 🔧 Configuration

Theme can be configured via environment variables:

```env
VITE_THEME_MODE=light
VITE_THEME_PRIMARY_COLOR=#1976d2
VITE_THEME_SECONDARY_COLOR=#dc004e
```

## � Localization

The LocalizationProvider is configured with:
- **Adapter**: date-fns
- **Locale**: Spanish (es)
- **Timezone**: America/Mexico_City

This ensures all date pickers and date-related components display in Spanish.

## � Integration

The theme is integrated in `main.tsx`:

```tsx
import { AppThemeProvider } from './theme/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </StrictMode>
);
```
