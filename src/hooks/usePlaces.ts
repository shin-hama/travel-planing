import * as React from 'react'

import { PlacesServiceContext } from 'contexts/PlacesServiceProvider'

export const usePlaces = () => {
  const places = React.useContext(PlacesServiceContext)

  const getPhotos = React.useCallback(
    async (placeId: string) => {
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

            console.log(result)
            resolve(result?.photos?.map(item => item.getUrl()) || [])
          }
        )
      })

      return photos
    },
    [places]
  )

  return { getPhotos }
}
