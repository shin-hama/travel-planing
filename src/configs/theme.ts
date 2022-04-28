import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const theme = responsiveFontSizes(
  createTheme({
    // TODO:テーマ設定を行う
    palette: {
      primary: {
        main: '#9D331F',
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
)

export default theme
