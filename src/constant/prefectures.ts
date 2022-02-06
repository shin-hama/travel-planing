import { useGetPrefecturesQuery } from 'generated/graphql'

export const usePrefectures = () => {
  const { data, loading, error } = useGetPrefecturesQuery()

  if (loading) {
    return null
  }
  if (error) {
    console.error(`error ${error.message}`)
    return null
  }

  return data?.prefectures
}
