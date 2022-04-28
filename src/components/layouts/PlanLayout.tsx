import * as React from 'react'
import { styled } from '@mui/system'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarWeek,
  faMapLocationDot,
  faSuitcase,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

import PlanningLayout from 'components/layouts/PlaningLayout'
import { MapLayerProvider } from 'contexts/MapLayerModeProvider'
import { useTravelPlan } from 'hooks/useTravelPlan'
import { useRouter } from 'hooks/useRouter'
import MapView from './MapView'
import ScheduleView from './ScheduleView'
import TabPanel from 'components/modules/TabPanel'
import PlanView from './PlanView'

const MyTab = styled(Tab)`
  padding: 0;
  min-height: 60px;
`

const PlanLayout = () => {
  const router = useRouter()
  const [plan] = useTravelPlan()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  if (!plan) {
    return (
      <PlanningLayout>
        <Stack alignItems="center" py={6} spacing={3}>
          <Typography variant="h2">Plan is not exist</Typography>
          <Link href={router.home}>Back to home</Link>
        </Stack>
      </PlanningLayout>
    )
  }

  return (
    <PlanningLayout>
      <Stack height="100%" width="100%">
        <MapLayerProvider>
          <TabPanel value={value} index={0}>
            <PlanView />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MapView />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ScheduleView onClose={() => setValue(0)} />
          </TabPanel>
          <Tabs
            value={value}
            variant="fullWidth"
            onChange={handleChange}
            sx={{ flexGrow: 1 }}>
            <MyTab
              icon={
                <SvgIcon>
                  <FontAwesomeIcon icon={faSuitcase} />
                </SvgIcon>
              }
              label={<Typography variant="caption">プラン情報</Typography>}
            />
            <MyTab
              icon={
                <SvgIcon>
                  <FontAwesomeIcon icon={faMapLocationDot} />
                </SvgIcon>
              }
              label={<Typography variant="caption">マップ</Typography>}
            />
            <MyTab
              icon={
                <SvgIcon>
                  <FontAwesomeIcon icon={faCalendarWeek} />
                </SvgIcon>
              }
              label={<Typography variant="caption">スケジュール</Typography>}
            />
          </Tabs>
        </MapLayerProvider>
      </Stack>
    </PlanningLayout>
  )
}

export default PlanLayout
