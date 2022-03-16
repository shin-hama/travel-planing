import * as React from 'react'
import { createApi } from 'unsplash-js'

import { unsplashConfig } from 'configs'

const unsplash = createApi({
  accessKey: unsplashConfig.accessKey,
  // ...other fetch options
})

export const useUnsplash = () => {
  const actions = React.useMemo(() => {
    const a = {
      searchPhoto: async (query: string) => {
        const result = await unsplash.photos.getRandom({
          query: query,
          orientation: 'landscape',
          count: 1,
        })

        if (result.errors) {
          throw new Error(`An error occurred: ${result.errors[0]}`)
        }

        return Array.isArray(result.response)
          ? result.response[0]
          : result.response
      },
    }

    return a
  }, [])

  return actions
}
