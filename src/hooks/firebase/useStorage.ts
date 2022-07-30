import * as React from 'react'
import {
  deleteObject,
  getBlob,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
  UploadResult,
} from 'firebase/storage'

import { storage } from 'configs'

type UseStorage = {
  upload: (file: File, path: string) => Promise<UploadResult>
  download: (path: string) => Promise<Blob>
  getDownloadURL: (reference: StorageReference) => Promise<string>
  delete: (path: string) => Promise<void>
}
export const useStorage = (): UseStorage => {
  const actions = React.useMemo<UseStorage>(() => {
    const a = {
      upload: (file: File, path: string) => {
        const storageRef = ref(storage, path)
        return uploadBytes(storageRef, file)
      },
      download: (path: string) => {
        const storageRef = ref(storage, path)
        return getBlob(storageRef)
      },
      getDownloadURL: (reference: StorageReference) => {
        return getDownloadURL(reference)
      },
      delete: async (path: string) => {
        const obj = ref(storage, path)
        await deleteObject(obj)
      },
    }

    return a
  }, [])

  return actions
}
