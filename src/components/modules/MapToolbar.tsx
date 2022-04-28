import * as React from 'react'
import { styled } from '@mui/system'
import SvgIcon from '@mui/material/SvgIcon'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarWeek,
  faEllipsis,
  faMapLocationDot,
  faSuitcase,
} from '@fortawesome/free-solid-svg-icons'

import SpotsCandidates from 'components/modules/SpotsCandidates'
import ScheduleViewer from 'components/layouts/ScheduleViewer'
import { useTravelPlan } from 'hooks/useTravelPlan'
import PlanMenu from './PlanMenu'

type Drawers = 'spots' | 'schedule'

const MyTab = styled(Tab)`
  padding: 0;
`

const MapToolbar = () => {
  const [plan] = useTravelPlan()
  const [open, setOpen] = React.useState<Drawers | null>(null)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleOpen = (mode: Drawers) => () => {
    setOpen(mode)
  }
  const handleClose = () => {
    setOpen(null)
  }

  return (
    <>
      <Tabs
        value={value}
        variant="fullWidth"
        onChange={handleChange}
        sx={{ p: 0 }}>
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
        <MyTab
          icon={
            <SvgIcon>
              <FontAwesomeIcon icon={faEllipsis} />
            </SvgIcon>
          }
          label={<Typography variant="caption">設定</Typography>}
        />
      </Tabs>
      {/* <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="baseline">
        <Badge badgeContent={plan?.waypoints.length} color="primary">
          <LabeledIconButton
            onClick={handleOpen('spots')}
            icon={faLocationDot}
            label={'行きたい所'}
          />
        </Badge>
        <LabeledIconButton
          onClick={handleOpen('schedule')}
          icon={faCalendarWeek}
          label={'スケジュール'}
        />
        <LabeledIconButton
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          icon={faEllipsis}
          label={'設定'}
        />
      </Stack> */}
      <SpotsCandidates
        open={open === 'spots'}
        spots={plan?.waypoints || []}
        onOpen={() => handleOpen('spots')}
        onClose={handleClose}
      />
      <ScheduleViewer open={open === 'schedule'} onClose={handleClose} />
      <PlanMenu
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      />
    </>
  )
}

export default MapToolbar
