import * as React from 'react'

import Header from 'components/modules/Header'
import Head, { HeadProps } from 'components/modules/Head'

type Props = HeadProps & {
  fixedHeader?: boolean
}
const Layout: React.FC<Props> = ({ children, fixedHeader, ...props }) => {
  return (
    <>
      <Head {...props} />
      <Header fixed={fixedHeader} />
      {children}
    </>
  )
}

export default Layout
