import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          font-family: var(--font-inter), sans-serif;
        }
      `,
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-inter), sans-serif',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-inter), sans-serif'
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: '#000', // Default color for the Tabs container (not individual tabs)
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#888', // Inactive tab color
          '&.Mui-selected': {
            color: '#1976d2', // Active tab color
            fontWeight: 500, // Bold text for active tab
          },
          '&.Mui-disabled': {
            color: '#ccc', // Disabled tab color
          },
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#408bff'
    },
    secondary: {
      main: '#dc004e'
    },
    text: {
      primary: '#000',
      secondary: '#fff',
      disabled: '#aaa',
    },
  },
});

export default theme;


// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   typography: {
//     fontFamily: 'var(--font-inter), sans-serif',
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: `
//         html, body {
//           font-family: var(--font-inter), sans-serif;
//         }
//       `,
//     },
//   },
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2'
//     },
//     secondary: {
//       main: '#dc004e'
//     }
//   },
// });

// // Apply common styles to all MUI components
// const muiComponentOverrides = Object.fromEntries(
//   Object.keys(theme.components || {}).map((key) => [
//     key,
//     {
//       styleOverrides: {
//         root: {
//           fontFamily: 'var(--font-inter), sans-serif',
//           // Add any other common styles here
//         },
//       },
//     },
//   ])
// );

// theme.components = {
//   ...theme.components,
//   ...muiComponentOverrides,
// };

// export default theme;