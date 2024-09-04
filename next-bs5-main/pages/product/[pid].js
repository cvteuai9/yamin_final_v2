import React, { useEffect, useState, useRef } from 'react'
import { useLoader } from '@/hooks/use-loader'
import { useRouter } from 'next/router'
import styles from '@/styles/product-detail.module.scss'
import Link from 'next/link'
import { IoArrowBackCircle } from 'react-icons/io5'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { FaArrowAltCircleRight } from 'react-icons/fa'
import { YaminUseCart } from '@/hooks/yamin-use-cart'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/my-use-auth'
// 以下為  {商品圖輪播套件}
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { useSwiper } from 'swiper/react'
// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { ClientPageRoot } from 'next/dist/client/components/client-page'
import Swal from 'sweetalert2'
// 以上為  {商品圖輪播套件}

export default function Detail() {
  const { addItem = () => {} } = YaminUseCart()

  const notify = (productName) => {
    toast.success(
      <>
        <p>
          {productName + '已成功加入購物車!'}
          <br />
          <Link href="/cart/cartOne">前往購物車</Link>
        </p>
      </>
    )
  }
  const { showLoader, hideLoader, loading, delay } = useLoader() // 頁面載入等候畫面
  // !!取得使用者資訊
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  // const swiper = useSwiper()
  const swiperRef = useRef(null)
  const [productCount, setProductCount] = useState(1)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [review, setReview] = useState([])
  const [allReviews, setAllReviews] = useState([])
  // eachRating各星級的評價%數陣列 => [0, 0, 12, 15, 73]
  //                                 ^^ ^^ ^^  ^^  ^^
  //                           星級   1  2   3   4  5
  const [eachRating, setEachRating] = useState([])
  // allRating 總星級平均分數
  const [allRatingScore, setAllRating] = useState('0')
  // allLength 總評論數
  const [allLength, setAllLength] = useState('0')
  const router = useRouter()
  const [image, setImage] = useState([])
  const [relationProduct, setRelationProduct] = useState([])
  const allRatingStar = new Array(Math.floor(Number(allRatingScore)))
    .fill(0)
    .map((v, index) => index)
  const allRatingUnfillStar = new Array(5 - Math.floor(Number(allRatingScore)))
    .fill(0)
    .map((v, index) => index)
  // 設定商品資料初始物件
  const [product, setProduct] = useState({
    id: 0,
    product_name: '',
    description: '',
    weight: '',
    price: 0,
    stock: 0,
    brand_id: 0,
    tea_id: 0,
    package_id: 0,
    style_id: 0,
    created_at: '',
    available_time: '',
    end_time: '',
    valid: 1,
    paths: '',
    updated_at: '',
  })
  // 取得特定id商品資料的函式
  async function getProduct(id, userID, isAuth) {
    try {
      const apiURL = new URL(`http://localhost:3005/api/my_products/${id}`)
      const res = await fetch(apiURL)
      const data = await res.json()
      let productThis = data.data[0]
      // !! user_id要改
      if (isAuth) {
        const favURL = new URL(
          `http://localhost:3005/api/my_products/favorites?user_id=${userID}`
        )
        const resFav = await fetch(favURL)
        const dataFav = await resFav.json()
        if (dataFav.includes(productThis.id)) {
          productThis.fav = true
        } else {
          productThis.fav = false
        }
      } else {
        productThis.fav = false
      }
      // console.log(productThis)
      setImage(data.images)
      setProduct(productThis)
      // console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  // 取得評論的函式
  async function getReviews(id) {
    try {
      const apiURL = new URL(
        `http://localhost:3005/api/my_products/reviews/${id}`
      )
      const res = await fetch(apiURL)
      const data = await res.json()
      if (data.allLength !== 0) {
        setReview(data.someData)
        setAllReviews(data.allData)
        setEachRating(data.eachRating)
        setAllRating(data.allRating)
        setAllLength(JSON.stringify(data.allLength))
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 取得相關產品
  async function getRelationProduct(id) {
    try {
      const apiURL = new URL(
        `http://localhost:3005/api/my_products/relation_product/${id}`
      )
      const res = await fetch(apiURL)
      const data = await res.json()
      setRelationProduct(data)
    } catch (error) {
      console.log(error)
    }
  }
  // 處理商品數量加減的函式
  function handleProductCount(e) {
    if (e.target.id === 'add') {
      if (productCount + 1 <= 99) {
        setProductCount(productCount + 1)
      } else {
        alert('商品數量最多為99')
      }
    } else {
      if (productCount - 1 > 0) {
        setProductCount(productCount - 1)
      } else {
        alert('商品數量最少為1')
        setProductCount(1)
      }
    }
  }
  // !! user_id 要改
  async function handleFavToggle(product, userID, isAuth) {
    if (isAuth) {
      if (product.fav === false) {
        fetch(
          `http://localhost:3005/api/my_products/favorites?user_id=${userID}&product_id=${product.id}`,
          { method: 'PUT' }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message === 'Favorite Product Insert successfully') {
              toast.success(<p className="m-0">成功加入收藏!</p>)
            } else {
              toast.error(<p className="m-0">加入收藏失敗!</p>)
            }
          })
          .catch((error) => console.log(error))
      } else {
        fetch(
          `http://localhost:3005/api/my_products/favorites?user_id=${userID}&product_id=${product.id}`,
          { method: 'DELETE' }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message === 'Favorite Product deleted successfully') {
              toast.success(<p className="m-0">移除收藏成功!</p>)
            } else {
              toast.error(<p className="m-0">移除收藏失敗!</p>)
            }
          })
          .catch((error) => console.log(error))
      }
      const tmp = { ...product, fav: !product.fav }
      setProduct(tmp)
    } else {
      // if (confirm('您尚未登入，請登入後再操作!')) {
      //   router.push('/member/login')
      // }
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
  }
  // useEffect(() => {
  //   // 第一次進入頁面才會有loading畫面
  //   showLoader()
  // }, [])
  useEffect(() => {
    if (thumbsSwiper) {
      thumbsSwiper.update()
    }
  }, [thumbsSwiper])
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  useEffect(() => {
    // console.log(router.query)
    if (router.isReady) {
      // console.log(router.query)`
      getProduct(router.query.pid, userID, isAuth)
      getReviews(router.query.pid)
      getRelationProduct(router.query.pid)
      // reset swiper
      swiperRef.current.slideTo(0)
    }
    // eslint-disable-next-line
  }, [router.isReady, router.query.pid, userID, isAuth])
  return (
    <>
      {/* 返回商品列表頁按鈕 */}
      <div className={`${styles.backToListBtn}`}>
        <h3>
          <Link href={`/product/list`} className="d-flex align-items-center">
            <IoArrowBackCircle className="display-4" />
            返回產品列表
          </Link>
        </h3>
      </div>
      {/* main ---START--- */}
      <div className={`${styles.main} container-fluid`}>
        {/* 商品介紹區 section1 */}
        <div
          className={`${styles.section1} row justify-content-center align-items-center align-items-sm-start gap-0`}
        >
          {/* 商品圖輪播區 */}
          <div
            className={`${styles.left} col-12 col-sm-5 col-lg-4 p-0 p-md-3 p-xl-5`}
          >
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              style={{
                '--swiper-navigation-color': '#d7b375',
                '--swiper-pagination-color': '#d7b375',
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Autoplay, FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
            >
              {image && image.length > 0 ? (
                image.map((v, i) => {
                  return (
                    <SwiperSlide key={i}>
                      <img
                        className="object-fit-contain"
                        src={`/images/product/list1/products-images/${v}`}
                        alt=""
                      />
                    </SwiperSlide>
                  )
                })
              ) : (
                <p>No images avilable</p>
              )}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs, Autoplay]}
              className="mySwiper"
            >
              {image && image.length > 0 ? (
                image.map((v, i) => {
                  return (
                    <SwiperSlide key={i}>
                      <img
                        className="object-fit-contain"
                        src={`/images/product/list1/products-images/${v}`}
                        alt=""
                      />
                    </SwiperSlide>
                  )
                })
              ) : (
                <p>No images avilable</p>
              )}
            </Swiper>
          </div>
          {/* 商品資訊 */}
          <div
            className={`${styles.right} col-12 col-sm-5 col-lg-6 d-flex flex-column justify-content-between gap-3 gap-xl-5 ps-3 p-md-3 p-xl-5`}
          >
            <div className="d-flex flex-column gap-3 gap-xl-5">
              <h3 className="fw-bold">{`${product.product_name}`}</h3>
              <div className="d-flex gap-3">
                {/* 商品評論 */}
                <div
                  className={`${styles['star-group']} d-flex gap-1 gap-lg-3`}
                >
                  {allRatingStar.map((v, i) => {
                    return (
                      <img
                        src="/images/product/list1/Star.svg"
                        alt=""
                        key={v}
                      />
                    )
                  })}
                  {allRatingUnfillStar.map((v, i) => {
                    return (
                      <img
                        src="/images/product/list1/Star-unfill.svg"
                        alt=""
                        key={v}
                      />
                    )
                  })}
                </div>
                <p className={`${styles['rating-top']} m-0`}>
                  {allRatingScore}
                </p>
                <p className="m-0">
                  (
                  <span className={`${styles['review-count']}`}>
                    {allLength !== '0' ? allLength : '尚無評論'}
                  </span>
                  )
                </p>
              </div>

              {/* 商品價格 */}
              <h2>
                NT$ <span>{product.price}</span>
              </h2>
              <div className="d-flex gap-3 flex-column flex-lg-row align-items-end">
                <div
                  className={`${styles['heart-btn']} d-flex flex-row flex-lg-column gap-3 gap-xl-5 justify-content-between justify-content-lg-end align-items-center align-items-lg-start`}
                >
                  <div className="d-flex gap-0 gap-md-3">
                    <button
                      type="button"
                      className="btn d-flex align-items-center"
                      onClick={() => handleFavToggle(product, userID, isAuth)}
                    >
                      {product.fav ? (
                        <>
                          <img
                            className={`${styles['like-heart']}`}
                            src="/images/product/list1/heart-fill.svg"
                            alt=""
                          />
                          <h3 className={`m-0 ${styles['like-text']}`}>
                            已收藏
                          </h3>
                        </>
                      ) : (
                        <>
                          <img
                            className={`${styles['like-heart']}`}
                            src="/images/product/list1/heart.svg"
                            alt=""
                          />
                          <h3 className={`m-0 ${styles['like-text']}`}>
                            加入收藏
                          </h3>
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className={`${styles['product-count']} d-flex text-center`}
                  >
                    <button
                      className={`btn ${styles.minus}`}
                      id="minus"
                      onClick={(e) => {
                        handleProductCount(e)
                      }}
                    >
                      -
                    </button>
                    <div>{productCount}</div>
                    <button
                      className={`btn ${styles.add}`}
                      id="add"
                      onClick={(e) => {
                        handleProductCount(e)
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className={`btn ${styles['cart-btn']} text-center`}
                  onClick={() => {
                    const item = { ...product, qty: productCount }
                    // console.log(item)
                    notify(product.product_name)
                    addItem(item)
                  }}
                >
                  加入購物車
                </button>
              </div>
            </div>
            <div>
              <h5>運送方式</h5>
              <p className="p2">
                配送方式：常溫宅配 <br />
                1.
                本商品為新鮮食材製作，不含防腐劑及人工添加物，為維持新鮮請置放於陰涼處保存。{' '}
                <br />
                2.
                本產品裝飾、造型、顏色以實物為主，內容物組成以實物及商品說明為主。{' '}
                <br />
                3.
                食品因保存期限及衛生考量，一經拆封使用或非運送過程失溫導致商品變質者，恕無法接受退換貨。
              </p>
            </div>
          </div>
        </div>
        {/* 商品描述區域 section2 */}
        <div
          className={`${styles.section2} row align-items-center align-items-xl-start justify-content-center gap-3`}
        >
          <div className="col-12 col-sm-5">
            <div
              className={`d-flex justify-content-center align-items-center mb-3 gap-3`}
            >
              <img src="/images/product/list1/dash.svg" alt="" />
              <h3 className={`text-center ${styles['descript-title']} m-0`}>
                商品描述
              </h3>
              <img src="/images/product/list1/dash.svg" alt="" />
            </div>

            <h5 className={`${styles.descript}`}>{product.description}</h5>
          </div>
          <div className="col-12 col-sm-5 p-0">
            <img
              className="img-fluid object-fit-cover"
              src="/images/product/list1/image_0753.jpg"
              alt=""
            />
          </div>
        </div>
        {/* 顧客評價區域 section3 */}
        <div className={`${styles.section3}`}>
          <div
            className={`d-flex justify-content-center align-items-center gap-3`}
          >
            <img src="/images/product/list1/dash.svg" alt="" />
            <h3 className={`${styles['section3-title']} m-0`}>顧客評價</h3>
            <img src="/images/product/list1/dash.svg" alt="" />
          </div>
          {/* 如果沒有人評論，則顯示防呆訊息 */}
          {allLength !== '0' ? (
            <>
              <div className="row d-flex flex-column flex-md-row justify-content-center align-items-center align-items-md-start gap-5 mt-5">
                <div className="col-12 col-md-4 d-flex gap-3 justify-content-center justify-content-md-end align-items-center">
                  {/* 評價總分、星星數 */}
                  <div
                    className={`${styles['review-star-group']} d-flex gap-3`}
                  >
                    {allRatingStar.map((v, i) => {
                      return (
                        <img
                          src="/images/product/list1/Star.svg"
                          alt=""
                          key={v}
                        />
                      )
                    })}
                    {allRatingUnfillStar.map((v, i) => {
                      return (
                        <img
                          src="/images/product/list1/Star-unfill.svg"
                          alt=""
                          key={v}
                        />
                      )
                    })}
                  </div>
                  {/* 總分 */}
                  <p className={`${styles['rating-top']} m-0`}>
                    {allRatingScore}
                  </p>
                  {/* 總評論數 */}
                  <p className="m-0">
                    (
                    <span className={`${styles['review-count']}`}>
                      {allLength}
                    </span>
                    )
                  </p>
                </div>
                {/* 評分長條圖區 */}
                <div className="col-12 col-md-5">
                  {eachRating.map((v, i) => {
                    return (
                      <div
                        className="row justify-content-center justify-content-md-start align-items-center mb-3"
                        key={i}
                      >
                        <h5 className="col-1 m-0 text-end">
                          {eachRating.length - i}
                        </h5>
                        <div className={`col-6 ${styles['review-rating-bar']}`}>
                          <div
                            className={`${styles['rating-bar']}`}
                            style={{ width: `${v}%` }}
                          />
                        </div>
                        <h5 className="col-1 m-0">
                          <span>{v}</span>%
                        </h5>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* 使用者評論卡區域 */}
              <div className={`${styles['review-area']} mt-5`}>
                {review.map((v, i) => {
                  const starArray = new Array(v.rating).fill(0)
                  const starArrayUnfill = new Array(5 - v.rating).fill(0)
                  {
                    /* console.log(v) */
                  }
                  return (
                    <div
                      className={`${styles['review-card']} d-flex flex-row gap-5 mb-3`}
                      key={v.id}
                    >
                      <div className="d-flex flex-column gap-3">
                        <div className={`${styles.avatar}`}>
                          <img
                            className="img-fluid object-fit-cover"
                            src="http://localhost:3005/avatar/1.png"
                            alt=""
                          />
                        </div>
                        <h5 className="text-center fw-bold">{v.user_name}</h5>
                      </div>
                      <div>
                        <div
                          className={`${styles['review-star-group']} d-flex gap-3`}
                        >
                          {starArray.map((v, i) => {
                            return (
                              <img
                                src="/images/product/list1/Star.svg"
                                alt=""
                                key={i}
                              />
                            )
                          })}
                          {starArrayUnfill.map((v, i) => {
                            return (
                              <img
                                src="/images/product/list1/Star-unfill.svg"
                                alt=""
                                key={i}
                              />
                            )
                          })}
                        </div>
                        <div className={`${styles['review-text']} mt-3`}>
                          <p>{v.comment}</p>
                        </div>
                        <div className={`${styles['review-date']} mt-3 fs-5`}>
                          {v.created_at}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="d-flex justify-content-center">
                <div className={`${styles['more-btn']}`}>
                  <button
                    type="button"
                    className="btn h5 m-0"
                    data-bs-toggle="modal"
                    data-bs-target="#moreBtnModal"
                  >
                    查看更多
                  </button>
                </div>
              </div>
              <div
                className="modal fade"
                id="moreBtnModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                {/* 顯示所有評論的modal */}
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                  <div className={`modal-content ${styles.moreArea}`}>
                    <div className="modal-header d-flex justify-content-between">
                      <h5 className="modal-title" id="exampleModalLabel">
                        <span className="fw-bold">{product.product_name}</span>{' '}
                        的所有評論
                      </h5>
                      <button
                        type="button"
                        className="btn-close m-0"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    {/* 所有此商品的評論 */}
                    <div className={`modal-body ${styles.modalBody}`}>
                      <div className={`${styles['review-area']} mt-5`}>
                        {allReviews.map((v, i) => {
                          const starArray = new Array(v.rating)
                            .fill(0)
                            .map((v, index) => index)
                          const starArrayUnfill = new Array(5 - v.rating)
                            .fill(0)
                            .map((v, index) => index)
                          return (
                            <div
                              className={`${styles['review-card']} d-flex flex-row gap-5 mb-3`}
                              key={v.id}
                            >
                              <div className="d-flex flex-column gap-3">
                                <div className={`${styles.avatar}`}>
                                  <img
                                    className="img-fluid object-fit-cover"
                                    src="/images/product/list1/boy3.png"
                                    alt=""
                                  />
                                </div>
                                <h5 className="text-center fw-bold">
                                  {v.user_name}
                                </h5>
                              </div>
                              <div>
                                <div
                                  className={`${styles['review-star-group']} d-flex gap-3`}
                                >
                                  {starArray.map((v, i) => {
                                    return (
                                      <img
                                        src="/images/product/list1/Star.svg"
                                        alt=""
                                        key={i}
                                      />
                                    )
                                  })}
                                  {starArrayUnfill.map((v, i) => {
                                    return (
                                      <img
                                        src="/images/product/list1/Star-unfill.svg"
                                        alt=""
                                        key={i}
                                      />
                                    )
                                  })}
                                </div>
                                <div
                                  className={`${styles['review-text']} mt-3`}
                                >
                                  <p>{v.comment}</p>
                                </div>
                                <div
                                  className={`${styles['review-date']} mt-3 fs-5`}
                                >
                                  {v.created_at}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {/* 確認按鈕 */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary fs-4"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        確認
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 如果商品沒有評論，會顯示以下防呆訊息 */}
              <div className="text-center my-5 fw-bold">
                <div className="display-3">此商品還沒有人評論過...</div>
                <div className="mt-3">
                  <Link
                    className={`${styles.goShooping} text-decoration-none fs-2`}
                    href="/product/list"
                  >
                    點我去逛逛
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        {/* 相關產品區域 */}
        <div className={`${styles.section4} my-5`}>
          <div
            className={`d-flex justify-content-center align-items-center gap-3 mb-5`}
          >
            <img src="/images/product/list1/dash.svg" alt="" />
            <h3 className={`${styles['section4-title']} m-0`}>相關產品</h3>
            <img src="/images/product/list1/dash.svg" alt="" />
          </div>
          <div className={`${styles['rp-group']} my-3 py-3`}>
            {relationProduct.map((v, i) => {
              return (
                <div
                  className={`${styles['relation-product-card']} pb-1 d-flex flex-column gap-3 justify-content-between`}
                  key={v.id}
                >
                  <div className="d-flex flex-column gap-2">
                    <div className={`${styles['card-image']} pb-3`}>
                      <Link href={`/product/${v.id}`}>
                        <img
                          src={`/images/product/list1/products-images/${v.paths}`}
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className={`${styles['product-name']} px-3`}>
                      <Link
                        href={`/product/${v.id}`}
                        className="text-decoration-none"
                      >
                        <p className="fw-bold">{v.product_name}</p>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles['card-bottom']} px-3`}>
                    <p className="m-0">
                      NT$ <span>{v.price}</span>
                    </p>
                  </div>
                </div>
              )
            })}
            <Link
              className={`${styles.relationProductBtn} d-flex justify-contnet-center align-items-center`}
              href="/product/list"
            >
              <div className="fs-1 d-flex justify-contnet-center align-items-center">
                <FaArrowAltCircleRight />
                &ensp;點我查看更多
              </div>
            </Link>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  )
}
