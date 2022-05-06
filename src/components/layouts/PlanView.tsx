import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Image from 'next/image'

import { useTravelPlan } from 'hooks/useTravelPlan'
import TabPanel from 'components/modules/TabPanel'
import PlanInfo from './PlanInfo'
import BelongingsList from './BelongingsList'

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
        src={plan?.thumbnail}
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
      <TabPanel value={value} index={0} p={2}>
        <PlanInfo plan={plan} />
      </TabPanel>
      <TabPanel value={value} index={1} p={2}>
        <BelongingsList />
      </TabPanel>
    </Stack>
  )
}

export default PlanView
