import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  // TODO:テーマ設定を行う
  palette: {
    primary: {
      main: '#1792b1',
    },
    secondary: {
      main: '#02bceb',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
})

export default theme
