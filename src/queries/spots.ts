import { gql } from '@apollo/client'

export const GET_SPOTS_BY_CATEGORY = gql`
  query GetSpotsByCategory($categoryId: Int!) {
    spots(
      where: {
        spots_types: {
          type: { category_types: { category_id: { _eq: $categoryId } } }
        }
      }
    ) {
      name
      lat
      lng
      place_id
    }
  }
`
