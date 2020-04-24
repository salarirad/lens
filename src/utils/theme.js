import {createMuiTheme, responsiveFontSizes} from '@material-ui/core';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#757ce8'
    },
    secondary: {
      main: '#ff7961'
    }
  }
});

const rtlDarkTheme = createMuiTheme({
  direction: 'rtl',
  palette: {
    type: 'dark',
    primary: {
      main: '#757ce8'
    },
    secondary: {
      main: '#ff7961'
    }
  }
})

export const ltrTheme = responsiveFontSizes(darkTheme);
export const rtlTheme = responsiveFontSizes(rtlDarkTheme);
