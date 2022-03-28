import * as React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      Hello SSG
      <Link href="/new">create plan</Link>
    </>
  )
}

export const getStaticProps = () => {
  return {
    props: {},
  }
}

export default Home
