import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  // TODO:テーマ設定を行う
  palette: {
    primary: {
      main: '#ffd954',
      light: '#ffea00',
      dark: '#ffc300',
    },
    secondary: {
      main: '#001d3d',
      dark: '#000814',
      light: '#003b7a',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
})

export default theme
