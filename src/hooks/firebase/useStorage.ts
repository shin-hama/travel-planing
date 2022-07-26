import * as React from 'react'
import {
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
    }

    return a
  }, [])

  return actions
}
