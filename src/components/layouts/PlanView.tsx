import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import BelongingsList from './BelongingsList'
import PlanInfo from './PlanInfo'
import TabPanel from 'components/elements/TabPanel'
import { usePlan } from 'hooks/usePlan'
import PlanMenu from 'components/modules/PlanMenu'

const PlanView = () => {
  const [{ data: plan }] = usePlan()
  const [value, setValue] = React.useState(0)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleOpenMenu = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setMenuAnchor(e.currentTarget)
  }

  if (!plan) {
    return <>Now Loading...</>
  }

  return (
    <>
      <Stack width="100%">
        <Box width="100%">
          <Image
            src={plan?.thumbnail}
            width={16}
            height={9}
            layout="responsive"
            objectFit="cover"
          />
        </Box>
        <Stack direction="row" justifyContent="space-between">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="info" />
            <Tab label="持ち物" />
          </Tabs>
          <IconButton onClick={handleOpenMenu}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </IconButton>
        </Stack>
        <TabPanel value={value} index={0} p={2}>
          <PlanInfo plan={plan} />
        </TabPanel>
        <TabPanel value={value} index={1} p={2}>
          <BelongingsList />
        </TabPanel>
      </Stack>
      <PlanMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      />
    </>
  )
}

export default PlanView
