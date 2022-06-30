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
import { useSchedules } from './useSchedules'

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
  const unsplash = useUnsplash()
  const [, schedulesApi] = useSchedules()
  const [plans, setPlans] = React.useState<QuerySnapshot<Plan> | null>(null)

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
            days: planDTO.days || 0,
            belongings: [],
          }

          if (!user) {
            return ''
          }

          const plan = await addDoc(PLANS_SUB_COLLECTIONS(user.uid), newPlan)

          // days は宿泊数なので、日程の総数は +1 日
          Array.from(Array((newPlan.days || 0) + 1)).forEach(() => {
            schedulesApi.create(plan)
          })

          return plan.id
        } catch (e) {
          console.error(e)
        }
      },
    }

    return a
  }, [schedulesApi, unsplash, user])

  return [plans, actions] as const
}
