import * as React from 'react'
import { EventInput } from '@fullcalendar/react'
import { v4 as uuidv4 } from 'uuid'

import { MoveEvent, ScheduleEvent, SpotEvent } from 'hooks/usePlanEvents'

type BuildMoveParams = {
  start: MoveEvent['start']
  end: MoveEvent['end']
  eventProps?: Partial<EventInput>
  extendedProps: Omit<MoveEvent['extendedProps'], 'type'>
}

type BuildSpotParams = {
  title: string
  start: SpotEvent['start']
  end: SpotEvent['end']
  props: Pick<SpotEvent['extendedProps'], 'placeId' | 'imageUrl'>
  eventProps?: Partial<EventInput>
}

export const useEventFactory = () => {
  const actions = React.useMemo(() => {
    const a = {
      buildMoveEvent: (props: BuildMoveParams): MoveEvent => {
        return {
          id: uuidv4(),
          title: 'Move',
          color: '#E5E3C9',
          display: 'background',
          ...props.eventProps,
          start: props.start,
          end: props.end,
          extendedProps: {
            ...props.extendedProps,
            type: 'move',
          },
        }
      },

      buildSpotEvent: ({
        title,
        start,
        end,
        props,
        eventProps = {},
      }: BuildSpotParams): SpotEvent => {
        return {
          id: uuidv4(),
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
      isSpotEvent: (event: ScheduleEvent): event is SpotEvent => {
        return event.extendedProps.type === 'spot'
      },
      isMoveEvent: (event: ScheduleEvent): event is MoveEvent => {
        return event.extendedProps.type === 'move'
      },
    }
    return a
  }, [])

  return actions
}
