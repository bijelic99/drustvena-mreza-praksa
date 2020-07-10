import { createMuiTheme } from '@material-ui/core/styles'
const appTheme = createMuiTheme({
  palette: {
    text:{
      white: '#fff'
    },
    primary: {
      light: '#57667a',
      main: '#2d4059',
      dark: '#1f2c3e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff784e',
      main: '#ff5722',
      dark: '#b23c17',
      contrastText: '#fff',
    },

  }

})
export default appTheme