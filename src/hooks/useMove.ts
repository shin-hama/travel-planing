import * as React from 'react'

import { useFirestore } from './firebase/useFirestore'
import { useEvents } from './useEvents'
import { useSchedules } from './useSchedules'

type OrderedItem = {
  position: number
}

export const useMove = () => {
  const db = useFirestore()
  const [, eventsApi] = useEvents()
  const [schedules, schedulesApi] = useSchedules()

  const actions = React.useMemo(() => {
    const a = {
      reorderSchedule: (sourceIndex: number, destIndex: number) => {
        if (!schedules) {
          console.error('schedules are not found')
          return
        }

        const items = schedules.docs.map((doc) => doc.data())
        const newSchedule = actions.updatePosition(
          items,
          sourceIndex,
          destIndex
        )

        db.update(schedules.docs[sourceIndex].ref, newSchedule)
      },
      reorderEvent: (
        sourceIndex: number,
        sourceId: string,
        destIndex: number
      ) => {
        // moving to same list
        // 移動元のイベントを特定するために、Drop された Schedule を特定
        const schedule = schedulesApi.get(sourceId)
        if (!schedule) {
          console.error('Moved source object is not found')
          return
        }

        // 移動元のイベントを更新する
        const items = eventsApi.filter(schedule.ref.id)
        const reordered = actions.updatePosition(
          items.map((doc) => doc.data()),
          sourceIndex,
          destIndex
        )
        db.update(items[sourceIndex].ref, reordered)
      },
      moveEvent: (
        sourceIndex: number,
        sourceId: string,
        destIndex: number,
        destinationId: string
      ) => {
        // moving to another day
        const movedSpot = eventsApi.filter(sourceId)[sourceIndex]
        console.log(movedSpot.data())

        // droppableId は Schedule ドキュメントの ID が設定されているので、
        // それを使って移動先の Reference を取得
        const dest = schedulesApi.get(destinationId)
        if (!dest) {
          console.error(`schedule ${destinationId} is not found`)
          return
        }

        // 移動元のイベントを更新する
        const destEvents = eventsApi.filter(destinationId).map((e) => e.data())
        const reordered = actions.updatePosition(
          [movedSpot.data(), ...destEvents],
          0,
          destIndex
        )

        reordered.schedule = dest.ref
        db.update(movedSpot.ref, reordered)
      },
      updatePosition: <T extends OrderedItem>(
        items: T[],
        startIndex: number,
        destIndex: number
      ): T => {
        const cloned = Array.from(items)
        const [target] = cloned.splice(startIndex, 1)

        // 先頭に移動する場合は前のアイテムが存在しないので 0 を返す
        const prevPos = cloned[destIndex - 1]?.position || 0
        // 末尾に移動する場合は後のアイテムが存在しないので、末尾のPosition の 2 倍を返す
        // もとの要素数が 1 の場合は (0 + 2000) / 2 = 1000 となるように 2000 を返す
        const nextPos =
          cloned[destIndex]?.position ||
          (cloned[cloned.length - 1]?.position || 1000) * 2

        target.position = (prevPos + nextPos) / 2

        return target
      },
    }

    return a
  }, [db, eventsApi, schedules, schedulesApi])

  return actions
}
