import * as React from 'react'
import { EventInput } from '@fullcalendar/react'
import { v4 as uuidv4 } from 'uuid'

import {
  MoveEvent,
  ScheduleEvent,
  SpotEvent,
} from 'contexts/SelectedPlacesProvider'

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
type CreateEventParams =
  | {
      type: 'move'
      params: BuildMoveParams
    }
  | {
      type: 'spot'
      params: BuildSpotParams
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

  const createEvent = React.useCallback(
    async ({ type, params }: CreateEventParams): Promise<ScheduleEvent> => {
      let event: ScheduleEvent
      switch (type) {
        case 'spot':
          // es-lint ではエラーが出ないが ts ではエラーが出る、エディタも問題ないので無視
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          event = buildSpotEvent(params)
          break
        case 'move':
          event = buildMoveEvent(params)
          break

        default:
          throw new Error(`Type ${type} is not implemented`)
      }

      return event
    },
    [buildMoveEvent, buildSpotEvent]
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

  return { create: createEvent, isSpotEvent, isMoveEvent }
}
