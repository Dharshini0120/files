import { createTheme } from '@mui/material/styles';

const healthcareColors = {
  primary: {
    500: '#0ea5e9',
    700: '#0369a1',
  },
  secondary: {
    500: '#10b981',
  },
  background: {
    default: '#ffffff',
    paper: '#f8fafc',
  },
};

export const healthcareTheme = createTheme({
  palette: {
    primary: {
      main: healthcareColors.primary[500],
      dark: healthcareColors.primary[700],
    },
    secondary: {
      main: healthcareColors.secondary[500],
    },
    background: healthcareColors.background,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});