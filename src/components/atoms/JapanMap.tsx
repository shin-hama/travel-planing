import * as React from 'react'
import { styled } from '@mui/material/styles'

const InteractiveGElement = styled('g')(() => ({
  ':hover': {
    fill: 'blue',
  },
}))

const ClickPrefectureContext = React.createContext<(code: number) => void>(
  () => {
    throw new Error('ClickPrefectureContext is not wrapped')
  }
)

type PrefectureProps = React.SVGAttributes<SVGGElement> &
  React.SVGProps<SVGGElement> & {
    code: number
  }

const Prefecture: React.FC<PrefectureProps> = ({
  children,
  code,
  ...props
}) => {
  const handleClick = React.useContext(ClickPrefectureContext)
  return (
    <InteractiveGElement onClick={() => handleClick(code)} {...props}>
      {children}
    </InteractiveGElement>
  )
}

type Props = {
  onClickPrefecture: (code: number) => void
}
const JapanMap: React.FC<Props> = ({ onClickPrefecture }) => {
  return (
    <ClickPrefectureContext.Provider value={onClickPrefecture}>
      <svg
        className="map_svg__geolonia-svg-map"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg">
        <g className="map_svg__svg-map" strokeLinejoin="round">
          <g className="map_svg__prefectures" fill="#EEE" stroke="#000">
            <Prefecture
              className="map_svg__okinawa map_svg__kyusyu-okinawa map_svg__prefecture"
              code={47}
              transform="matrix(1.0288 0 0 1.0288 12.127 188.272)">
              <path d="m4 109 2 1-2 1-4-1zM48 121l7 2-4 6-12-5 3-2 2 3 2-7zM132 113l-2-3h2l-2-2 3-3-1-5 3 8 7 6zM225 23l-1 5-5-5 4-2zM73 117l4-5 2 1-6 7-1 6-6 1-2-2 3-3-4-3 8 1zM287 20l4-3-5-2-1-7 7 2v4l7-1-1-2 9-11 2 5v4l-4 6h-5l-1 4h-6l1 2-6 4h-7l5 9-5-3-5 8 4 2-10 5v-8l7-6-2-8 5 1zM127 106l-1-3 2 1zM279 8V6l4 2z" />
              <path d="m293 11 1 2-2-1z" />
            </Prefecture>
            <Prefecture
              className="map_svg__kagoshima map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={46}
              transform="matrix(1.0288 0 0 1.0288 57.394 7.202)">
              <path d="m23 949 3 2-3 1zM33 960l-1-6 7-4 9 6-1 5-6 4-6-1zM64 953v5l-5 1-1-7 4-3 1-10 7-10 1 9zM38 844l5 4 9-4 5 6-1 2 5 7 5 5-1 5 5 2 3 9 7 1v7l-2 3-3-1-5 6 5 3-2 4 3-1-7 3-3 5-16 8v-5l5-3 4-12-6-9 1-5-6-3 5-2 1 4 3 1 4-6-7-6-4 2-6 13 2 11 5 3-2 5-6 1-3-6H27l1-4-3-1 2-2-5-4h9l4-10-3-9-5-4 3-7-2-12 3-2 4 2zM31 837l3-1-1 2zM27 848l-3-6 5-2 1 4zM4 868l2-3 1 2-5 8-2-1zM12 864l-3-3h5zM284 149l-4 1-1-4 10-2zM301 126v-8h5l-1 4 4 4-1 3-5 3-3-4zM363 98l-3 1-1-2 6-4zM344 90l-13 8 4 3-5 3-3-1 2 4-6-5 2-3-9-2h8l1-2-4-1 14-6 2 2 2-4 5-1-2 4 2-2 1 2 2-7 2 6z" />
              <path d="m324 108-2-2-2 2-2-7 5 1-1 3 6 2-3 2 1-2zM355 12l-3 4v-3zM361 1l2-1 2 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__miyazaki map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={45}
              transform="matrix(1.0288 0 0 1.0288 115.007 837.449)">
              <path d="m36 0 2 1 5-1 5 5h8l3-4 4 1v5h2L54 17l-1 4 3 1-4 1-1 2 2 1-6 8-6 17-2 23-5 5-2 12-5-2-5-5 2-3v-7l-7-1-3-9-5-2 1-5-5-5-5-7 1-2 21-2-3-6 4-5-5-7v-7l5-2 9-14z" />
            </Prefecture>
            <Prefecture
              className="map_svg__oita map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={44}
              transform="matrix(1.0288 0 0 1.0288 126.324 782.922)">
              <path d="m0 34 3-5-3-3 2-2-1-5 4-6 7-4 7 1 1-7 13 4 5-7 9 4 2 6-3 8-3-1v3l-8 2 1 4 4 2 16-1-6 9h6l-3 2 3 2 5-2 1 3h-5l-2 4 10 4h-6l2 2-4 3 3 1-6 1v4h-2v-5l-4-1-3 4h-8l-5-5-5 1-2-1-4-4 1-6-7-13H9l1 6-2 3z" />
            </Prefecture>
            <Prefecture
              className="map_svg__kumamoto map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={43}
              transform="matrix(1.0288 0 0 1.0288 76.941 812.758)">
              <path d="m8 37 5 1v10l-8 9-4 1v-6l4-1-5-1 4-10-1-3h5Zm12 10h-6l-2-4 7-4h7l-3 8h-3Zm4-13h2v4h-3l1-4Zm14 33-5-6-9 4-5-4 13-15-2-6 2 1-1-2 6-5H26l8-6 1-5-8-8-1-5h5l-1-3 5-4 4 1 1-4 8 5 8 5 2-3-1-6h6l7 13-1 6 4 4h-4l-9 14-5 2v7l5 7-4 5 3 6-21 2Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__nagasaki map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={42}
              transform="matrix(1.0288 0 0 1.0288 3.896 709.877)">
              <path d="m53 1 2-1 2 2-3 3 1 4-6 6-1 4 3-1-2 4 2-1-3 4v-5l-2 2v-3l-1 3-3-2h2l1-5h2l-2-1 4-4-3-2 2-5h4l1-2Zm-7 28-3 6-6 1 3-14 1 2 4 1-1-3 1 4 3-1-2 4Zm21 30 1 2-4 2-4-4h2l-1-3 3-3 3 2-1 2 2 1-1 1Zm-39 51-3 5 1-5-3-3 3-1v-4h2l2-8-2 11 5 1-3 2-2-2v4Zm-4 2-3-1v-2l2 2-1-3 2 4Zm-5 1 1-3-1 6-3-5 3 2Zm-13 5 3-1 1 2 2-4 4 10-7-1v5l-9-3 1-2 2 2 1-1H2l3-3-1-6 2 2Zm59-38-3 1 2-3 1 2Zm2 2 3 2-3 2v-4Zm-38 6 2-3 2 2-4 1Zm25-12-3 1 4-3-1 2Zm12 10-2 3 2 7 7 2-1 4 6 7 8 3-7 5 13 1 2 5-2 7-10 4-2-6 5-4-1-2-5-1-8 2-3 6-8 5 4-5-1-3 2 1 2-4-3 2-1-7-4-1-3-6 3-11 4 4-1 4 1-2 3 2-2 7 11 3-4-6 1-5-3-4-3 2-1-6h-3v-2l-4 3 2-2-3-2v-3 2l-4-2 4-6-3-1 1-3 5-1v3l5-1 1 2Zm-17 2-1 4-6 2 5-3-2-2 3-5h4l2-3 1 3-6 4Zm-34 27v-2l3 3-3 2v-3Zm49-14-1 3-1-3 2-3v3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__saga map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={41}
              transform="matrix(1.0288 0 0 1.0288 69.74 784.98)">
              <path d="M15 6h13l6 6 7-2-1 6-8 5-2 7-5-5-6 6 3 10-8-3-6-7 1-4-7-2-2-7 2-3 3 4-1-4 2-4-4-3 1-2 3 2V0l1 2h4l1 5z" />
            </Prefecture>
            <Prefecture
              className="map_svg__fukuoka map_svg__kyusyu map_svg__kyusyu-okinawa map_svg__prefecture"
              code={40}
              transform="matrix(1.0288 0 0 1.0288 85.172 763.375)">
              <path d="m40 53-8-5-1 4-4-1-5 4 1 3h-5v-6l-3-3 2-7 8-5 1-6-7 2-6-6H0l7-4-4-3 7-5 3 6 7-1 1-5-4 2-3-3 5 1 4-3 2-7 10-2 1-3 6 1-4 4h3l2-3 3 2 7-4-4 8 3 2-2 1 5 11h5l-1 7-7-1-7 4-4 6 1 5-2 2 3 3z" />
            </Prefecture>
            <Prefecture
              className="map_svg__kochi map_svg__shikoku map_svg__prefecture"
              code={39}
              transform="matrix(1.0288 0 0 1.0288 216.86 776.75)">
              <path d="m61 0 13 6 6-2 1 8 7 1-2 4 2 4 6 1-7 19-12-16-10-4-10 2v-2l1 3-12 4h6l-6 1-2 3-1-3-3 4 1 5-2 6h-3l-4 8-5 1v8l-3 3 3 6-4-4-7 2-5-3-4 2 1-6 4-1-1-3H6l2-3-3-13 4 3 6-8 5-3-4-9 11-1 3-10 7-9 24-4ZM1 69l-1 1v-3l1 2Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__ehime map_svg__sikoku map_svg__prefecture"
              code={38}
              transform="matrix(1.0288 0 0 1.0288 190.11 747.943)">
              <path d="m34 21-3-1 4-3-1 4ZM55 6h-4l4-6 2 3-2 3Zm5-1h1l-1 2-3-1 3-1Zm-2 5-4 2 1-5 5 1-2 2ZM32 85l-7-2v3h-2l1-5 3 1-6-6h3l-2-4h3l-3-1 1-2-3-2 4 3 4-4v-3h-4l3-3h-8l2-3-2-1 3-5-6-1-8 6-8 1 35-20 6-19 9-3-2-4 3-1 8 14 11-4 10 2 4-4 5 2-2 8-24 4-7 9-3 10-11 1 4 9-5 3-6 8-4-3 3 13-2 3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__kagawa map_svg__shikoku map_svg__prefecture"
              code={37}
              transform="matrix(1.0288 0 0 1.0288 275.501 734.568)">
              <path d="m6 33-5-2 3-10-4-4 6 3 13-10 7 3 4-4 1 5 3-3 3 3-1 3 9 5-1 3-13-2-9 7-7-3-9 6ZM27 5l-2-1h4l-2 1Zm13-5h2l-2 8-2-1V5l-3 4V5l-4-2 9-3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__tokushima map_svg__shikoku map_svg__prefecture"
              code={36}
              transform="matrix(1.0288 0 0 1.0288 279.616 755.144)">
              <path d="m50 2 2-2-1 4-1-2Zm-9 0 8-2v3l3 1-4 9 7 7-5 4 7 2-19 10-5 7-6-1-2-4 2-4-7-1-1-8-6 2-13-6 2-8 9-6 7 3 9-7 13 2 1-3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__yamaguchi map_svg__chugoku map_svg__prefecture"
              code={35}
              transform="matrix(1.0288 0 0 1.0288 131.468 720.165)">
              <path d="m45 0 2 6-4 5 2 4h5l-2 5 2 4 6-2 2 2 3-4-1-4 4-2v7l2 2 1 6 5 2v5h-3l1 8-5 2v8l-4-6h-4l-5-6-5 2 3-3-4-3-11 4-3-3-2 3-1-2-2 2v-4l-2 5-4 2-2-2-3 2-1-5-6-4-6 7v-7l-3-4 4-5-3-6 3-4h6l-5-2 2-3 9 2 1 3h7l6-2-1-3L41 1l2 1 2-2Zm19 54-5 2 3-4 2 2Zm11-4 8-2-5 2-1 3-4-3-4 3-2-5 3-2 5 4ZM18 15v-2l4 1-4 1Zm33 31h-3l3-3v3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__hiroshima map_svg__chugoku map_svg__prefecture"
              code={34}
              transform="matrix(1.0288 0 0 1.0288 195.254 696.502)">
              <path d="m73 40-1 2-3-2 3 3-2-1-2 5-5-2v-3l-9 2-3 4-12 1-2 4-7 2-2-2-3 3 1-3-3-6 2-2-8-1-8 7 1 3-5-2-1-6-2-2v-7l-2-2 5-5 2-6-1-2 6-5 8 2 2-3 5 2 8-2-3-5 6-3 7-8 13 2 7 2 3 3-2 7 4 5-1 5 4 16ZM45 53l-2 3-2-3 5-2-1 2Zm-24 1-1-4 3 1-1 8h-3l2-3-4-5 4 3Zm-6-6 1 2-4 2 3-4Zm20 9-2-1h3l-1 1Zm-11 1h2l-1 3h3l-2 2-6-1 3-6h3l-2 2Zm35-9v3l-3-3h3Zm-2 1-4 2 1-2h3Zm3-6 2 1-3 2 1-3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__okayama map_svg__chugoku map_svg__prefecture"
              code={33}
              transform="matrix(1.0288 0 0 1.0288 262.127 682.1)">
              <path d="m58 8 1 6-8 8 1 7-2 3 4 6-1 3-7-2 3 3-6 7-9-1 5 1-3 4-2-1-1 5-6-2-2 3-2-6v3l-4-4-4 4-5-3 2 4-4-2-4-16 1-5-4-5 2-7-3-3 1-3 7-1-1-4h7l-1-3 2-1 3-6 7 2 4 5 10-6-1 2 7 3 1 6z" />
            </Prefecture>
            <Prefecture
              className="map_svg__shimane map_svg__chugoku map_svg__prefecture"
              code={32}
              transform="matrix(1.0288 0 0 1.0288 175.707 617.284)">
              <path d="m74 14 4-1-3 4-3-2 1 4-2-3 3-2Zm5 2-2 3v-4l2-1 2 3-2-1Zm4-11 5-5 5 5-1 4h-3l2 2-5 1-3-7ZM2 100l8-2 15-14 10-6 6-8 11-5 3-6-2-4 17-4 6-5 3 3 8-1-3 2-2 1 6 8-1 9-8 2 2 3-4 6-13-2-7 8-6 3 3 5-8 2-5-2-2 3-8-2-6 5 1 2-2 6-5 5 2 2-4 2 1 4-3 4-2-2-6 2-2-4 2-5H2l-2-4 4-5-2-6Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__tottori map_svg__chugoku map_svg__prefecture"
              code={31}
              transform="matrix(1.0288 0 0 1.0288 254.925 666.667)">
              <path d="m7 33-7-2 4-6-2-3 8-2 1-9-6-8 2-1 2 4 6 2 8-4 11 2 21-1 9-5 7 17v4l-6 2-12 4-1-6-7-3 1-2-10 6-4-5-7-2-3 6-2 1 1 3h-7l1 4-7 1z" />
            </Prefecture>
            <Prefecture
              className="map_svg__wakayama map_svg__kinki map_svg__prefecture"
              code={30}
              transform="matrix(1.0288 0 0 1.0288 354.72 747.943)">
              <path d="m41 32 3 6 5 3-4 5 1 4-8 5-1 4h-2l1-3-17-5-5-7 3-3-8-4-5-7H0l3-5-3-1 6-3-5-3 4-2-1-2h4L0 6l2-3 3 3 26-6 4 9-4 1-6 7 5 7-2 6 13 2Zm8-9v3l-5 3v-3l5-3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__nara map_svg__kinki map_svg__prefecture"
              code={29}
              transform="matrix(1.0288 0 0 1.0288 380.44 722.223)">
              <path d="m24 48-5 3v3h-2v3h-1L3 55l2-6-5-7 6-7 4-1-4-9 2-5-2-9 5-11 6 5 4-3 4 3 2-2 2 4-3 1 2 1-1 4 9 5-8 6 3 5-2 1 2 3-2 4 1 7-1 3z" />
            </Prefecture>
            <Prefecture
              className="map_svg__hyogo map_svg__kinki map_svg__prefecture"
              code={28}
              transform="matrix(1.0288 0 0 1.0288 313.567 663.58)">
              <path d="m31 90-8 3v-5l-3 1v-3l18-19 1 2-7 10 3 9-4 2ZM3 59l1-3-4-6 2-3-1-7 8-8-1-6 6-2v-4L7 3l9-3 17 1-1 4 4 5 5-1 1 2v6h-6l-1 6 7 5 5-2 2 7 10 2-1 5-3 1 1 4 6 3-2 1 2 11-3 2-6-2-13 6-15-10-14 1v-4l-3 5-3-2-2 3Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__osaka map_svg__kinki map_svg__prefecture"
              code={27}
              transform="matrix(1.0288 0 0 1.0288 356.777 704.733)">
              <path d="m16 0 8 8 4-3-1 3 4 1 3 8-5 11 2 9-2 5-26 6-3-3 7-1 7-7 3-9 2 2-2-8 3-2-2-11 2-1-6-3-1-4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__kyoto map_svg__kinki map_svg__prefecture"
              code={26}
              transform="matrix(1.0288 0 0 1.0288 346.489 657.408)">
              <path d="m44 63-3-8-4-1 1-3-4 3-8-8 1-5-10-2-2-7-5 2-7-5 1-6h6v-6l-1-2-5 1-4-5 1-4 2 3-1-2 17-8 4 7-8 7 3 1 2-4v4l4 2-1 4 2-3 2 1-2-5 6-3 1 3-1 6 3 5 12 2 5 5-3 14 3 10h4l4 6 1 4-2 2-4-3-4 3z" />
            </Prefecture>
            <Prefecture
              className="map_svg__shiga map_svg__kinki map_svg__prefecture"
              code={25}
              transform="matrix(1.0288 0 0 1.0288 393.814 663.58)">
              <path d="m20 0 7 3 1 6h3l3 7 1 3-4 10 2 1 1 10-4 10-6 3-7-3-1 5-3 1-4-6H5L2 40l3-14-5-5 3-4 3 1 3-7 3 2 6-3V7l3 1-1-8Zm0 13v3l-2-3-4 3 2 8-8 8v4l-3 6 2 3 2-9 6-1 1-4 9-6 1-4-6-8Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__mie map_svg__kinki map_svg__prefecture"
              code={24}
              transform="matrix(1.0288 0 0 1.0288 396.9 692.387)">
              <path d="m8 95-5-3-3-6h1v-3h2l5-3v-3l5-1 1-3-1-7 2-4-2-3 2-1-3-5 8-6-9-5 1-4-2-1 3-1-2-4-1-4 3-1 1-5 7 3 6-3 4-10-1-10 6-2 7 7 5 8-6 1 1 4-7 12-1 8 16 7 2 5 3-1-1 4h-5l5 1v5l-4 1 2-2-3-2-1 2-6 1 3-4h-4l-3 5v-2l-3 3-2-2v3l-2-2-7 4-3 2 1 5-2-1 1-2-4 3 4 4h-2l2 3-3-2 1 3-7 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__aichi map_svg__chubu map_svg__prefecture"
              code={23}
              transform="matrix(1.0288 0 0 1.0288 441.14 682.1)">
              <path d="m42 46-24 6 2-5 3 2 8-6 2 3 2-3-1-3-6-3-2 4-8-1-4-3 2-8-4 11 4 5h-3l-4-4 1-5-2-3v-5l4-7-7 4-5-8 1-6 4-8 10-3 6 8 5 2 7-2 6 4 7-4 1 6 5-3 8 2-10 20-8 5z" />
            </Prefecture>
            <Prefecture
              className="map_svg__shizuoka map_svg__chubu map_svg__prefecture"
              code={22}
              transform="matrix(1.0288 0 0 1.0288 484.349 667.696)">
              <path d="M73 14h4v13l6 4-2 5 4 6v4l-7 9-1 6-7 4-6-6 3-14-2-4 1-3 6-1-10-6-7 2-4 5 2 3-9 4-2 9-6 7 2 4-13-4-25-1v-8l8-5 10-20 15-10V5l4-5 3 8-1 11 5 1 4 9 5-2-1-7 4-8 5 5z" />
            </Prefecture>
            <Prefecture
              className="map_svg__gifu map_svg__chubu map_svg__prefecture"
              code={21}
              transform="matrix(1.0288 0 0 1.0288 421.592 615.227)">
              <path d="m66 4 3 6-5 10 3 4-1 4-6 7h-5l-2 5 6 3 5 7-2 3 6 6-2 4 2 3h-3l2 4-2 3-7 4-6-4-7 2-5-2-6-8-10 3-4 8-1 6-7-7-6 2-2-1 4-10-1-3-3-7H1l-1-6 5-9 6 3 1-2 13-1 3-4-6-8 2-6 5-10-3-3 4-5 4 2 1 4 9-11 3 2 5-2v2l4-2z" />
            </Prefecture>
            <Prefecture
              className="map_svg__nagano map_svg__chubu map_svg__prefecture"
              code={20}
              transform="matrix(1.0288 0 0 1.0288 476.119 578.19)">
              <path d="m68 18-9 3 1 2-5 4-1 7 3 5h9l1 6-3 2 2 6-3 1 3 3v6l4 2 1 5-3 2-4-3-6 2-5-5-10 11 3 3-3 2 2 5-4 5v12l-15 10-8-2-5 3-1-6 2-3-2-4h3l-2-3 2-4-6-6 2-3-5-7-6-3 2-5h5l6-7 1-4-3-4 5-10-3-6 6-8-1-3 3-1 1-11 5-7V7l7 1v5l2 1 8-4 4 2V7l5-5 7-2 3 2v5l5 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__yamanashi map_svg__chubu map_svg__prefecture"
              code={19}
              transform="matrix(1.0288 0 0 1.0288 520.357 646.09)">
              <path d="m2 21-2-5 3-2-3-3L10 0l5 5 6-2 4 3 3-2 11 3 4 8 5 3-1 9-9 8-12 3-5-5-4 8 1 7-5 2-4-9-5-1 1-11z" />
            </Prefecture>
            <Prefecture
              className="map_svg__fukui map_svg__chubu map_svg__prefecture"
              code={18}
              transform="matrix(1.0288 0 0 1.0288 378.382 625.515)">
              <path d="m40 0 6 8 10 1 5 5 5-1-2 6 6 8-3 4-13 1-1 2-6-3-5 9-7-3 1 8-3-1v3l-6 3-3-2-3 7-3-1-3 4-12-2-3-5 1-6 2 4 7-3-4 3 7 1 2-3-2 1v-3l6 2-2-2 3-2-2-3 8 1-1-6 3-2 1 5 2 1 1-7-7-13 9-13V2z" />
            </Prefecture>
            <Prefecture
              className="map_svg__ishikawa map_svg__chubu map_svg__prefecture"
              code={17}
              transform="matrix(1.0288 0 0 1.0288 419.534 546.297)">
              <path d="m37 26-3-3h7l-4 3Zm-9 51 3 3-5 10-5 1-5-5-10-1-6-8 15-15 11-18 1-11-2-4v-5l-3-1 5-13L52 0l4 1 1 4-6 1-1 9-4-1-7 8-2-4-3 1-2 9 6 2 3-4v10l-8 2-2 10-3 2 2 4-2 3 1 4-2 8 1 8Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__toyama map_svg__chubu map_svg__prefecture"
              code={16}
              transform="matrix(1.0288 0 0 1.0288 447.312 581.276)">
              <path d="m41 37-10-4-4 2v-2l-5 2-3-2-9 11-1-4-4-2-4 5-1-8 2-8-1-4 2-3-2-4 3-2L6 4l8-2-3 6 12 7 8-4 2-8 10-3 4 3 3 11-1 11-3 1 1 3z" />
            </Prefecture>
            <Prefecture
              className="map_svg__niigata map_svg__chubu map_svg__prefecture"
              code={15}
              transform="matrix(1.0288 0 0 1.0288 491.55 479.424)">
              <path d="m7 113-3-11-4-3 14-5 9-7h7l15-12 10-15 5-14 19-12 1 2-1-1 6-7 9-28 8 3v7l9 6-2 4-8 3v8l-3 8 3 5 3 2-9 10 2 9h-8l-1 3-9 1-1 3 2 4-4 6 5 5-1 14-7-7-2 4-4 1 1 5-3 1v3l-12 6v-7l-5-4v-5l-3-2-7 2-5 5v5l-4-2-8 4-2-1v-5l-7-1v3l-5 7Zm29-67-8 1 7-9-2-3-3 2v-6l4-8 9-9-4 16 7 1-3 9-7 6Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__kanagawa map_svg__kanto map_svg__prefecture"
              code={14}
              transform="matrix(1.0288 0 0 1.0288 559.452 664.61)">
              <path d="m10 0 14 6 4 5V6h2l-3-2 3-2 14 7-4 4-4-1 3 4h-3v7l6 3-4 4 1 3h-4l1-5-3-4-7-2-11 3-4 3 1 6h-2l-6-4V17H0l9-8z" />
            </Prefecture>
            <Prefecture
              className="map_svg__tokyo map_svg__kanto map_svg__prefecture"
              code={13}
              transform="matrix(1.0288 0 0 1.0288 560.48 650.206)">
              <path d="M49 173v5l-5-7 5 2Zm-15-60-2 2-3-1 2-3 3 2Zm-23-9 2 2-2 1v-3Zm7-6-2-2 2-4v6Zm4-23v-6l4 1v6l-4-1ZM48 7l1 5-2 4-6-1 2 4-4 1h4v3l-14-7-3 2 3 2h-2v5l-4-5-14-6-5-3-4-8 3-3 15 4 5 4 7-3v4l6-3 4 1 2-2 6 2Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__chiba map_svg__kanto map_svg__prefecture"
              code={12}
              transform="matrix(1.0288 0 0 1.0288 603.69 636.832)">
              <path d="m5 29 2-4-1-5v-7L0 0l8 10 11 5 18-4V8l18 12v4H45L34 35l-2 22-13 4L7 75l-7-4 5-2-2-3 1-3-1-5 2-5-4-4 3-4 3 1v-4l6-3 5-6-7-7-5 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__saitama map_svg__kanto map_svg__prefecture"
              code={11}
              transform="matrix(1.0288 0 0 1.0288 548.135 625.515)">
              <path d="m48 4 1 1 2 7 3-1 6 13v7l-6-2-2 2-4-1-6 3v-4l-7 3-5-4-15-4-3 3-11-3-1-5 16-9 5-10 11 2 6 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__gunma map_svg__kanto map_svg__prefecture"
              code={10}
              transform="matrix(1.0288 0 0 1.0288 531.674 576.132)">
              <path d="m64 52-10 2-6-4-11-2-5 10-16 9-4-2v-6l-3-3 3-1-2-6 3-2-1-6H3l-3-5 1-7 5-4-1-2 9-3 12-6v-3l3-1-1-5 4-1 2-4 7 7 8 2-2 3 3 2-3 3-1 9 8 3-6 13 5 7 9-1z" />
            </Prefecture>
            <Prefecture
              className="map_svg__tochigi map_svg__kanto map_svg__prefecture"
              code={9}
              transform="matrix(1.0288 0 0 1.0288 579 568.93)">
              <path d="m19 60-1-1-2-4-9 1-5-7 6-13-8-3 1-9 3-3-3-2 2-3L28 0l12 3 6 4 1 6v11l1 3-3 2 2 10-3 7-11 2-3 5h-3l-1 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__ibaraki map_svg__kanto map_svg__prefecture"
              code={8}
              transform="matrix(1.0288 0 0 1.0288 598.547 581.276)">
              <path d="m5 54-3 1-2-7 7-3 1-4h3l3-5 11-2 3-7-2-10 3-2-1-3V1l10 9 6-6V0l10 5-8 24 1 6-3 7 2 10 5 9-2 2 2 3 1-4 8 12-18-12v3l-18 4-11-5z" />
            </Prefecture>
            <Prefecture
              className="map_svg__fukushima map_svg__tohoku map_svg__prefecture"
              code={7}
              transform="matrix(1.0288 0 0 1.0288 569.74 515.432)">
              <path d="m82 69-10-5v4l-6 6-10-9-1-6-6-4-12-3-25 16-8-2 1-14-5-5 4-6-2-4 1-3 9-1 1-3h8l-2-9 9-10-3-2 7 2 6-1 2 4 4-1 3 2 6-1 3-4-2-1 1-9h6l4 4h9l1 6 5 2-1-2h4V4h4l6 14v27l-2 16z" />
            </Prefecture>
            <Prefecture
              className="map_svg__yamagata map_svg__tohoku map_svg__prefecture"
              code={6}
              transform="matrix(1.0288 0 0 1.0288 588.258 441.358)">
              <path d="m14 1 10-1 4 5 14 3 2 5 4 1 5 8-2 8h-3l4 11-7 12 1 6-3 6-7 2 1 5-1 9 2 1-3 4-6 1-3-2-4 1-2-4-6 1-7-2-3-5 3-8v-8l8-3 2-4-9-6v-7l-8-3 13-23z" />
            </Prefecture>
            <Prefecture
              className="map_svg__akita map_svg__tohoku map_svg__prefecture"
              code={5}
              transform="matrix(1.0288 0 0 1.0288 593.403 351.852)">
              <path d="m54 97-7 5-4-1-4-1-2-5-14-3-4-5-10 1 2-10 5-9 1-22-6-8-8 3-3-9 6 3 6-8 3-9v-8l-5-5 4 1 3-4 12 2 3-3 7 5 3-2 3 2 10-7v5h5l-1 11-4 5 2 18-5 1 3 4-3 4 2 5-4 6-3 11 8 13-3 3 3 5z" />
            </Prefecture>
            <Prefecture
              className="map_svg__miyagi map_svg__tohoku map_svg__prefecture"
              code={4}
              transform="matrix(1.0288 0 0 1.0288 625.296 447.531)">
              <path d="M33 70h-4v6h-4l1 2-5-2-1-6h-9l-4-4H1l-1-5 7-2 3-6-1-6 7-12-4-11h3l2-8-5-8 4 1 7-5 10 5 8-1-2 4 6 4 4-5 6 3 2-14 7 1 3 7-5-3 1 5-4 4 3 5-2-2-4 3 4 2-3 6h4v4l-3-2 2 4-3 1 1 3 3-1-2 2 2 2v4l-4-2 1-3-3 1 2-2-1-2-17 3-3 3 4 2-5 1 3 1-6 10 1 13Zm10-29 1 2h-2l1-2Z" />
            </Prefecture>
            <Prefecture
              className="map_svg__iwate map_svg__tohoku map_svg__prefecture"
              code={3}
              transform="matrix(1.0288 0 0 1.0288 641.756 353.91)">
              <path d="m48 92-7-1-2 14-6-3-4 5-6-4 2-4-8 1-10-5 1-6-3-5 3-3-8-13 3-11 4-6-2-5 3-4-3-4 5-1-2-18 4-5 4 1L29 5l2 3 4-3 5 2 6-7 8 11-2 5 5 3-2 4 6 5 3 15-2 10 3-4 1 5 2 1-6 5 2 2 3-3v4h-4v5l-3 1 5-1-5 3 2 2-2 2 4-1-6 7 4 2h-5l3 3h-3l2 2-6 1-1-3 2 5h-2v3l-2-4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__aomori map_svg__tohoku map_svg__prefecture"
              code={2}
              transform="matrix(1.0288 0 0 1.0288 600.604 284.98)">
              <path d="M3 71v-8l-3-3 6-9h6l6-4 3-16-4-4 3-1 1-7 6 4 4-3 4 3 2 15 3 7 6-4-1-4 2-4 11 9 3-3 4-16-4-7-6 6-14 3 6-25 17 11 9-5-2 31 2 14 4 11 4-1 5 6-6 7-5-2-4 3-2-3-13 10-4-1 1-11h-5v-5l-10 7-3-2-3 2-7-5-3 3-12-2-3 4z" />
            </Prefecture>
            <Prefecture
              className="map_svg__hokkaido map_svg__prefecture"
              code={1}
              transform="matrix(1.0288 0 0 1.0288 577.97 0)">
              <path d="m4 240-1 5-3 1v-9l6-2-2 5Zm29 21-1-11-4-7-5-1-2-5-4-1-2-5 4-8-2-11 2-3 9-2 6-9 3 4 2-1 4-9 6-5-10-14 1-7 7-2 13 10 11-3v3l7 3 5-3 6-9-6-25 3-5 7-3 4-6-1-23 4-8 1-10-3-18-8-19 3-9-1-6 2 3 5-1 6-7 26 27 8 13 16 17 29 19 29 5 1 4 5 5h19l22-27 2 5-10 23v10l3 6 10 3-2 2 1-3h-6l5 12 6 7 4 1 7-8 7-1-10 8-2 7-17 3-2 6-4 5h-5l-2-2 1-2-3-1-3 6 3 2-15 1-8-3-15 8-14 16-9 14-3 9 1 15-2 8-14-11-23-9-28-17-13-2 3-3-15 8-16 16-3-3h4l-5-1-2-6-8-8-11 1-5 7-3 10 1 4 12 8h10l9 12 9 3 2 3-6 5-4 2-9-4-3 2v-4l-3-1-2 5-7 4v9l-8 4-3 5-7-3-3-6 1-9 5-8ZM71 48l2-3 4 2 2 5-4 3-4-3v-4Zm-6-13v-2l2 2-1 10-3-10h2Zm304-18-2-4h-2l-2 4 2 6-1 3-5 2-2 7-7-1 1 7-10 9v4h-6v2l4 2v4l-3 3-4-1v5l-3-3 1 5-3 7 4 1 5-9 5-1 5-10 10-9 2-10 5 3 6-2 15-17 13-9 9-2 1-3-3-4 3-4-5-2-6 2-12 18-11 2-4-5Zm-79 82 5-6 8-2 5-7 3 1 3-6-10 3-8-5-3 2-4 10-9 15v3l-14 15 2 7 5-1v4l1-13 8-5 1-5h3l1-7 3-3Zm32 26 12-10-5-2-4 3 1 1-7 2v4l2-1 1 3Zm-22 17 4-5-7 2 3 3Zm-9 4 2-3-4 1 2 2Z" />
            </Prefecture>
          </g>
          <g className="map_svg__boundary-line" stroke="#EEE" strokeWidth={12}>
            <path
              d="m320.227 361.996 262.124-252.618M277.337 380.162H46.213"
              transform="matrix(1.0288 0 0 1.0288 -47.544 -28.807)"
            />
          </g>
        </g>
      </svg>
    </ClickPrefectureContext.Provider>
  )
}

export default JapanMap
