import * as React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useConfirm } from 'hooks/useConfirm'

type Props = MenuProps & {
  onDelete?: () => void
}
const DayMenu: React.FC<Props> = ({ onDelete, ...props }) => {
  const confirm = useConfirm()

  const handleDelete = async () => {
    try {
      await confirm({
        title: 'CAUTION!!',
        description: '日付内のデータが削除されます。よろしいですか?',
      })
      onDelete?.()
    } finally {
      props.onClose?.({}, 'backdropClick')
    }
  }

  return (
    <Menu
      id="day-column-menu"
      {...props}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}>
      <MenuItem>この日のルートを最適化</MenuItem>
    </Menu>
  )
}

export default DayMenu
