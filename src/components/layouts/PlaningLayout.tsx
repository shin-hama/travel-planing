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
import ScheduleListView from './ScheduleListView'
import { useRoutes } from 'hooks/useRoutes'
import { PlanningTab, usePlanningTab } from 'contexts/PlannigTabProvider'

const MyTab = styled(Tab)`
  padding: 0;
  min-height: 60px;
`

const PlanningLayout: React.FC = () => {
  const routesApi = useRoutes()
  const [tab, tabSwitch] = usePlanningTab()

  React.useEffect(() => {
    // とりあえずページアクセス時にキャッシュを削除するようにする
    console.log('clean routes cache')
    routesApi.clean()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: PlanningTab) => {
    tabSwitch.open(newValue)
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
          <TabPanel
            value={tab}
            index={'info'}
            position="absolute"
            overflow="hidden auto">
            <Box maxWidth="sm" mx="auto">
              <PlanView />
            </Box>
          </TabPanel>
          <TabPanel
            value={tab}
            index={'map'}
            position="absolute"
            overflow="hidden auto">
            <MapView />
          </TabPanel>
          <TabPanel
            value={tab}
            index={'schedule'}
            position="absolute"
            overflow="hidden auto">
            <Container sx={{ height: '100%', overflow: 'hidden' }}>
              <ScheduleListView />
            </Container>
          </TabPanel>
        </Box>
        <Tabs value={tab} variant="fullWidth" onChange={handleChange}>
          <MyTab
            value="info"
            icon={
              <SvgIcon>
                <FontAwesomeIcon icon={faSuitcase} />
              </SvgIcon>
            }
            label={<Typography variant="caption">プラン情報</Typography>}
          />
          <MyTab
            value="map"
            icon={
              <SvgIcon>
                <FontAwesomeIcon icon={faMapLocationDot} />
              </SvgIcon>
            }
            label={<Typography variant="caption">マップ</Typography>}
          />
          <MyTab
            value="schedule"
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
