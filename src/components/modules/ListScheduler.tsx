import * as React from 'react'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import { Plan, SpotEvent } from 'contexts/CurrentPlanProvider'
import { useScheduleEvents } from 'hooks/useScheduleEvents'
import { useWaypoints } from 'hooks/useWaypoints'
import { PlanAPI } from 'hooks/useTravelPlan'

// useTravelPlan() が何度も再読み込みされるのを防ぐために props で受け取る
type Props = {
  plan: Plan
  planApi: PlanAPI
}
const ListScheduler: React.FC<Props> = ({ plan, planApi }) => {
  const [events, eventsApi] = useScheduleEvents()
  const [waypoints, waypointsApi] = useWaypoints()

  const [range, setRange] = React.useState<{
    start: Date
    end: Date
  }>({
    start: new Date(),
    end: new Date(),
  })

  const handleEventsSet = (_events: EventApi[]) => {
    if (_events.length === 0) {
      return
    }

    const days = _events.map((e) => dayjs(e.start))
    const sorted = days.sort((a, b) => a.diff(b))
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    // Not update visibleRange if range is not changed
    if (
      first.date() !== range.start.getDate() ||
      last.date() !== range.end.getDate()
    ) {
      setRange({
        start: first.toDate(),
        end: last.toDate(),
      })
    }
  }

  const handleEventDrop = async (e: EventDropArg) => {
    // 画面上で元の位置に戻らないようとりあえず Event を更新する
    const droppedEvent = eventsApi.get<SpotEvent>(
      e.event.id,
      e.event.extendedProps.type
    )
    if (!droppedEvent) {
      throw new Error('Cannot find dropped event')
    }

    if (e.event.end && e.oldEvent.end) {
      if (Math.abs(e.event.end.getDate() - e.oldEvent.end.getDate()) >= 1) {
        if (!waypoints) {
          return
        }

        console.log('Move day')
        const prevSpots = events
          ?.filter(
            (event): event is SpotEvent =>
              event.extendedProps.type === 'spot' &&
              // 移動したイベントよりも前のイベントでフィルター
              dayjs(e.event.start).diff(event.start) > 0
          )
          .sort((a, b) => dayjs(b.start).diff(a.start)) // 開始日の降順に並び替え

        const prevIndex = waypoints?.findIndex(
          (spot) => spot.id === prevSpots[0].id
        )

        waypointsApi.move(
          droppedEvent.id,
          prevIndex !== -1 ? prevIndex : 0 // 移動した先にイベントがない場合は、最初に挿入する
        )
      } else {
        // 同じ日付内で移動した場合は、全てのイベントの開始時刻を同じだけずらす
        console.log('move all')

        planApi.update({
          startTime: dayjs(plan.startTime)
            .add(e.delta.milliseconds, 'millisecond')
            .toDate(),
        })
      }
    }
  }

  return (
    <>
      {events.map((event) => (
        <div key={event.id}>{event.name}</div>
      ))}
    </>
  )
}

export default ListScheduler
