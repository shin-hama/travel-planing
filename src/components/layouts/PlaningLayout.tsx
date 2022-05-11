import * as React from 'react'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import SvgIcon from '@mui/material/SvgIcon'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Toolbar from '@mui/material/Toolbar'
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
import TabPanel from 'components/modules/TabPanel'
import { MapLayerProvider } from 'contexts/MapLayerModeProvider'
import ScheduleListView from './ScheduleListView'
import { useRoutes } from 'hooks/useRoutes'

const MyTab = styled(Tab)`
  padding: 0;
  min-height: 60px;
`

const PlanningLayout: React.FC = () => {
  const [value, setValue] = React.useState(1)
  const routesApi = useRoutes()

  React.useEffect(() => {
    console.log('clean routes cache')
    routesApi.clean()
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
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
        <Toolbar variant="dense" />
        <Box
          sx={{
            height: '100%',
            position: 'relative',
            flex: '1 1 0%',
          }}>
          <MapLayerProvider>
            <TabPanel
              value={value}
              index={0}
              position="absolute"
              overflow="hidden auto">
              <Box maxWidth="sm" mx="auto">
                <PlanView />
              </Box>
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              position="absolute"
              overflow="hidden auto">
              <MapView />
            </TabPanel>
            <TabPanel
              value={value}
              index={2}
              position="absolute"
              overflow="hidden auto">
              <Container sx={{ height: '100%', overflow: 'hidden' }}>
                <ScheduleListView onClose={() => setValue(0)} />
              </Container>
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
