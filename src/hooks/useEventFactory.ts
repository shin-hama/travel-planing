import * as React from 'react'
import { EventInput } from '@fullcalendar/react'
import { v4 as uuidv4 } from 'uuid'

import { MoveEvent, ScheduleEvent, SpotEvent } from 'hooks/usePlanEvents'

type BuildMoveParams = {
  start: MoveEvent['start']
  end: MoveEvent['end']
  eventProps?: Partial<EventInput>
}

type BuildSpotParams = {
  id: string
  title: string
  start: SpotEvent['start']
  end: SpotEvent['end']
  props: Pick<SpotEvent['extendedProps'], 'placeId' | 'imageUrl'>
  eventProps?: Partial<EventInput>
}

export const useEventFactory = () => {
  const buildMoveEvent = React.useCallback(
    ({ start, end, eventProps = {} }: BuildMoveParams): MoveEvent => {
      return {
        id: uuidv4(),
        title: 'Move',
        color: '#E5E3C9',
        display: 'background',
        ...eventProps,
        start,
        end,
        extendedProps: {
          type: 'move',
          mode: 'car',
          from: 'null',
          to: 'null',
        },
      }
    },
    []
  )

  const buildSpotEvent = React.useCallback(
    ({
      id,
      title,
      start,
      end,
      props,
      eventProps = {},
    }: BuildSpotParams): SpotEvent => {
      return {
        id,
        title,
        color: 'transparent',
        ...eventProps,
        start,
        end,
        extendedProps: {
          type: 'spot',
          from: null,
          to: null,
          ...props,
        },
      }
    },
    []
  )

  const isSpotEvent = React.useCallback(
    (event: ScheduleEvent): event is SpotEvent => {
      return event.extendedProps.type === 'spot'
    },
    []
  )
  const isMoveEvent = React.useCallback(
    (event: ScheduleEvent): event is MoveEvent => {
      return event.extendedProps.type === 'move'
    },
    []
  )

  return { buildSpotEvent, buildMoveEvent, isSpotEvent, isMoveEvent }
}
