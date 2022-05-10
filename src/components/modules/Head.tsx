import * as React from 'react'
import NextHead from 'next/head'

export type HeadProps = {
  title: string
  description?: string
}
const Head: React.FC<HeadProps> = ({ title, description }) => {
  return (
    <NextHead>
      <title>{title} - 旅づくり</title>
      <meta property="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="ogp_large.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </NextHead>
  )
}

export default Head
