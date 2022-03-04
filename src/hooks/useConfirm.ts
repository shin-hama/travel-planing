import * as React from 'react'

import { DialogOptions } from 'components/molecules/ConfirmationDialog'
import { SetConfirmationPropsContext } from 'contexts/ConfirmationProvider'

type ResRej = {
  resolve: (value: void | PromiseLike<void>) => void
  reject: (reason?: unknown) => void
}
export const useConfirm = (customOptions: Partial<DialogOptions> = {}) => {
  const setConfirm = React.useContext(SetConfirmationPropsContext)
  const resRej = React.useRef<ResRej | null>(null)

  const handleConfirm = React.useCallback(() => {
    if (resRej.current !== null) {
      resRej.current.resolve()
    }
  }, [resRej])

  const handleCancel = React.useCallback(() => {
    if (resRej.current !== null) {
      resRej.current.reject()
    }
  }, [resRej])

  const handleClose = React.useCallback(() => {
    setConfirm((prev) => ({ ...prev, open: false }))
  }, [setConfirm])

  const confirm = React.useCallback(
    async (description: string) => {
      await new Promise<void>((resolve, reject) => {
        setConfirm((prev) => ({
          open: true,
          options: {
            ...prev.options,
            ...customOptions,
            description,
          },
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          onClose: handleClose,
        }))
        resRej.current = { resolve, reject }
      }).finally(() => {
        resRej.current = null
        setConfirm((prev) => ({
          ...prev,
          open: false,
        }))
      })
    },
    [customOptions, handleCancel, handleClose, handleConfirm, setConfirm]
  )

  return confirm
}
