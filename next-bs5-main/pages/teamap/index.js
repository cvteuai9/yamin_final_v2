import React from 'react'
import { useState, useEffect, useRef } from 'react'
import TeaMapComponent from '@/components/teamap/teamap'

export default function TeaMapPage() {
  const [type, setType] = useState('teaHouse')
  const [data, setData] = useState([])
  const typeRadioHouseRef = useRef(null)
  const typeRadioFactoryRef = useRef(null)
  const [getToday, setGetToday] = useState(0)
  const [today, setToday] = useState('')
  // 設定中心點位置
  const [position, setPosition] = useState({ lat: null, lng: null })
  // 設定選擇店家列表的某一店家，用來傳到TeaMapComponent當作開啟infoWindow的依據
  const [chooseStore, setChooseStore] = useState('')
  // 設定預設排序
  const [order, setOrder] = useState('starDESC')
  // 設定預設營業狀態篩選
  // const [businessStatus, setBusinessStatus] = useState('all')
  // 設定預設星等篩選
  const [starRating, setStarRating] = useState('all')
  // 設定預設搜尋範圍
  const [searchRange, setSearchRange] = useState('10k')
  // 處理使用者點擊商店列表後，要開啟地圖上對應的infoWindow函式
  function handleToggleInfoWindow(name) {
    setChooseStore(name)
  }
  // 處理茶館/茶廠type設定值的函式
  function handleTypeToggle(e) {
    setType(e.target.value)
  }
  // 取得商店列表與決定地圖上標記的資料
  // !! 營業時間判斷還沒寫出來QQ
  async function getMapData(
    type = '',
    order = '',
    starRating = '',
    searchRange = '',
    position = {}
  ) {
    const apiUrl = new URL(`http://localhost:3005/api/teamap?type=${type}`)
    const searchParams = new URLSearchParams({
      type: type,
      order: order,
      starRating: starRating,
      searchRange: searchRange,
      lat: position.lat,
      lng: position.lng,
    })
    apiUrl.search = searchParams
    // console.log(apiUrl.href)
    const mapDataRes = await fetch(apiUrl)
    const mapData = await mapDataRes.json()
    // console.log(mapData)
    setData(mapData)
  }
  // 取得使用者的初始位置
  function getUserPosition() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        // 如果使用者允許位置權限，則會執行並得到一組position，反之，執行error那一段callback
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setPosition(userPosition)
            return resolve(userPosition)
          },
          (error) => {
            // 這裡設計當用戶拒絕給位置存取權限時，初始點位置將會是台灣中心點
            // console.error('Error fetching user location:', error)
            setPosition({ lat: 25.03746, lng: 121.564558 })
            resolve({ lat: 25.03746, lng: 121.564558 })
          }
        )
      }
    })
  }
  useEffect(() => {
    getUserPosition()
  }, [])
  useEffect(() => {
    let tmp = new Date().getDay()
    setGetToday(tmp)
  }, [])
  // 設定今天為禮拜幾
  useEffect(() => {
    switch (getToday) {
      case 0:
        setToday('日')
        break
      case 1:
        setToday('一')
        break
      case 2:
        setToday('二')
        break
      case 3:
        setToday('三')
        break
      case 4:
        setToday('四')
        break
      case 5:
        setToday('五')
        break
      case 6:
        setToday('六')
        break
    }
  }, [getToday])
  // 切換type
  useEffect(() => {
    const typeRadioHouse = typeRadioHouseRef.current
    const typeRadioFactory = typeRadioFactoryRef.current
    // console.log(typeRadioFactory, typeRadioHouse)
    if (type === 'teaHouse') {
      typeRadioHouse.classList.add('active')
      typeRadioFactory.classList.remove('active')
    } else {
      typeRadioFactory.classList.add('active')
      typeRadioHouse.classList.remove('active')
    }
  }, [type])
  useEffect(() => {
    // 根據 type, order, starRating, searchRange變化重新抓取資料
    getMapData(type, order, starRating, searchRange, position)
  }, [type, order, starRating, searchRange, position])
  return (
    <>
      <div className="teaMap">
        {/* title */}
        <div className="teaMapTitle d-flex justify-content-center align-items-center mb-5">
          <div className="text-center">
            <img src="/images/teamap/decoration-top.svg" alt="" />
            <div>
              <div className="d-flex gap-3">
                <img src="/images/teamap/dash.svg" alt="" />
                <h1 className="m-0">茶館/茶廠地圖</h1>
                <img src="/images/teamap/dash.svg" alt="" />
              </div>
              <h5 className="m-0">TeaMap</h5>
            </div>
            <img src="/images/teamap/decoration-bottom.svg" alt="" />
          </div>
        </div>
        <div className="d-flex gap-3">
          <div>
            {/* 茶館/茶廠切換radio */}
            <div className="d-flex typeRadio gap-3 mb-3">
              <input
                className="d-none"
                type="radio"
                id="houseRadio"
                name="type"
                value="teaHouse"
                onChange={(e) => {
                  handleTypeToggle(e)
                }}
                defaultChecked={true}
              />
              <label
                htmlFor="houseRadio"
                className="typeRadioLabel active"
                ref={typeRadioHouseRef}
              >
                <div className="houseRadioBackgroundDiv"></div>
                <p>茶館</p>
              </label>
              <input
                className="d-none"
                type="radio"
                id="factoryRadio"
                name="type"
                value="teaFactory"
                onChange={(e) => {
                  handleTypeToggle(e)
                }}
              />
              <label
                htmlFor="factoryRadio"
                className="typeRadioLabel"
                ref={typeRadioFactoryRef}
              >
                <div className="factoryRadioBackgroundDiv"></div>
                <p>茶廠</p>
              </label>
            </div>
            <div className="filterGroup d-flex gap-3 mb-3">
              {/* 營業狀態 */}
              {/* <select
                name="businessStatus"
                id="businessStatus"
                defaultValue={'all'}
                onChange={(e) => {
                  setBusinessStatus(e.target.value)
                }}
              >
                <option value="all">全部</option>
                <option value="opening">營業中</option>
                <option value="close">休息中</option>
              </select> */}
              {/* 星等 */}
              <select
                name="starRating"
                id="starRating"
                defaultValue={'all'}
                onChange={(e) => {
                  setStarRating(e.target.value)
                }}
              >
                <option value="all">全部</option>
                <option value="5">五顆星</option>
                <option value="4">四顆星</option>
                <option value="3">三顆星</option>
                <option value="2">二顆星</option>
                <option value="1">一顆星</option>
              </select>
              {/* 排序依據: 星等、評論數 */}
              <select
                name="order"
                id="order"
                defaultValue={'starDESC'}
                onChange={(e) => {
                  setOrder(e.target.value)
                }}
              >
                <option value="starDESC">星等由高到低</option>
                <option value="starASC">星等由低到高</option>
                <option value="ratingCountDESC">評論數由高到低</option>
                <option value="ratingCountASC">評論數由低到高</option>
                <option value="distanceDESC">距離由遠到近</option>
                <option value="distanceASC">距離由近到遠</option>
              </select>
            </div>
            {/* 店家列表 left-aside */}
            <div className="cardArea p-2 justify-content-center">
              {data.length > 0 ? (
                data.map((v) => {
                  const starFillNum = isNaN(Number(v.rating))
                    ? 0
                    : Math.max(0, Math.min(5, Math.floor(Number(v.rating))))
                  const starFillArray = new Array(starFillNum).fill(0)
                  const starUnFillArray = new Array(5 - starFillNum).fill(0)
                  return (
                    <div
                      className="storeCard d-flex py-2 mb-1 flex-wrap"
                      key={v.id}
                    >
                      <button
                        type="button"
                        className="img btn"
                        onClick={() => handleToggleInfoWindow(v.name)}
                      >
                        <img
                          className="img-fluid object-fit-cover"
                          src={`/images/teamap/${
                            type === 'teaHouse'
                              ? 'tea_house_images'
                              : 'tea_factory_images'
                          }/${v.images || 'default-placeholder.png'}`}
                          alt={`${v.images || 'default-placeholder.png'}`}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src =
                              '/images/teamap/default-placeholder.png'
                          }}
                        />
                      </button>
                      <div className="cardInfo ps-2">
                        <h5 className="fw-bold fs-3">{v.name}</h5>
                        <div className="starArea fs-3">
                          {starFillArray.map((v, i) => {
                            return (
                              <i
                                className="fa-solid fa-star starLight"
                                key={`factory-${i}`}
                              />
                            )
                          })}
                          {starUnFillArray.map((v, i) => {
                            return (
                              <i
                                className="fa-regular fa-star"
                                key={`house-${i}`}
                              />
                            )
                          })}
                          <p className="ms-2 d-inline">
                            ({v.user_ratings_total})
                          </p>
                        </div>
                        <p>
                          <i className="fa-solid fa-location-dot" /> 地址:
                          {v.address}
                        </p>
                      </div>
                      <div className="me-1 align-items-center fs-3">
                        營業時間:
                      </div>
                      <div>
                        {v.opening_hours !== '(無提供)' ? (
                          <select defaultValue={today}>
                            {v.opening_hours.map((item, i) => {
                              return (
                                <option
                                  value={item.slice(0, 1)}
                                  key={`星期${i}`}
                                >
                                  {item}
                                </option>
                              )
                            })}
                          </select>
                        ) : (
                          <select defaultValue={'(無提供)'}>
                            <option value="(無提供)">{v.opening_hours}</option>
                          </select>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="googleMap">
            <div className="searchRangeOption mb-3">
              <select
                name="searchRange"
                id="searchRange"
                defaultValue={'10k'}
                onChange={(e) => {
                  setSearchRange(e.target.value)
                }}
              >
                <option value="1k">一公里</option>
                <option value="5k">五公里</option>
                <option value="10k">十公里</option>
              </select>
            </div>
            <div className="googleMapArea">
              <TeaMapComponent
                dataFromPage={data}
                dataType={`${type}`}
                storeName={`${chooseStore}`}
                positionFromPage={position}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
