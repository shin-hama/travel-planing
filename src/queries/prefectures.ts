import { gql } from '@apollo/client'

export const ADD_PREFECTURE = gql`
  mutation insertPrefectures($objects: [prefectures_insert_input!]!) {
    insert_prefectures(objects: $objects) {
      affected_rows
      returning {
        zoom
        updated_at
        name
        lng
        lat
        created_at
        code
      }
    }
  }
`

export const GET_PREFECTURES = gql`
  query getPrefectures {
    prefectures {
      code
      name
      lat
      lng
      zoom
    }
  }
`

export const GET_PREFECTURE = gql`
  query getPrefecture($code: Int!) {
    prefectures_by_pk(code: $code) {
      code
      lat
      lng
      name
      zoom
    }
  }
`
