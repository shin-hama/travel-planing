import * as React from 'react'
import { EventInput } from '@fullcalendar/react'
import { v4 as uuidv4 } from 'uuid'

import {
  MoveEvent,
  ScheduleEvent,
  SpotEvent,
} from 'contexts/SelectedPlacesProvider'
import {
  PLANING_USERS_PLANS_EVENTS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'

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
type CreateSpotParams =
  | {
      type: 'move'
      params: BuildMoveParams
    }
  | {
      type: 'spot'
      params: BuildSpotParams
    }

export const useEvent = (planId?: string) => {
  const [user] = useAuthentication()
  const db = useFirestore()

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
        ...eventProps,
        id,
        title,
        start,
        end,
        color: 'transparent',
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
    async ({ type, params }: CreateSpotParams) => {
      let event: ScheduleEvent
      switch (type) {
        case 'move':
          event = buildMoveEvent(params)
          break
        case 'spot':
          event = buildSpotEvent(params)
          break

        default:
          throw new Error(`Type ${type} is not implemented`)
      }

      if (user && planId) {
        const path = PLANING_USERS_PLANS_EVENTS_COLLECTIONS(user.uid, planId)
        db.add(path, event)
      }

      return event
    },
    [buildMoveEvent, buildSpotEvent, db, planId, user]
  )

  return { create: createEvent }
}
