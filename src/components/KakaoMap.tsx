import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

type props = {
  targetCoords?: number[]
  setCoords?: (coords: number[]) => void
}

export default function KakaoMap({ targetCoords, setCoords }: props = {}) {
  const mapRef = useRef(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchToggle, setSearchToggle] = useState(false)

  const [showTooltip, setShowTooltip] = useState(true)

  // 클릭 시 안내 메시지를 숨깁니다.
  const handleClick = () => {
    setShowTooltip(false)
  }

  useEffect(() => {
    const { kakao } = window
    kakao?.maps.load(function () {
      // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
      if (targetCoords) {
        var initialLatLng = new kakao.maps.LatLng(
          targetCoords[0],
          targetCoords[1]
        )

        var container = mapRef.current //지도를 담을 영역의 DOM 레퍼런스
        var options = {
          //지도를 생성할 때 필요한 기본 옵션
          center: initialLatLng, //지도의 중심좌표.
          level: 3, //지도의 레벨(확대, 축소 정도)
        }

        var map = new kakao.maps.Map(container, options) //지도 생성 및 객체 리턴

        var marker = new kakao.maps.Marker({
          // 지도 중심좌표에 마커를 생성합니다
          position: map.getCenter(),
        })
        marker.setMap(map)

        var geocoder = new kakao.maps.services.Geocoder()
        var infowindow = new kakao.maps.InfoWindow({ zindex: 1 }) // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

        searchDetailAddrFromCoords(initialLatLng, setDetailAddressFromCoords)
        return
      }

      var initialLatLng = new kakao.maps.LatLng(33.450701, 126.570667)

      var container = mapRef.current //지도를 담을 영역의 DOM 레퍼런스
      var options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: initialLatLng, //지도의 중심좌표.
        level: 3, //지도의 레벨(확대, 축소 정도)
      }

      var map = new kakao.maps.Map(container, options) //지도 생성 및 객체 리턴

      var marker = new kakao.maps.Marker({
        // 지도 중심좌표에 마커를 생성합니다
        position: map.getCenter(),
      })
      marker.setMap(map)

      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder()
      var infowindow = new kakao.maps.InfoWindow({ zindex: 1 }) // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

      searchDetailAddrFromCoords(
        new kakao.maps.LatLng(33.450701, 126.570667),
        setDetailAddressFromCoords
      )

      // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
        searchDetailAddrFromCoords(
          mouseEvent.latLng,
          setDetailAddressFromCoords
        )
      })

      function setDetailAddressFromCoords(result: any[], status: any) {
        if (status === kakao.maps.services.Status.OK) {
          var detailAddr = result[0].road_address
            ? '<div>도로명주소 : ' +
              result[0].road_address.address_name +
              '</div>'
            : ''
          detailAddr +=
            '<div>지번 주소 : ' + result[0].address.address_name + '</div>'

          var content =
            '<div class="bAddr p-1 text-ellipsis overflow-hidden text-nowrap">' +
            '<span class="title block font-bold">법정동 주소정보</span>' +
            detailAddr +
            '</div>'

          // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
          infowindow.setContent(content)
          infowindow.open(map, marker)
        }
      }

      function searchDetailAddrFromCoords(coords: any, callback: any) {
        // 좌표로 법정동 상세 주소 정보를 요청합니다
        if (setCoords) {
          setCoords([coords.getLat(), coords.getLng()])
        }

        // 마커를 클릭한 위치에 표시합니다
        marker.setPosition(coords)
        marker.setMap(map)
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback)
      }

      if (!searchRef.current?.value) return
      // 장소 검색 객체를 생성합니다
      var ps = new kakao.maps.services.Places()

      searchPlaces()

      // 키워드 검색을 요청하는 함수입니다
      function searchPlaces() {
        if (!searchRef.current) return
        var keyword = searchRef.current.value

        if (!keyword.replace(/^\s+|\s+$/g, '')) {
          alert('키워드를 입력해주세요!')
          return false
        }

        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        ps.keywordSearch(keyword, placesSearchCB)
      }

      // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
      function placesSearchCB(data: any[], status: any) {
        if (status === kakao.maps.services.Status.OK) {
          // 정상적으로 검색이 완료됐으면
          // 검색 목록과 마커를 표출합니다
          displayPlaces(data)
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.')
          return
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.')
          return
        }
      }

      function displayPlaces(places: any[]) {
        var bounds = new kakao.maps.LatLngBounds()

        for (var i = 0; i < places.length; i++) {
          // 마커를 생성하고 지도에 표시합니다
          var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x)
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          bounds.extend(placePosition)
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds)
      }
    })
  }, [searchToggle, targetCoords])

  const handleSearch = () => {
    setSearchToggle(!searchToggle)
  }

  return (
    <div className='flex flex-col gap-3'>
      {!targetCoords && (
        <div className='flex gap-2'>
          <input
            ref={searchRef}
            type='text'
            placeholder='지역/장소 검색'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
            className='px-3 py-2 border'
          />
          <button onClick={handleSearch} className='w-[50px] border'>
            검색
          </button>
        </div>
      )}
      <div
        id='map'
        className='w-full h-[400px]'
        ref={mapRef}
        onClick={handleClick}
      >
        {!targetCoords && showTooltip && (
          <div
            className='absolute bg-blue-600 text-white px-4 py-2 top-3 rounded-md shadow-md 
            animate-bounce cursor-pointer z-20'
          >
            📍 지도를 클릭해 위치를 선택하세요!
          </div>
        )}
      </div>
    </div>
  )
}
