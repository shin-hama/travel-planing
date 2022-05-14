import * as React from 'react'

import { PlacesServiceContext } from 'contexts/PlacesServiceProvider'
import { SpotDTO } from 'components/modules/SpotCard'

export const usePlaces = () => {
  const places = React.useContext(PlacesServiceContext)

  const actions = React.useMemo(
    () => ({
      isLoaded: places !== null,
      getPhotos: async (placeId: string) => {
        if (places === null) {
          throw Error('JS Google Map api is not loaded')
        }

        const photos = await new Promise<Array<string>>((resolve, reject) => {
          places.getDetails(
            {
              placeId,
              fields: ['photos'],
            },
            (result, status) => {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                reject(new Error('Fail to connect google maps api'))
              }

              resolve(result?.photos?.map((item) => item.getUrl()) || [])
            }
          )
        })

        return photos
      },
      search: async (params: google.maps.places.TextSearchRequest) => {
        if (places === null) {
          throw Error('JS Google Map api is not loaded')
        }

        return await new Promise<Array<SpotDTO>>((resolve, reject) => {
          try {
            places.textSearch(params, (result) => {
              resolve(
                result?.map<SpotDTO>((spot) => {
                  return {
                    id: spot.place_id || '',
                    placeId: spot.place_id,
                    name: spot.name || '',
                    lat: spot.geometry?.location?.lat() || 0,
                    lng: spot.geometry?.location?.lng() || 0,
                  }
                }) || []
              )
            })
          } catch (e) {
            reject(e)
          }
        })
      },
    }),
    [places]
  )

  return actions
}
