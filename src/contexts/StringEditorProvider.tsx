import * as React from 'react'
import StringEditor, {
  StringEditorProps,
} from 'components/modules/StringEditor'

type OpenProps = Pick<StringEditorProps, 'defaultValue' | 'onSave' | 'onCancel'>
const StringEditorContext = React.createContext<
  React.Dispatch<React.SetStateAction<OpenProps | null>>
>(() => {
  throw Error('StringEditorProvider is not wrapped')
})

export const StringEditorProvider: React.FC = ({ children }) => {
  const [props, setProps] = React.useState<OpenProps | null>(null)
  return (
    <>
      <StringEditorContext.Provider value={setProps}>
        {children}
      </StringEditorContext.Provider>
      {props && <StringEditor open={Boolean(props)} {...props} />}
    </>
  )
}

export const useStringEditor = () => {
  const openEditor = React.useContext(StringEditorContext)

  const edit = React.useCallback(
    async (defaultValue: string) => {
      try {
        const updated = await new Promise<string>((resolve, reject) => {
          const onSave = (text: string) => {
            resolve(text)
          }

          openEditor({ defaultValue, onSave, onCancel: reject })
        })

        console.log('Edited: ' + updated)

        return updated
      } catch {
        console.log('Error')
        return null
      } finally {
        openEditor(null)
      }
    },
    [openEditor]
  )

  return edit
}
