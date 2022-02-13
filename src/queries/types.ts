import { gql } from '@apollo/client'

export const GET_TYPES_BY_CATEGORY = gql`
  query GetTypesByCategory($category_id: Int!) {
    category_type(where: { category_id: { _eq: $category_id } }) {
      type {
        name
      }
    }
  }
`
