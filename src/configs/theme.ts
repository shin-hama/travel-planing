import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const theme = responsiveFontSizes(
  createTheme({
    // TODO:テーマ設定を行う
    palette: {
      primary: {
        main: '#9D331F',
      },
      secondary: {
        main: '#dd9bc9',
      },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
      h1: {
        fontSize: '3.5rem',
        fontFamily: '"M PLUS Rounded 1c"',
      },
      h2: {
        fontSize: '2.75rem',
        fontFamily: '"M PLUS Rounded 1c"',
      },
      h3: {
        fontSize: '2rem',
      },
      h4: {
        fontSize: '1.75rem',
      },
      h5: {
        fontSize: '1.5rem',
      },
      h6: {
        fontSize: '1.25rem',
      },
      fontFamily: [
        '"Roboto"',
        '"Noto Sans JP"',
        '"M PLUS Rounded 1c"',
        'sans-serif',
      ].join(','),
    },
  })
)

export default theme
