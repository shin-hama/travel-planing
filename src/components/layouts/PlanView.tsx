import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

import { useTravelPlan } from 'hooks/useTravelPlan'
import SpotsList from 'components/modules/SpotsList'

const PlanView = () => {
  const [plan] = useTravelPlan()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  if (!plan) {
    return <>Now Loading...</>
  }

  return (
    <Stack>
      <Image
        src={plan?.home.imageUrl}
        width={16}
        height={9}
        layout="responsive"
        objectFit="cover"
      />
      <Box>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="info" />
          <Tab label="持ち物" />
        </Tabs>
      </Box>
      <Box p={2}>
        <Stack spacing={4}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start">
            <Stack>
              <Typography variant="h1" noWrap>
                {plan?.title}
              </Typography>
              <Typography variant="subtitle2">
                {`${plan.start.toLocaleDateString()} ~ ${plan.end.toLocaleDateString()}`}
              </Typography>
              <Typography variant="caption">
                {`from ${plan.home.name} to ${plan.destination.name}`}
              </Typography>
            </Stack>
            <IconButton disabled>
              <SvgIcon>
                <FontAwesomeIcon icon={faEdit} />
              </SvgIcon>
            </IconButton>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h2">行きたいところリスト</Typography>
            {plan.waypoints.length > 0 ? (
              <SpotsList spots={plan.waypoints} />
            ) : (
              <Typography variant="subtitle1">
                地図上で行きたい場所を選んでください。
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default PlanView
