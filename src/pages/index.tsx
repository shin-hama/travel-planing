import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuthentication } from 'hooks/firebase/useAuthentication'
import Layout from 'components/layouts/Layout'

type Props = {
  image: string // The path of image
}
const Home: React.FC<Props> = ({ image }) => {
  const [user] = useAuthentication()
  const router = useRouter()
  React.useEffect(() => {
    if (user) {
      router.replace('/home')
    }
  }, [router, user])

  if (user) {
    return <></>
  }

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        direction={['column-reverse', 'column-reverse', 'row']}
        sx={{ my: 3 }}>
        <Grid item md={6} xs={12}>
          <Stack alignItems="center" spacing={4} sx={{ mx: 4 }}>
            <Typography
              component="h2"
              variant="h3"
              fontFamily={"'M PLUS Rounded 1c'"}
              fontWeight={800}>
              旅行を作ろう
            </Typography>
            <Typography variant="h6">
              楽しい旅行は計画作りから。「旅づくり」はあなたの行きたいところをめぐる最適なルートを提案します。
              「旅づくり」を使って最高の旅行にでかけよう!!
            </Typography>
            <Link href="/new" passHref>
              <Button variant="contained" size="large">
                <Typography fontWeight="bold">プランを作成する</Typography>
              </Button>
            </Link>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box display="flex" justifyContent="center" mx={6}>
            <Image
              src={image}
              width="330px"
              height="300px"
              alt="hero image"
              objectFit="contain"
            />
          </Box>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getStaticProps = () => {
  return {
    props: { image: '/images/hero.png' },
  }
}

export default Home
