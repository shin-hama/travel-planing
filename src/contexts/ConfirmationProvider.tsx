import * as React from 'react'
import ConfirmationDialog, {
  ConfirmationProps,
  DialogOptions,
} from 'components/molecules/ConfirmationDialog'

const defaultOptions: DialogOptions = {
  title: 'Are you sure?',
  description: '',
  dialogProps: {},
  allowClose: false,
}

export const SetConfirmationPropsContext = React.createContext<
  React.Dispatch<React.SetStateAction<ConfirmationProps>>
>(() => {
  throw Error('ConfirmationProvider is not wrapped')
})

export const ConfirmationProvider: React.FC = ({ children }) => {
  const [props, setProps] = React.useState<ConfirmationProps>({
    open: false,
    options: { ...defaultOptions },
    onCancel: () => null,
    onConfirm: () => null,
    onClose: () => null,
  })

  return (
    <>
      <SetConfirmationPropsContext.Provider value={setProps}>
        {children}
      </SetConfirmationPropsContext.Provider>
      <ConfirmationDialog {...props} />
    </>
  )
}
