import { gql } from '@apollo/client'

export const GET_SPOTS_BY_CATEGORY = gql`
  query GetSpotsByCategory(
    $categoryId: Int!
    $north: Float!
    $south: Float!
    $west: Float!
    $east: Float!
  ) {
    spots(
      where: {
        spots_types: {
          type: { category_types: { category_id: { _eq: $categoryId } } }
          spot: {
            lat: { _gt: $south, _lt: $north }
            lng: { _gt: $west, _lt: $east }
          }
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

export const GET_SPOTS_WITH_MATCHING_NAME = gql`
  query GetSpotsWithMatchingName($name: String!) {
    spots(limit: 10, where: { name: { _regex: $name } }) {
      name
      place_id
      lng
      lat
    }
  }
`
