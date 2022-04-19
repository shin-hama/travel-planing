import * as React from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
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

export const useFirestore = () => {
  const actions = React.useMemo(() => {
    const a = {
      /**
       * Set data to document that is specified id
       */
      set: async (
        path: string,
        id: string,
        data: WithFieldValue<DocumentData>
      ) => {
        try {
          await setDoc(
            doc(db, path, id),
            {
              ...data,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          )
        } catch (e) {
          console.error('Error adding document: ', e)
          throw e
        }
      },
      /**
       * Add data to firestore and generate id automatically
       */
      add: async (path: string, data: WithFieldValue<DocumentData>) => {
        try {
          const docRef = await addDoc(collection(db, path), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
          console.log('Document written with ID: ', docRef.id)
          return docRef
        } catch (e) {
          console.error('Error adding document: ', e)
          throw e
        }
      },
      update: async (
        path: string,
        id: string,
        data: WithFieldValue<DocumentData>
      ) => {
        try {
          await updateDoc(doc(db, path, id), {
            ...data,
            updatedAt: serverTimestamp(),
          })
        } catch (e) {
          console.error(`fail to update: ${e}`)
          throw e
        }
      },
      delete: async (path: string, id: string) => {
        try {
          await deleteDoc(doc(db, path, id))
        } catch (e) {
          console.error(`fail to update: ${e}`)
          throw e
        }
      },
      get: async <T>(
        path: string,
        id: string,
        converter: FirestoreDataConverter<T>
      ) => {
        return getDoc(doc(db, path, id).withConverter(converter))
      },
      getDocuments: async <T>(
        path: string,
        converter: FirestoreDataConverter<T>
      ) => {
        return getDocs(collection(db, path).withConverter(converter))
      },
    }
    return a
  }, [])

  return actions
}
