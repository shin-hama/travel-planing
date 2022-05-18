import * as React from 'react'

import { SpotDTO } from 'components/modules/SpotCard'
import { useAxios } from 'hooks/axios/useAxios'
import { bffConfigs } from 'configs'
import { PlacesServiceContext } from 'contexts/PlacesServiceProvider'

type PlacesPhotoResult = {
  html_attribute: Array<string>
  image: string
}

export const usePlaces = () => {
  const { post } = useAxios()
  const places = React.useContext(PlacesServiceContext)

  const actions = React.useMemo(
    () => ({
      getPhotos: async (placeId: string) => {
        const result = await post<PlacesPhotoResult>(
          `${bffConfigs.url}/places_photos`,
          { place_id: placeId, max_width: 150, max_height: 150 }
        )
        console.log(result)
        return result.image
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
    [places, post]
  )

  return actions
}
