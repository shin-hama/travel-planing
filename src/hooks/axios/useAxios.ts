import * as React from 'react'
import axios from 'axios'

export const useAxios = () => {
  const actions = React.useMemo(() => {
    const a = {
      post: async <T>(...params: Parameters<typeof axios.post>) => {
        const result = await axios.post<T>(...params)

        return result.data
      },
    }

    return a
  }, [])

  return actions
}
