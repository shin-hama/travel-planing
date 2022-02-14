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

export const GET_SPOT_BY_ID = gql`
  query GetSpotByPk($place_id: String!) {
    spots_by_pk(place_id: $place_id) {
      name
      lng
      lat
      place_id
      prefecture {
        name
      }
      spots_types {
        type {
          category_types {
            category {
              name
            }
          }
        }
      }
    }
  }
`
