import * as React from 'react'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { Marker, Polyline } from '@react-google-maps/api'
import { useToggle } from 'react-use'

import CategorySelector from './CategorySelector'
import SearchBox from './SearchBox'
import SpotMarkers from './SpotMarkers'
import SpotCard from '../SpotCard'
import AnySpotCard from './AnySpotCard'
import { useSpots } from 'hooks/useSpots'
import { usePlanViewConfig } from 'contexts/PlanViewConfigProvider'
import { SpotDTO, useSchedules } from 'hooks/useSchedules'
import { useEvents } from 'hooks/useEvents'

const polylineOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 10,
  fillOpacity: 0.35,
  geodesic: true,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
}

type Props = {
  anySpot?: google.maps.LatLngLiteral | null
  setAnySpot: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
}
const MapOverlay: React.FC<Props> = ({ anySpot, setAnySpot }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null
  )
  const [config, setConfig] = usePlanViewConfig()
  const [focusedSpot, setFocusedSpot] = React.useState<SpotDTO | null>(null)
  const [routeMode, toggleMode] = useToggle(config.routeMode)
  const [spots, reload] = useSpots()
  const [events] = useEvents()
  const [schedules] = useSchedules()
  const waypoints = React.useMemo(
    () =>
      events
        .map((e) => e.data())
        .sort(
          (a, b) =>
            (schedules?.docs.find((s) => s.id === a.schedule.id)?.data()
              .position || 0) -
            (schedules?.docs.find((s) => s.id === b.schedule.id)?.data()
              .position || 0)
        ),
    [events, schedules?.docs]
  )

  React.useEffect(() => {
    setConfig({ routeMode })
  }, [setConfig, routeMode])

  React.useEffect(() => {
    if (selectedCategory) {
      reload(selectedCategory)
    }
    // マップが移動するたびに何度も Fetch することを防ぐため、bounds は依存に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  React.useEffect(() => {
    if (anySpot && !focusedSpot) {
      setFocusedSpot({ ...anySpot, name: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anySpot])

  const handleClickAway = () => {
    setFocusedSpot(null)
  }

  const handleMarkerClicked = (spot: SpotDTO) => {
    setFocusedSpot(spot)
    setAnySpot({ lat: spot.lat, lng: spot.lng })
  }

  return (
    <>
      <SpotMarkers
        spots={routeMode ? waypoints || [] : spots}
        focusedSpot={focusedSpot}
        onClick={handleMarkerClicked}
        routeMode={routeMode}
      />
      {routeMode && <Polyline path={waypoints} options={polylineOptions} />}
      <Box sx={{ position: 'absolute', left: 0, top: 0, ml: 2, mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SearchBox />
          <CategorySelector onChange={setSelectedCategory} />
        </Stack>
      </Box>
      <Box sx={{ position: 'absolute', right: 0, top: 0, mr: 2, mt: 2 }}>
        <Box
          sx={{
            color: 'white',
            transitionDuration: '300ms',
            backgroundColor: (theme) =>
              routeMode ? theme.palette.primary.main : 'white',
            borderRadius: 1,
          }}>
          <IconButton
            disableRipple
            onClick={toggleMode}
            color={routeMode ? 'inherit' : 'default'}>
            <SvgIcon>
              <FontAwesomeIcon icon={faRoute} />
            </SvgIcon>
          </IconButton>
        </Box>
      </Box>
      {focusedSpot && (
        <>
          {anySpot && !focusedSpot.placeId && <Marker position={anySpot} />}
          <ClickAwayListener
            mouseEvent="onMouseUp"
            onClickAway={handleClickAway}>
            <Box
              sx={{
                zIndex: 10,
                position: 'absolute',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '400px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
              {focusedSpot.placeId ? (
                <SpotCard spot={{ ...focusedSpot }} />
              ) : (
                <AnySpotCard lat={focusedSpot.lat} lng={focusedSpot.lng} />
              )}
            </Box>
          </ClickAwayListener>
        </>
      )}
    </>
  )
}

export default MapOverlay
