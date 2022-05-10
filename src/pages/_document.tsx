import * as React from 'react'
import { RenderPageResult } from 'next/dist/shared/lib/utils'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from 'configs/createEmotionCache'
import theme from 'configs/theme'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <link rel="icon" href="/tabi-zukuri.svg" type="image/svg+xml" />
          <meta name="description" content="旅行計画アプリ 「旅づくり」" />
          <link
            rel="apple-touch-icon"
            href="/tabi-zukuri.svg"
            type="image/svg+xml"
          />
          {/*
            manifest.json provides metadata used when your web app is installed on a
            user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
          */}
          <link rel="manifest" href="manifest.json" />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700&family=Noto+Sans+JP:wght@400;700&family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx): Promise<DocumentInitialProps> => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enhanceApp: (App: any) =>
        function EnhanceApp(props): JSX.Element {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  }
}
