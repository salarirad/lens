import {createMuiTheme, responsiveFontSizes} from '@material-ui/core';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#039be5'
    },
    secondary: {
      main: '#f06292'
    }
  },
  typography: {
    fontFamily: [
      'Vazir',
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
    ].join(',')
  }
});

const rtlDarkTheme = createMuiTheme({
  direction: 'rtl',
  palette: {
    type: 'dark',
    primary: {
      main: '#039be5'
    },
    secondary: {
      main: '#f06292'
    }
  },
  typography: {
    fontFamily: [
      'Vazir',
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
    ].join(',')
  }
})

export const ltrTheme = responsiveFontSizes(darkTheme);
export const rtlTheme = responsiveFontSizes(rtlDarkTheme);
