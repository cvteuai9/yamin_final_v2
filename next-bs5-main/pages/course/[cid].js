import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CiStar } from 'react-icons/ci'
import categories from '@/data/course-data/category.json'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAuth } from '@/hooks/my-use-auth'
import { YaminCourseUseCart } from '@/hooks/yamin-use-Course-cart'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

export default function CourseDetail() {
  // 資料夾中的`[productCode].js`檔案，代表在這資料夾中，除了根(索引)路由(index.js)與靜態路由(有名稱的例如list.js)之外，都算這個檔案中的實作結果，例如`/product/123`
  // 第1步: 宣告路由器
  // router.query 物件值，裡面會包含productCode屬性值
  // router.isReady 布林值，初次渲染會是false，next會經過"水合化作用"(相當於SSR)後，再渲染一次，讓isReady改變為true，代表水合化完成，此時才能得到query值
  // 購物車
  const { addItem = () => {} } = YaminCourseUseCart()
  const notify = (name) => {
    toast.success(
      <>
        <p>
          {name + '  已成功加入購物車!'}
          <br />
          <Link href="/cart/cartOne">前往購物車</Link>
        </p>
      </>
    )
  }
  //
  const router = useRouter()
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [comment, setComment] = useState([])
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  // !!取得使用者資訊
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  // 商品用狀態
  const [course, setCourse] = useState({
    id: 0,
    name: '',
    category_id: 0,
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    price: 0,
    current_number: '',
    limit_people: '',
    valid: 1,
    created_at: '',
    updated_at: '',
    fav: false,
  })
  const [randomCourses, setRandomCourses] = useState([])

  // !!收藏功能(cloud)
  // const [fav, setFav] = useState(false)
  async function handleFavToggle(course, userID, isAuth) {
    try {
      if (isAuth) {
        if (course.fav === false) {
          await fetch(
            `http://localhost:3005/api/course/favorites?user_id=${userID}&course_id=${course.id}`,
            { method: 'PUT' }
          )
            .then((res) => res.json())
            .then((result) => {
              if (result.message === 'Favorite Course Insert successfully') {
                toast.success(<p className="m-0">加入收藏成功!</p>)
              } else {
                toast.error(<p className="m-0">加入收藏失敗!</p>)
              }
            })
            .catch((error) => console.log(error))
        } else {
          await fetch(
            `http://localhost:3005/api/course/favorites?user_id=${userID}&course_id=${course.id}`,
            { method: 'DELETE' }
          )
            .then((res) => res.json())
            .then((result) => {
              if (result.message === 'Favorite Course deleted successfully') {
                toast.success(<p className="m-0">移除收藏成功!</p>)
              } else {
                toast.error(<p className="m-0">移除收藏失敗!</p>)
              }
            })
            .catch((error) => console.log(error))
        }
        let tmp = { ...course, fav: !course.fav }
        setCourse(tmp)
      } else {
        // 原本寫的
        // if (confirm('您尚未登入，請登入後再操作!')) {
        //   router.push('/member/login')
        // }
        // Swal的confirm
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // 假設768px為手機和平板的分界點
    }

    handleResize() // 初始化
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePrevComment = () => {
    setCurrentCommentIndex((prevIndex) => {
      if (isMobile) {
        return prevIndex > 0 ? prevIndex - 1 : comment.length - 1
      }
      return prevIndex > 0 ? prevIndex - 1 : comment.length - 3
    })
  }

  const handleNextComment = () => {
    setCurrentCommentIndex((prevIndex) => {
      if (isMobile) {
        return prevIndex < comment.length - 1 ? prevIndex + 1 : 0
      }
      return prevIndex < comment.length - 3 ? prevIndex + 1 : 0
    })
  }
  async function getComments(id) {
    try {
      const apiURL = new URL(`http://localhost:3005/api/course/comment/${id}`)
      const res = await fetch(apiURL)
      const data = await res.json()
      // console.log(data)
      setComment(data.comments) // 將評論資料設置到狀態中
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  // 向伺服器fetch獲取資料
  async function getCourse(id, userID, isAuth) {
    try {
      const apiURL = `http://localhost:3005/api/course/${id}`
      const res = await fetch(apiURL)
      if (!res.ok) throw new Error('Network response was not ok')
      let data = await res.json()
      // !!拿取使用者收藏的course_id
      let favoritesData = []
      if (isAuth) {
        const favoritesURL = `http://localhost:3005/api/course/favorites?user_id=${userID}`
        const favoritesRes = await fetch(favoritesURL)
        favoritesData = await favoritesRes.json()
      }
      // console.log(favoritesData)
      // console.log(data)
      if (favoritesData.includes(data.id)) {
        data.fav = true
      } else {
        data.fav = false
      }
      // console.log(data.fav)
      setCourse(data)
    } catch (error) {
      console.error('Error fetching course data:', error)
    }
  }
  // 新增函式以獲取隨機課程
  async function getRandomCourses(id) {
    try {
      const apiURL = `http://localhost:3005/api/course/random/${id}`
      const res = await fetch(apiURL)
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      // console.log(data)
      setRandomCourses(data.courses)
    } catch (error) {
      console.error('Error fetching random courses:', error)
    }
  }
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  useEffect(() => {
    if (router.isReady) {
      const courseId = router.query.cid
      getCourse(courseId, userID, isAuth)
      getComments(courseId) // 當路由準備好後，獲取評論資料
      getRandomCourses()
    }
  }, [router.isReady, router.query.cid, userID, isAuth])

  const getCategoryName = (id) => {
    // 定義一個用來根據 ID 獲取課程分類名稱的函數。

    const category = categories.find((cat) => cat.id === id)
    // 根據傳入的 ID 查找對應的課程分類對象。

    return category ? category.name : '未知類型'
    // 如果找到對應的分類，返回它的名稱；否則返回 "未知類型"。
  }
  return (
    <>
      <>
        <div className="container shane-course-detail-container-top">
          <div className="d-flex justify-content-center mb-1">
            <img
              src="/images/yaming/course_detail/上.png"
              alt=""
              width={80}
              height={8}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="shane-course-detail-wood mb-4" />
            <div className="h1 shane-course-detail-store row text-center justify-content-center">
              課程
              <div className="shane-course-detail-store p text-center ">
                store
              </div>
            </div>
            <div className="shane-course-detail-wood mb-4" />
          </div>
          <div className="d-flex justify-content-center mb-1">
            <img
              src="/images/yaming/course_detail/下.png"
              alt=""
              width={80}
              height={8}
            />
          </div>
        </div>
        <div className="container d-flex mt-5 mb-5 align-items-center shane-course-detail-breadcrumb">
          <Link href="/course/courselist">
            <div>
              <img
                src="/images/yaming/course_detail/Vector 34 (Stroke).png"
                alt=""
                width={17}
                height={29}
                className="ms-5 breadcrumb_img"
              />
            </div>
          </Link>
          <div className="ms-3 ms-sm-5">
            <h5>返回列表</h5>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6 col-md-6 col-xl-6 justify-content-center px-5 shane-course-detail-activity_left">
              <Swiper
                style={{
                  '--swiper-navigation-color': '#fff',
                  '--swiper-pagination-color': '#fff',
                }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                // loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Autoplay, FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
              >
                <SwiperSlide>
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img1}`}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img2}`}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img3}`}
                  />
                </SwiperSlide>
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={3}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img1}`}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img2}`}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img3}`}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="col-12 col-lg-6 col-md-6 col-xl-6 d-flex justify-content-center px-5">
              <div className="card-body shane-course-detail-card">
                <h3 className="shane-course-detail-card-title">
                  {course.name}
                </h3>
                <h5 className="card-text mt-4">
                  {getCategoryName(course.category_id)}
                </h5>
                <p className="mt-5">{course.description}</p>
                <p className="mt-5">2024/08/20 - 2024/08/20</p>
                <p>
                  已經報名 {course.current_number} 個人 /人數限制{' '}
                  {course.limit_people} 人
                </p>
                <div className="d-flex text-center ">
                  <img
                    src="/images/yaming/course_detail/geo-alt (1) 1.png"
                    alt=""
                    width="13px"
                    height="13px"
                    className="mt-2 me-2"
                  />
                  <p>{course.location}</p>
                </div>
                <h4 className="mt-3">${course.price} </h4>
                <div className="d-flex align-items-center mt-3">
                  {/* 收藏按鈕 */}
                  <button
                    type="button"
                    className="btn like-btn"
                    onClick={() => handleFavToggle(course, userID, isAuth)}
                  >
                    {course.fav ? (
                      <img
                        src="/images/yaming/course_detail/heart-fill.svg"
                        alt=""
                        width={20}
                        height={18}
                        className="me-3"
                      />
                    ) : (
                      <img
                        src="/images/yaming/course_detail/love.png"
                        alt=""
                        width={20}
                        height={18}
                        className="me-3"
                      />
                    )}
                  </button>
                  <img
                    src="/images/yaming/course_detail/Group 115.png"
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
                        const item = { ...course, qty: 1 }
                        console.log(item)
                        notify(course.name)
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
        </div>
        <div className="container mt-5 ">
          <div className="shane-course-detail-star mt-5 mb-5 mx-5">
            <img
              src="/images/yaming/course_detail/star.png"
              alt=""
              width={16}
              height={16}
            />
            <img
              src="/images/yaming/course_detail/Vector 25.png"
              alt=""
              width="100%"
              height="1px"
              style={{ margin: '0 -2px' }}
            />
            <img
              src="/images/yaming/course_detail/star.png"
              alt=""
              width={16}
              height={16}
            />
          </div>
        </div>
        <div className="container shane-course-detail-container-top">
          <div className="d-flex justify-content-center mb-1">
            <img
              src="/images/yaming/course_detail/上.png"
              alt=""
              width={80}
              height={8}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="shane-course-detail-wood mb-4" />
            <div className="h1 shane-course-detail-store row text-center justify-content-center">
              評論
              <div className="shane-course-detail-store p text-center ">
                store
              </div>
            </div>
            <div className="shane-course-detail-wood mb-4" />
          </div>
          <div className="d-flex justify-content-center mb-5">
            <img
              src="/images/yaming/course_detail/下.png"
              alt=""
              width={80}
              height={8}
            />
          </div>
        </div>
        <div className="container mt-5 d-flex align-items-center">
          <FaChevronLeft
            onClick={handlePrevComment}
            className="cursor-pointer"
            size={15}
            color="#B29564"
          />
          <div className="container">
            <div className="row d-flex justify-content-center">
              {comment
                .slice(
                  currentCommentIndex,
                  currentCommentIndex + (isMobile ? 1 : 3)
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`${
                      isMobile ? 'col-12' : 'col-md-4'
                    } shane-course-detail-activity_Comment mx-3 mb-4`}
                  >
                    <div className="d-flex">
                      <img
                        src="/images/yaming/course_detail/anya-300-03.png"
                        className="rounded-circle mt-3 ms-3"
                        alt="..."
                        width={60}
                        height={60}
                      />
                      <div className="row ms-3 mt-4">
                        <h5 className="col-12 m-0 p-0">
                          用戶 {item.member_id}
                        </h5>
                        <p className="col-12 m-0 p-0">
                          {[...Array(5)].map((_, index) => (
                            <CiStar
                              key={index}
                              className={
                                index < item.rating ? 'text-warning' : ''
                              }
                              color="#fff"
                            />
                          ))}
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 mx-3">{item.comment}</p>
                    <p className="mt-5 mx-3">{item.date}</p>
                  </div>
                ))}
            </div>
          </div>
          <FaChevronRight
            onClick={handleNextComment}
            className="cursor-pointer"
            size={15}
            color="#B29564"
          />
        </div>
        <div className="container mt-5 shane-course-detail-container-top">
          <div className="d-flex justify-content-center mb-1">
            <img
              src="/images/yaming/course_detail/上.png"
              alt=""
              width={80}
              height={8}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="shane-course-detail-wood mb-4" />
            <div className="h1 shane-course-detail-store row text-center justify-content-center">
              其他課程
              <div className="shane-course-detail-store p text-center ">
                store
              </div>
            </div>
            <div className="shane-course-detail-wood mb-4" />
          </div>
          <div className="d-flex justify-content-center mb-1">
            <img
              src="/images/yaming/course_detail/下.png"
              alt=""
              width={80}
              height={8}
            />
          </div>
        </div>
        <div className="container mt-3 mb-1 mt-5">
          <div className="row d-flex justify-content-center align-items-center ms-2 me-2">
            {randomCourses.map((course) => (
              <div
                key={course.id}
                className=".col-12 shane-course-detail-store1 col-sm-6 col-md-3 text-center"
              >
                <div className="shane-course-detail-store_picture">
                  <img
                    src={`/images/yaming/tea_class_picture/${course.img1}`}
                    alt={course.name}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center m-0 ">
                  <div className="shane-course-detail-wood" />
                  <div className="h5 shane-course-detail-store mt-3">
                    {course.name}
                  </div>
                  <div className="shane-course-detail-wood" />
                </div>
                <div className="shane-course-detail-star2">
                  <img
                    src="/images/yaming/course_detail/star.png"
                    alt=""
                    className="star3"
                  />
                  <img
                    src="/images/yaming/course_detail/Vector 25.png"
                    alt=""
                  />
                  <img
                    src="/images/yaming/course_detail/star.png"
                    alt=""
                    className="star3"
                  />
                </div>
                <p className="shane-course-detail-store">
                  {getCategoryName(course.category_id)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Toaster />
      </>
    </>
  )
}
