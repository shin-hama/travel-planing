import { gql } from '@apollo/client'

export const GET_PREFECTURES = gql`
  query getPrefectures {
    prefectures {
      code
      name
      lat
      lng
      zoom
      place_id
    }
  }
`
