import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'

const ListViewer: React.FC = ({ children }) => {
  return (
    <Drawer open={false} anchor="bottom">
      <Stack direction="row">{children}</Stack>
    </Drawer>
  )
}

export default ListViewer
