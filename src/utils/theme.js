import {createMuiTheme, responsiveFontSizes} from '@material-ui/core';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const rtlDarkTheme = createMuiTheme({
  direction: 'rtl',
  palette: {
    type: 'dark'
  }
})

export const ltrTheme = responsiveFontSizes(darkTheme);
export const rtlTheme = responsiveFontSizes(rtlDarkTheme);
