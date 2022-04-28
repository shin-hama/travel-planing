import * as React from 'react'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
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
import Div100vh from 'react-div-100vh'

import MapView from './MapView'
import PlanView from './PlanView'
import ScheduleView from './ScheduleView'
import Header from 'components/modules/Header'
import TabPanel from 'components/modules/TabPanel'
import { MapLayerProvider } from 'contexts/MapLayerModeProvider'

const MyTab = styled(Tab)`
  padding: 0;
  min-height: 60px;
`

const PlanningLayout: React.FC = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  const [value, setValue] = React.useState(1)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Div100vh style={{ width: '100%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
        }}>
        <Header />
        <Box
          sx={{
            height: '100%',
            position: 'relative',
            flex: '1 1 0%',
          }}>
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
          </MapLayerProvider>
        </Box>
        <Tabs value={value} variant="fullWidth" onChange={handleChange}>
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
      </Box>
    </Div100vh>
  )
}

export default PlanningLayout
