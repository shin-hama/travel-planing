import * as React from 'react'
import AppBar from '@mui/material/AppBar'
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
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import Div100vh from 'react-div-100vh'

import MapView from './MapView'
import PlanView from './PlanView'
import TabPanel from 'components/modules/TabPanel'
import ScheduleListView from './ScheduleListView'
import { useRoutes } from 'hooks/useRoutes'
import { PlanningTab, usePlanningTab } from 'contexts/PlanningTabProvider'

type Menu = {
  label: string
  icon: IconDefinition
  value: PlanningTab
}
const TabMenus: Array<Menu> = [
  { label: 'プラン情報', icon: faSuitcase, value: 'info' },
  { label: 'マップ', icon: faMapLocationDot, value: 'map' },
  { label: 'スケジュール', icon: faCalendarWeek, value: 'schedule' },
]

const MapWrapper: React.FC = ({ children }) => {
  return (
    <Div100vh>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
        }}>
        {children}
      </Box>
    </Div100vh>
  )
}

const PlanningPage: React.FC = () => {
  const { routesApi } = useRoutes()
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

  const Wrapper = React.useMemo(() => (tab === 'map' ? MapWrapper : Box), [tab])

  return (
    <Wrapper>
      <Toolbar variant="dense" />
      <TabPanel value={tab} index={'info'}>
        <Box maxWidth="sm" mx="auto" sx={{ overflow: 'hidden' }}>
          <PlanView />
        </Box>
      </TabPanel>
      <TabPanel
        value={tab}
        index={'map'}
        display="flex"
        sx={{
          position: 'relative',
          flex: '1 1 0%',
        }}>
        <Box flexGrow={1}>
          <MapView />
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={'schedule'}>
        <Container sx={{ overflow: 'hidden' }}>
          <ScheduleListView />
        </Container>
      </TabPanel>

      <Toolbar />
      <AppBar position="fixed" color="inherit" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Tabs
            value={tab}
            variant="fullWidth"
            onChange={handleChange}
            sx={{ width: '100%' }}>
            {TabMenus.map((menu) => (
              <Tab
                key={menu.value}
                value={menu.value}
                icon={
                  <SvgIcon>
                    <FontAwesomeIcon icon={menu.icon} />
                  </SvgIcon>
                }
                label={<Typography variant="caption">{menu.label}</Typography>}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
    </Wrapper>
  )
}

export default PlanningPage
