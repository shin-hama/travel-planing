import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useConfirm } from 'hooks/useConfirm'
import { usePlan } from 'hooks/usePlan'
import { useAsyncFn } from 'react-use'
import { useRouter } from 'hooks/useRouter'
import { usePlanningTab } from 'contexts/PlanningTabProvider'

type Props = MenuProps
const PlanMenu: React.FC<Props> = (props) => {
  const [, planApi] = usePlan()
  const [, { openMap }] = usePlanningTab()
  const confirm = useConfirm()
  const router = useRouter()

  const [{ loading }, handleOptimize] = useAsyncFn(async () => {
    try {
      props.onClose?.({}, 'backdropClick')

      try {
        await confirm({
          allowClose: false,
          description:
            'Optimize your plan.\nWARNING: Current plan will be overwritten',
        })
      } catch {
        // when cancel
        return
      }
    } catch (e) {
      console.error(e)
    }
  }, [confirm, planApi])

  const handleAddHotel = () => {
    openMap('selector')
    props.onClose?.({}, 'backdropClick')
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

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ zIndex: 1 }}>
        <CircularProgress />
      </Backdrop>
    )
  }

  return (
    <Menu
      id="plan-menu"
      {...props}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}>
      <MenuItem onClick={handleOptimize}>ルート最適化</MenuItem>
      <MenuItem onClick={handleAddHotel}>ホテルを設定</MenuItem>
      <Divider />
      <MenuItem onClick={handleDelete}>Delete Plan</MenuItem>
    </Menu>
  )
}

export default PlanMenu
