import * as React from 'react'
import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  SnapshotOptions,
} from 'firebase/firestore'

import dayjs from 'dayjs'

import { Plan } from 'contexts/CurrentPlanProvider'
import {
  PLANING_USERS_PLANS_COLLECTIONS,
  useFirestore,
} from './firebase/useFirestore'
import { useAuthentication } from './firebase/useAuthentication'
import { useUnsplash } from 'hooks/useUnsplash'
import { ScheduleDTO } from './useSchedules'

// Firestore data converter
export const planConverter: FirestoreDataConverter<Plan> = {
  toFirestore: (plan: Plan) => {
    return {
      ...plan,
      updatedAt: serverTimestamp(),
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Plan => {
    const data = snapshot.data(options)
    return {
      title: data.title,
      start: data.start?.toDate(), // Convert firestore timestamp to js Date.
      startTime: data.startTime?.toDate(), // Convert firestore timestamp to js Date.
      end: data.end?.toDate(),
      home: data.home,
      destination: data.destination,
      thumbnail: data.thumbnail || '',
      events:
        data.events?.map((event: DocumentData) => ({
          ...event,
          start: event.start?.toDate(),
          end: event.end?.toDate(),
        })) || [],
      routes: data.routes || [],
      lodging: data.lodging || undefined,
      belongings: data.belongings || [],
    }
  },
}
export type PlanDTO = Pick<
  Plan,
  'title' | 'start' | 'home' | 'destination' | 'days'
>

export const usePlans = () => {
  const db = useFirestore()
  const [user] = useAuthentication()
  const [plans, setPlans] = React.useState<QuerySnapshot<Plan> | null>(null)
  const unsplash = useUnsplash()

  React.useEffect(() => {
    if (!user) {
      return
    }
    const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
    db.getDocuments(path, planConverter).then((result) => {
      setPlans(result)
    })
  }, [db, user])

  const actions = React.useMemo(() => {
    const a = {
      create: async (planDTO: PlanDTO) => {
        try {
          let homePhoto
          let destPhoto
          try {
            homePhoto = (await unsplash.searchPhoto(planDTO.home.name_en)).urls
              .regular
            destPhoto = (
              await unsplash.searchPhoto(planDTO.destination.name_en)
            ).urls.regular
          } catch {
            // デモバージョンは rate limit が厳しいので、取得できないときは決め打ちで与える
            homePhoto =
              'https://images.unsplash.com/photo-1583839542943-0e5a56d29bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDk2NDl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDcxNTQyOTY&ixlib=rb-1.2.1&q=80&w=1080'
            destPhoto =
              'https://images.unsplash.com/photo-1583839542943-0e5a56d29bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDk2NDl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDcxNTQyOTY&ixlib=rb-1.2.1&q=80&w=1080'
          }
          const newPlan = {
            title: planDTO.title || `${planDTO.destination.name}旅行`,
            start: planDTO.start,
            startTime: dayjs(planDTO.start)
              .hour(8)
              .minute(30)
              .second(0)
              .toDate(),
            end: dayjs(planDTO.start).hour(8).minute(30).second(0).toDate(),
            thumbnail: destPhoto,
            home: { ...planDTO.home, imageUrl: homePhoto },
            destination: { ...planDTO.destination, imageUrl: destPhoto },
            days: planDTO.days,
            belongings: [],
            events: [],
            routes: [],
          }

          if (user) {
            const path = PLANING_USERS_PLANS_COLLECTIONS(user.uid)
            const plan = await db.add<Plan>(path, newPlan)

            const events = [...Array(planDTO.days)].map((_, i): ScheduleDTO => {
              const startDate = dayjs(planDTO.start)
                .add(i, 'day')
                .hour(9)
                .minute(0)
                .second(0)
              return {
                start: startDate.toDate(),
                end: startDate.hour(19).minute(0).toDate(),
                size: 0,
              }
            })

            events.forEach((event) => {
              db.addByRef(collection(plan, 'schedules'), event)
            })

            return plan.id
          }
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [db, unsplash, user])

  return [plans, actions] as const
}
