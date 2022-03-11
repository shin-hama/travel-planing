import * as React from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'

import { db } from 'configs'

export const useFirestore = () => {
  const add = React.useCallback(async () => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        first: 'Ada',
        last: 'Lovelace',
        born: 1815,
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }, [])

  const get = React.useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`)
    })
  }, [])

  return { add, get }
}
