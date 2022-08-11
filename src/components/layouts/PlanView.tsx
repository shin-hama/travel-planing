import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import BelongingsList from './BelongingsList'
import PlanInfo from './PlanInfo'
import TabPanel from 'components/elements/TabPanel'
import { usePlan } from 'hooks/usePlan'
import PlanMenu from 'components/modules/PlanMenu'
import ImageWithUploader from 'components/modules/ImageWithUploader'
import { useStorage } from 'hooks/firebase/useStorage'
import { useAuthentication } from 'hooks/firebase/useAuthentication'

const PlanView = () => {
  const [{ data: plan, doc: planRef }, { update }] = usePlan()
  const [value, setValue] = React.useState(0)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const storage = useStorage()
  const [user] = useAuthentication()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleUploadImage = async (file: File) => {
    if (user) {
      const path = `${user.uid}/${planRef?.id}/${file.name}`
      const result = await storage.upload(file, path)
      const url = await storage.getDownloadURL(result.ref)
      update({ image: { url, ref: result.ref.fullPath } })
    }
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
          <ImageWithUploader
            src={plan?.image.url}
            onChange={handleUploadImage}
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
