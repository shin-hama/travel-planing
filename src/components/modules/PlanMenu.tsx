import * as React from 'react'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useConfirm } from 'hooks/useConfirm'
import { usePlan } from 'hooks/usePlan'
import { useRouter } from 'hooks/useRouter'
import { usePlanningTab } from 'contexts/PlanningTabProvider'

type Props = MenuProps
const PlanMenu: React.FC<Props> = (props) => {
  const [{ data: plan }, planApi] = usePlan()
  const [, { openMap }] = usePlanningTab()
  const confirm = useConfirm()
  const router = useRouter()

  const handleAddHotel = () => {
    openMap('selector')
    props.onClose?.({}, 'backdropClick')
  }

  const handlePublish = async () => {
    if (!plan?.published) {
      try {
        await confirm({
          title: 'Info',
          description:
            'URLを共有することで誰でもプランが閲覧できるようになります。よろしいですか?',
        })
        planApi.update({ published: true })
      } finally {
        props.onClose?.({}, 'backdropClick')
      }
    } else {
      planApi.update({ published: false })
    }
  }

  const handleDelete = async () => {
    try {
      await confirm({
        title: 'CAUTION!!',
        description: '旅行プランが完全に削除されます。よろしいですか?',
      })
      await planApi.delete()
      router.userHome()
    } finally {
      props.onClose?.({}, 'backdropClick')
    }
  }

  return (
    <Menu
      id="plan-menu"
      {...props}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}>
      <MenuItem onClick={handleAddHotel}>
        <ListItemText>ホテルを設定</ListItemText>
      </MenuItem>
      <MenuItem onClick={handlePublish}>
        <ListItemText>プランを{plan?.published && '非'}公開</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleDelete}>
        <ListItemText>Delete Plan</ListItemText>
      </MenuItem>
    </Menu>
  )
}

export default PlanMenu
