import React from 'react'
import { useState, useEffect } from 'react'
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'
import Link from 'next/link'

export default function TeaMapComponent({
  dataFromPage = [],
  dataType = '',
  storeName = '',
  positionFromPage = {},
}) {
  const apiKey = process.env.NEXT_PUBLIC_VITE_GOOGLE_MAP_API_KEY
  const [poi, setPoi] = useState([])
  const [data, setData] = useState([])
  const [type, setType] = useState('')
  const [chooseStore, setChooseStore] = useState('')
  // 預設位置為null，待設定好才會渲染地圖
  const [position, setPosition] = useState({ lat: null, lng: null })
  const [activeMark, setActiveMark] = useState('')
  // 接收從page來的資料
  async function getPoiData(data) {
    let poiArray = []
    data.map((v, i) => {
      // console.log(v)
      // key 是當作每個圖釘的識別ID，location是經緯度，對應google map api 所需要的資料
      let Poi = {
        key: `${v.name}`,
        location: { lat: v.latitude, lng: v.longitude },
        name: v.name,
        address: v.address,
        website: v.website,
        google_url: v.google_url,
        images: v.images,
      }
      poiArray.push(Poi)
    })
    // console.log(poiArray)
    setPoi(poiArray)
  }
  useEffect(() => {
    setPosition(positionFromPage)
  }, [positionFromPage])
  useEffect(() => {
    setChooseStore(storeName)
  }, [storeName])
  useEffect(() => {
    setActiveMark(chooseStore)
  }, [chooseStore])
  // 監聽type是teaHouse還是teaFactory
  useEffect(() => {
    setType(dataType)
  }, [dataType])
  // 監聽從page來的資料，並設定到data狀態
  useEffect(() => {
    setData(dataFromPage)
  }, [dataFromPage])
  // 監聽data 如果有變，則重新設定poi的資料(用來做圖釘和infoWindow)
  useEffect(() => {
    getPoiData(data)
  }, [data])
  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log('Maps API has loaded.')}
    >
      {position.lat && (
        <Map
          defaultZoom={12}
          defaultCenter={position}
          mapId="aef5b35a6884a3be"
          gestureHandling="greedy"
          disableDefaultUI="true" //移除地圖上的所有控制項
          // onCameraChanged={(ev) =>
          //   console.log(
          //     'camera changed:',
          //     ev.detail.center,
          //     'zoom:',
          //     ev.detail.zoom
          //   )
          // }
        >
          {/* 顯示地圖中心點的圖釘 */}
          <UserMaker position={position} />
          {/* 顯示所有店家的圖釘 */}
          {poi.map((item) => {
            return (
              <SingleMarker
                key={item.key}
                item={item}
                dataType={type}
                isActive={activeMark === item.key} // 當所點選的店家名稱等於key時，設為ture(代表要開啟該店家的infoWindow)
                onMarkClick={() => setActiveMark(item.key)} // 當點擊此圖釘時，將目前的activeMark設為目前的key
                onClose={() => setActiveMark(null)} // 當視窗關閉時，將前一個的activeMark設成null，此時isActive就會等於false，等於關閉該infoWindow
              />
            )
          })}
        </Map>
      )}
    </APIProvider>
  )
}

// 製作每個圖釘的內容，以及點擊後的效果
const SingleMarker = ({
  item = {},
  dataType = '',
  isActive = false,
  onMarkClick = () => {},
  onClose = () => {},
}) => {
  // 自訂圖釘樣式
  let pinGraph = document.createElement('div')
  pinGraph.innerHTML =
    dataType === 'teaFactory'
      ? '<i class="fa-solid fa-warehouse"></i>'
      : '<i class="fa-solid fa-shop"></i>'

  // 官方的一個Ref，這裡的mark用在infoWindow的anchor(錨點)，而mark的值是從markRef，也就是圖釘的位置
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <AdvancedMarker
      key={item.key}
      position={item.location}
      clickable={true}
      ref={markerRef}
      onClick={onMarkClick} // 當點擊該圖釘時，觸發onMarkClick函式，將activeMark設定為目前的key，此時isActive會變為true，相當於開啟你要的店家的infoWindow
    >
      <Pin
        glyph={pinGraph.childNodes[0]}
        background={'#003E52'}
        glyphColor={'#B29564'}
        borderColor={'#B29564'}
        scale={1.2}
      />
      {/* isActive = {activeMark === item.key} 當目前所選的圖釘的名稱等於item.key才會開啟該infoWindow */}
      {isActive && (
        <InfoWindow
          anchor={marker}
          onClose={onClose}
          shouldFocus={true}
          disableAutoPan={false}
          headerContent={<h5 className="fw-bold mb-0">{item.name}</h5>}
        >
          <div className="infoWindowImg">
            <img
              src={`/images/teamap/${
                dataType === 'teaHouse'
                  ? 'tea_house_images'
                  : 'tea_factory_images'
              }/${item.images || 'default-placeholder.png'}`}
              alt={`${item.images || 'default-placeholder.png'}`}
            />
          </div>
          <div className="infoWindowText">
            <p>
              <i class="fa-solid fa-location-dot goldenf"></i> 地址:
              {item.address}
            </p>
            <p>
              <i class="fa-solid fa-store goldenf"></i> 店家網址:{' '}
              {item.website !== '(無提供)' ? (
                <Link href={`${item.website}`}>{item.website}</Link>
              ) : (
                `${item.website}`
              )}
            </p>
            <Link href={`${item.google_url}`}>在google map上開啟</Link>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}

// 製作地圖中心點標示
const UserMaker = ({ position = {} }) => {
  let pinGraph = document.createElement('div')
  pinGraph.innerHTML = '<i class="fa-solid fa-user-large"></i>'
  return (
    <AdvancedMarker
      key={'您的參考位置'}
      position={position}
      clickable={false}
      zIndex={999}
    >
      <Pin
        glyph={pinGraph.childNodes[0]}
        background={'#0051ff'}
        glyphColor={'#FFF'}
        borderColor={'#B29564'}
        scale={1.2}
      />
    </AdvancedMarker>
  )
}
