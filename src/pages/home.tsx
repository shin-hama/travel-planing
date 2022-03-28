import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type Props = {
  image: string // The path of image
}
const Home: React.FC<Props> = ({ image }) => {
  return (
    <Grid container direction={['column-reverse', 'column-reverse', 'row']}>
      <Grid item md={4} xs={12}>
        <Stack alignItems="center" spacing={4} sx={{ mx: 4 }}>
          <Typography variant="h3">キャッチコピー</Typography>
          <Typography variant="h5">
            Short description, Short description, Short description, Short
            description, Short description, Short description, Short
            description, Short description, Short description, Short
            description, Short description, Short description,
          </Typography>
          <Link href="/new" passHref>
            <Button variant="contained">プランを作成する</Button>
          </Link>
        </Stack>
      </Grid>
      <Grid item md={8} xs={12}>
        <Image src={image} width="100%" height={100} alt="hero image" />
      </Grid>
    </Grid>
  )
}

export const getStaticProps = () => {
  return {
    props: { image: '/' },
  }
}

export default Home
