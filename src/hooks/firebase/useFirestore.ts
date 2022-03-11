import * as React from 'react'
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  setDoc,
  updateDoc,
  WithFieldValue,
} from 'firebase/firestore'

import { db } from 'configs'

/**
 *
 * @returns {string} path - planing/v1
 */
export const PLANING_ROOT_COLLECTIONS = (): string => `planing/v1`

/**
 *
 * @returns {string} path - planing/v1/users
 */
export const PLANING_USERS_COLLECTIONS = (): string =>
  `${PLANING_ROOT_COLLECTIONS()}/users`

/**
 *
 * @param {string} userId - target user id
 * @returns {string} path - planing/v1/users/${userId}/plans
 */
export const PLANING_USERS_PLANS_COLLECTIONS = (userId: string): string =>
  `${PLANING_USERS_COLLECTIONS()}/${userId}/plans`

/**
 *
 * @param {string} userId - target user id
 * @param {string} planId - target plan id
 * @returns {string} path - planing/v1/users/${userId}/plans/${planId}/events
 */
export const PLANING_USERS_PLANS_EVENTS_COLLECTIONS = (
  userId: string,
  planId: string
): string => `${PLANING_USERS_PLANS_COLLECTIONS(userId)}/${planId}/events`

export const useFirestore = () => {
  /**
   * Set data to document that is specified id
   */
  const set = React.useCallback(
    async (path: string, id: string, data: WithFieldValue<DocumentData>) => {
      try {
        await setDoc(doc(db, path, id), data)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    },
    []
  )

  /**
   * Add data to firestore and generate id automatically
   */
  const add = React.useCallback(
    async (path: string, data: WithFieldValue<DocumentData>) => {
      try {
        const docRef = await addDoc(collection(db, path), data)
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    },
    []
  )

  const get = React.useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`)
    })
  }, [])

  const update = React.useCallback(
    async (path: string, id: string, data: WithFieldValue<DocumentData>) => {
      await updateDoc(doc(db, path, id), data)
    },
    []
  )
  return { add, get, set, update }
}
