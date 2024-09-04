import { useState, useEffect } from 'react'
// 從 React 中引入 useState 和 useEffect 兩個 hook，用來管理組件的狀態和副作用。

import locationData from '@/data/course-data/location.json'
// 引入本地的地點數據，這個 JSON 文件包含了所有可選擇的地點。

import categories from '@/data/course-data/category.json'
// 引入本地的課程分類數據，這個 JSON 文件包含了所有可選擇的課程分類。
import Link from 'next/link'
import { useRouter } from 'next/router'
import { YaminCourseCartProvider } from '@/hooks/yamin-use-Course-cart'
import toast, { Toaster } from 'react-hot-toast'
import { YaminCourseUseCart } from '@/hooks/yamin-use-Course-cart'
import { useAuth } from '@/hooks/my-use-auth'
import Swal from 'sweetalert2'
export default function Course() {
  // 購物車部分
  const { addItem = () => {} } = YaminCourseUseCart()
  const router = useRouter()
  const notify = (CourseName) => {
    toast.success(
      <>
        <p>
          {CourseName + '已成功加入購物車!'}
          <br />
          <Link href="/cart/cartOne">前往購物車</Link>
        </p>
      </>
    )
  }

  // !!取得使用者資訊
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)

  // 購物車部分結束
  // 定義並導出一個名為 Course 的 React 函數組件。

  const [courses, setCourses] = useState([])
  // 用 useState 定義一個名為 courses 的狀態變量，初始值為空陣列，用來存儲課程數據。

  const [priceFilter, setPriceFilter] = useState(null)
  // 定義一個名為 priceFilter 的狀態變量，初始值為 null，用來存儲價格排序的選擇。

  const [currentPage, setCurrentPage] = useState(1)
  // 定義一個名為 currentPage 的狀態變量，初始值為 1，用來存儲當前的頁碼。

  const [totalPages, setTotalPages] = useState(1)
  // 定義一個名為 totalPages 的狀態變量，初始值為 1，用來存儲總頁數。

  const [categoryId, setCategoryId] = useState(null)
  // 定義一個名為 categoryId 的狀態變量，初始值為 null，用來存儲選擇的課程分類 ID。

  const [locationId, setLocationId] = useState(null)
  // 定義一個名為 locationId 的狀態變量，初始值為 null，用來存儲選擇的地點 ID。

  const [locations, setLocations] = useState([])
  // 定義一個名為 locations 的狀態變量，初始值為空陣列，用來存儲所有地點數據。

  const [totalCourses, setTotalCourses] = useState(0)
  // 定義一個名為 totalCourses 的狀態變量，初始值為 0，用來存儲課程總筆數。

  // 這段代碼主要要做什麼
  // 以下函數用來請求課程數據，並根據篩選條件更新狀態。

  const getCourses = async (
    sort2 = null,
    // order 參數用來指定價格排序，默認值為 null。

    page = 1,
    // page 參數用來指定當前頁碼，默認值為 1。

    categoryId = null,
    // categoryId 參數用來指定課程分類 ID，默認值為 null。

    location = null,
    // location 參數用來指定地點 ID，默認值為 null。
    userID,
    isAuth
  ) => {
    const baseURL = new URL('http://localhost:3005/api/course')
    // 創建一個 URL 對象，用來構建請求課程數據的 API 地址。

    if (sort2) {
      // 如果有價格排序的選擇，就將它作為查詢參數添加到 URL 中。
      baseURL.searchParams.append('sort2', sort2)
    }

    if (categoryId !== null) {
      // 如果有選擇課程分類 ID，就將它作為查詢參數添加到 URL 中。
      baseURL.searchParams.append('categoryId', Number(categoryId))
    }

    if (location !== null) {
      // 如果有選擇地點 ID，就將它作為查詢參數添加到 URL 中。
      baseURL.searchParams.append('locationId', location)
    }

    baseURL.searchParams.append('page', page)
    // 將當前頁碼作為查詢參數添加到 URL 中。

    baseURL.searchParams.append('limit', 6)
    // 將每頁顯示的課程數量限制為 6。

    const res = await fetch(baseURL)
    // 使用 fetch API 發送 GET 請求到構建好的 URL，等待伺服器回應。

    // 將伺服器回應的 JSON 數據轉換成 JavaScript 對象。
    const data = await res.json()

    // !! 收藏部分，後續要處理user_id部分
    // 先將每個課程加上 fav屬性，並設為false
    let tmp = data.courses.map((v) => {
      return { ...v, fav: false }
    })
    let favoritesData = []
    if (isAuth) {
      const favoritesURL = `http://localhost:3005/api/course/favorites?user_id=${userID}`
      const favoritesRes = await fetch(favoritesURL)
      favoritesData = await favoritesRes.json()
    }
    let courseList = tmp.map((v, i) => {
      if (favoritesData.includes(v.id)) {
        return { ...v, fav: true }
      } else {
        return v
      }
    })
    if (res.ok) {
      // 如果伺服器回應狀態為 OK，則更新課程數據、總頁數和總筆數的狀態。
      setCourses(courseList)
      setTotalPages(data.totalPages)
      setTotalCourses(data.totalCourses)
    } else {
      // 如果伺服器回應失敗，則在控制台中輸出錯誤訊息。
      console.error('Failed to fetch courses:', data.message)
    }
  }
  // !!處理收藏或取消收藏的函式
  async function handleFavToggle(courses, id, userID, isAuth) {
    try {
      if (isAuth) {
        let nextData = courses.map((v) => {
          if (v.id === id) {
            if (!v.fav) {
              fetch(
                `http://localhost:3005/api/course/favorites?user_id=${userID}&course_id=${v.id}`,
                { method: 'PUT' }
              )
                .then((res) => res.json())
                .then((result) => {
                  if (
                    result.message === 'Favorite Course Insert successfully'
                  ) {
                    toast.success(<p className="m-0">加入收藏成功!</p>)
                  } else {
                    toast.error(<p className="m-0">加入收藏失敗!</p>)
                  }
                })
                .catch((error) => console.log(error))
            } else {
              fetch(
                `http://localhost:3005/api/course/favorites?user_id=${userID}&course_id=${v.id}`,
                { method: 'DELETE' }
              )
                .then((res) => res.json())
                .then((result) => {
                  if (
                    result.message === 'Favorite Course deleted successfully'
                  ) {
                    toast.success(<p className="m-0">移除收藏成功!</p>)
                  } else {
                    toast.error(<p className="m-0">移除收藏失敗!</p>)
                  }
                })
                .catch((error) => console.log(error))
            }
            return { ...v, fav: !v.fav }
          } else {
            return v
          }
        })
        setCourses(nextData)
      } else {
        Swal.fire({
          title: '無法收藏',
          text: '您尚未登入，請登入後再操作!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '登入',
          cancelButtonText: '取消',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/member/login')
          }
        })
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }
  useEffect(() => {
    setLocations(locationData)
    // 使用 useEffect hook 在組件初次渲染時將本地的地點數據設定為 locations 狀態。
  }, [])

  // 這段代碼主要要做什麼
  // 每當篩選條件（價格排序、頁碼、課程分類或地點）發生變化時，重新請求課程數據。

  useEffect(() => {
    getCourses(priceFilter, currentPage, categoryId, locationId, userID, isAuth)
    // 根據當前的篩選條件請求課程數據。
  }, [priceFilter, currentPage, categoryId, locationId, userID, isAuth])
  // 只要 priceFilter、currentPage、categoryId 或 locationId 變化，這個 useEffect 就會觸發。

  const handlePriceFilter = (sort2) => {
    // 定義一個處理價格篩選的函數。

    setPriceFilter(sort2)
    // 更新 priceFilter 狀態為選擇的排序順序。

    setCurrentPage(1)
    // 當選擇新篩選條件時，將頁碼重置為 1。
  }

  const handleCategoryFilter = (id) => {
    // 定義一個處理課程分類篩選的函數。

    setCategoryId(id)
    // 更新 categoryId 狀態為選擇的課程分類 ID。

    setLocationId(null)
    // 重置 locationId 為 null，因為每次選擇分類時地點都應重新選擇。

    setPriceFilter(null)
    // 重置 priceFilter 為 null，因為每次選擇分類時價格排序都應重新選擇。

    setCurrentPage(1)
    // 將頁碼重置為 1。
  }

  const handlePageChange = (page) => {
    // 定義一個處理頁碼變更的函數。

    setCurrentPage(page)
    // 更新 currentPage 狀態為選擇的頁碼。
  }

  const handleLocationFilter = (id) => {
    // 定義一個處理地點篩選的函數。

    setLocationId(id)
    // 更新 locationId 狀態為選擇的地點 ID。

    setCurrentPage(1)
    // 將頁碼重置為 1。
  }

  const getCategoryName = (id) => {
    // 定義一個用來根據 ID 獲取課程分類名稱的函數。

    const category = categories.find((cat) => cat.id === id)
    // 根據傳入的 ID 查找對應的課程分類對象。

    return category ? category.name : '未知類型'
    // 如果找到對應的分類，返回它的名稱；否則返回 "未知類型"。
  }

  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  return (
    <>
      <>
        <div className="container">
          <div className="shane-body-up">
            <div className="container mb-5">
              <div className="d-flex justify-content-center mb-1">
                <img
                  src="/images/yaming/course_detail/上.png"
                  alt=""
                  width={80}
                  height={8}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <div className="shane-course-wood mb-4" />
                <div className="h1 shane-course-store row text-center justify-content-center">
                  課程
                  <div className="shane-course-store p text-center ">
                    Course
                  </div>
                </div>
                <div className="shane-course-wood mb-4" />
              </div>
              <div className="d-flex justify-content-center mb-1">
                <img
                  src="/images/yaming/course/下.png"
                  alt=""
                  width={80}
                  height={8}
                />
              </div>
            </div>
            <div className="container shane-course-activity mt-5 px-5">
              <img
                src="/images/yaming/course/2304241441551418071000.jpg"
                alt=""
              />
            </div>
            <div className=" container d-flex">
              <div className="shane-course-scroll-container  mt-5">
                <button
                  className="shane-course-class-all "
                  onClick={() => {
                    handleCategoryFilter(null)
                  }}
                >
                  <img
                    src="/images/yaming/course/all-inclusive (1) 1.png"
                    alt=""
                  />
                  <h5 className="text-center mt-3">全部</h5>
                </button>
                <button
                  className="shane-course-class-all "
                  onClick={() => {
                    handleCategoryFilter(1)
                  }}
                >
                  <img src="/images/yaming/course/history-01 1.png" alt="" />
                  <h5 className="text-center mt-3"> 茶文化與歷史課程</h5>
                </button>
                <button
                  className="shane-course-class-all "
                  onClick={() => {
                    handleCategoryFilter(2)
                  }}
                >
                  <img src="/images/yaming/course/sip 2.png" alt="" />
                  <h5 className="text-center mt-3">茶葉鑑定品茶課程</h5>
                </button>
                <button
                  className="shane-course-class-all "
                  onClick={() => {
                    handleCategoryFilter(3)
                  }}
                >
                  <img src="/images/yaming/course/hand 2.png" alt="" />
                  <h5 className="text-center mt-3">茶葉製作與加工課程</h5>
                </button>
                <button
                  className="shane-course-class-all "
                  onClick={() => {
                    handleCategoryFilter(4)
                  }}
                >
                  <img
                    src="/images/yaming/course/all-inclusive-01 1.png"
                    alt=""
                  />
                  <h5 className="text-center mt-3">茶藝表演與茶道學習</h5>
                </button>
                <button
                  className="shane-course-class-all "
                  onClick={() => {
                    handleCategoryFilter(5)
                  }}
                >
                  <img
                    src="/images/yaming/course/online-learning 2.png"
                    alt=""
                  />
                  <h5 className="text-center mt-3">茶葉證照與經營課程</h5>
                </button>
              </div>
            </div>
            <div className="container">
              <div className="shane-course-star mt-5 mb-5 mx-5">
                <img
                  src="/images/yaming/course/star.png"
                  alt=""
                  width={16}
                  height={16}
                />
                <img
                  src="/images/yaming/course/Vector 25.png"
                  alt=""
                  width="100%"
                  height="1px"
                  style={{ margin: '0 -2px' }}
                />
                <img
                  src="/images/yaming/course/star.png"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
            </div>
            <div className="container justify-content-between d-flex px-5 align-items-center">
              <div className="shane-course-breadcrumb mt-1">
                <h5>課程共 {totalCourses} 筆資料</h5>
              </div>
              <div className="shane-dropdown-flex">
                <div className="shane-dropdown text-center ">
                  <button className="shane-dropdown-toggle">
                    <h5 className="m-0 p-0" style={{ fontWeight: 300 }}>
                      價格
                    </h5>
                  </button>
                  <ul className="shane-dropdown-menu">
                    <li>
                      <button
                        className="btn1"
                        href=""
                        onClick={() => handlePriceFilter('DESC')}
                      >
                        價格&nbsp;▲
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn1"
                        href=""
                        onClick={() => handlePriceFilter('ASC')}
                      >
                        價格&nbsp;▼
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="px-2" />
                <div className="shane-dropdown">
                  <button className="shane-dropdown-toggle">
                    <h5 className="m-0 p-0" style={{ fontWeight: 300 }}>
                      地區
                    </h5>
                  </button>
                  <ul className="shane-dropdown-menu justify-content-center align-items-center">
                    {locations.map((location) => (
                      <li key={location.id}>
                        <button
                          className="btn1"
                          onClick={() => handleLocationFilter(location.name)}
                        >
                          {location.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* 這邊是課程 */}
            <div className="container mt-5 px-5">
              {/* start */}
              {courses.map((v, i) => {
                return (
                  <div
                    key={v.id}
                    className="shane-course-card mb-3"
                    style={{ maxWidth: 1440 }}
                  >
                    <div className="row mt-5">
                      {/* 這邊是圖片 */}
                      <div className="col-md-4 shane-course-activity_left">
                        <Link href={`/course/${v.id}`}>
                          <img
                            src={`/images/yaming/tea_class_picture/${v.img1}`}
                            className="img-fluid rounded-start"
                            alt="..."
                          />
                        </Link>
                      </div>
                      {/* 這邊是右邊的課程大致說明圖 */}
                      <div className="col-md-8">
                        <div className="shane-course-card-body position-relative px-3">
                          <div className=" text-center justify-content-center position-absolute top-50 start-50 translate-middle">
                            <img
                              src="/images/yaming/course/LOGO 直向.png"
                              alt=""
                              width={150}
                              height={240}
                            />
                          </div>
                          <h3 className="card-title mt-3">{v.name}</h3>
                          <p className="card-text mb-2">
                            {getCategoryName(v.category_id)}
                          </p>
                          <p className="description">{v.description}</p>
                          <p>
                            {v.start_time} - {v.end_time}
                          </p>
                          <p>
                            已經報名 {v.current_number} 個人 /人數限制{' '}
                            {v.limit_people} 人
                          </p>
                          <div className="d-flex text-center">
                            <img
                              src="/images/yaming/course/geo-alt (1) 1.png"
                              alt=""
                              width="13px"
                              height="13px"
                              className="mt-2 me-2"
                            />
                            <p>{v.location}</p>
                          </div>
                          <h3 className="mt-3">${v.price}</h3>
                          <div className="d-flex align-items-center mt-3 mb-2">
                            <button
                              type="button"
                              className="btn like-btn"
                              onClick={() =>
                                handleFavToggle(courses, v.id, userID, isAuth)
                              }
                            >
                              {v.fav ? (
                                <img
                                  src="/images/yaming/course/heart-fill.svg"
                                  alt=""
                                  width={20}
                                  height={18}
                                  className="me-3"
                                />
                              ) : (
                                <img
                                  src="/images/yaming/course/love.png"
                                  alt=""
                                  width={20}
                                  height={18}
                                  className="me-3"
                                />
                              )}
                            </button>
                            <img
                              src="/images/yaming/course/Group 115.png"
                              alt=""
                              width={20}
                              height={18}
                              className="me-3"
                            />
                            <div className="ms-3">
                              <button
                                type="button"
                                className="btn rounded-pill"
                                onClick={() => {
                                  const item = { ...v, qty: 1 }
                                  console.log(item)
                                  notify(v.name)
                                  addItem(item)
                                }}
                              >
                                購買
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end */}
                  </div>
                )
              })}
            </div>
            {/* 這邊是課程 */}
            <div className="container">
              <div className="shane-course-star mt-5 mb-5 mx-5">
                <img
                  src="/images/yaming/course/star.png"
                  alt=""
                  width={16}
                  height={16}
                />
                <img
                  src="/images/yaming/course/Vector 25.png"
                  alt=""
                  width="100%"
                  height="1px"
                  style={{ margin: '0 -2px' }}
                />
                <img
                  src="/images/yaming/course/star.png"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
            </div>
            <div className="container justify-content-center d-flex course-shane-number  align-items-center ">
              <img
                src="/images/yaming/course/Vector 34 (Stroke).png"
                alt="上一頁"
                width={8}
                height={16}
                style={{
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
                className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />
              <div className="d-flex mt-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <p
                      key={page}
                      className={`page-item ${
                        currentPage === page ? 'active' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </p>
                  )
                )}
              </div>
              <img
                src="/images/yaming/course/Vector 35 (Stroke).png"
                alt="下一頁"
                width={8}
                height={16}
                className={`page-item ${
                  currentPage === totalPages ? 'disabled' : ''
                }`}
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                style={{
                  cursor:
                    currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              />
            </div>
            <div className="container">
              <div className="shane-course-star mb-5 mx-5 align-items-center justify-content-center d-flex">
                <img
                  src="/images/yaming/course/star.png"
                  alt=""
                  width={8}
                  height={8}
                />
                <img
                  src="/images/yaming/course/Vector 25.png"
                  alt=""
                  width="240px"
                  height="1px"
                  style={{ margin: '0 -2px' }}
                />
                <img
                  src="/images/yaming/course/star.png"
                  alt=""
                  width={8}
                  height={8}
                />
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </>
    </>
  )
}
