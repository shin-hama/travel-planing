import * as React from 'react'
import {
  addDoc,
  DocumentData,
  FirestoreDataConverter,
  onSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  SnapshotOptions,
} from 'firebase/firestore'

import dayjs from 'dayjs'

import { Plan, PLANS_SUB_COLLECTIONS } from 'contexts/CurrentPlanProvider'
import { useAuthentication } from './firebase/useAuthentication'
import { useUnsplash } from 'hooks/useUnsplash'
import { ScheduleDTO } from './useSchedules'
import { SCHEDULES_SUB_COLLECTIONS } from 'contexts/CurrentSchedulesProvider'

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
  const [user] = useAuthentication()
  const [plans, setPlans] = React.useState<QuerySnapshot<Plan> | null>(null)
  const unsplash = useUnsplash()

  React.useEffect(() => {
    if (!user) {
      return
    }

    const unsubscribe = onSnapshot(
      PLANS_SUB_COLLECTIONS(user.uid),
      (result) => {
        setPlans(result)
      },
      (error) => {
        console.error(error)
        setPlans(null)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [user])

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
          const newPlan: Plan = {
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
          }

          if (!user) {
            return ''
          }

          const plan = await addDoc(PLANS_SUB_COLLECTIONS(user.uid), newPlan)

          const schedules = [...Array((planDTO.days || 0) + 1)].map(
            (_, i): ScheduleDTO => {
              const startDate = dayjs(planDTO.start)
                .add(i, 'day')
                .hour(9)
                .minute(0)
                .second(0)
              return {
                start: startDate.toDate(),
                end: startDate.hour(19).minute(0).toDate(),
                size: 0,
                position: 1024 * (i + 1),
              }
            }
          )

          schedules.forEach((schedule) => {
            addDoc(SCHEDULES_SUB_COLLECTIONS(plan), schedule)
          })

          return plan.id
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [unsplash, user])

  return [plans, actions] as const
}
