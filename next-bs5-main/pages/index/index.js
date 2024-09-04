import React, { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick'
import Link from 'next/link'
import Viewpager from '@/components/course/index_course'
import MapComponent from '@/components/map/map'

export default function Yaming() {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0) // 初始選中第一個課程
  const [products, setProducts] = useState([])
  const [articles, setArticles] = useState([])

  const getProducts = async () => {
    const apiURL = `http://localhost:3005/api/my_index`

    const res = await fetch(apiURL)
    const data = await res.json()
    console.log(data)
    setProducts(data)
  }
  const getArticles = async () => {
    const apiURL = `http://localhost:3005/api/my-articles`
    const res = await fetch(apiURL)
    const data = await res.json()
    setArticles(data)
  }

  useEffect(() => {
    getProducts()
    getArticles() // 在組件載入時調用函式取得文章資料
  }, [])
  const settings = {
    infinite: true, // 無限循環滑動
    speed: 500, // 滑動速度
    slidesToShow: 5, // 每次顯示的商品數
    slidesToScroll: 5, // 每次滑動商品的數量
    arrows: false, // 左右箭頭
    autoplay: true, // 啟用自動播放
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // 平板螢幕寬度以下的設定
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          autoplaySpeed: 2500,
        },
      },
      {
        breakpoint: 600, // 手機螢幕寬度以下的設定
        settings: {
          slidesToShow: 2, // 顯示 3 個商品
          slidesToScroll: 2, // 每次滑動 3 個
          infinite: true,
          autoplaySpeed: 2000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // 顯示 1 個商品
          slidesToScroll: 1, // 每次滑動 1 個
          infinite: true,
          autoplaySpeed: 1500,
        },
      },
    ],
  }
  const courseData = [
    {
      title: '茶文化與歷史課程',
      video: 'images/video/1325074-uhd_3840_2160_24fps.mp4',
    },
    {
      title: '茶葉鑑定品茶課程',
      video: 'images/video/4489678-uhd_3840_2160_25fps.mp4',
    },
    {
      title: '茶葉製作與加工課程',
      video: 'images/video/6540522-uhd_3840_2160_25fps.mp4',
    },
    {
      title: '茶藝表演與茶道課程',
      video: 'images/video/1324936-uhd_3840_2160_24fps.mp4',
    },
    {
      title: '茶葉證照與經營課程',
      video: '/images/video/12165164_3840_2160_24fps.mp4',
    },
  ]

  return (
    <>
      {/* 首頁投影片 */}
      <div className="shane-body container-fluid mt-5">
        <div className="mb-5 mt-5">
          <div className="ratio ratio-16x9 mt-5">
            <video
              src="images/video/taiwan tea.mp4"
              autoPlay
              muted
              loop
              style={{ opacity: '0.4' }}
            />
            <div className="d-flex justify-content-center align-items-center position-absolute ">
              <div className="justify-content-center align-items-center">
                <img
                  src="images/yaming/index/LOGO 直向.svg"
                  alt=""
                  width="160px"
                  className="shane-ratio1-img"
                />
              </div>
            </div>
          </div>
        </div>
        {/* 首頁投影片 */}
        <div className="container">
          {/* 商品 */}
          <div className="container">
            <div className="shane-star mt-5 mb-5 mx-5">
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
              <img
                src="/images//yaming/index/Vector 25.png"
                alt=""
                width="100%"
                height="1px"
                style={{ margin: '0 -2px' }}
              />
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="container mb-5">
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/上.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shane-wood  mb-4" />
              <div className="h1 shane-store row text-center justify-content-center">
                商品
                <div className="shane-p ">
                  <div className="p text-center ">Store</div>
                </div>
              </div>
              <div className="shane-wood  mb-4" />
            </div>
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/下.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
          </div>
          <div className="container mt-3 mb-1">
            <div className="row d-flex justify-content-center align-items-center ms-2 me-2 overflow-x-auto">
              <Slider {...settings}>
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="col-12 col-sm-6 col-md-3 text-center mx-2"
                  >
                    <div className="shane-store-picture">
                      <img
                        src={`images/product/list1/products-images/${product.paths}`}
                        alt={product.product_name}
                        className="shane-picture"
                      />
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4 m-0">
                      <Link href={`/product/${product.id}`}>
                        <div className="h3 shane-store shane-product-name">
                          <h5>{product.product_name}</h5>
                        </div>
                      </Link>
                    </div>
                    <div className="shane-star2 ">
                      <img
                        src="/images/yaming/index/star.png"
                        alt=""
                        className="star3"
                      />
                      <img
                        src="/images/yaming/index/Vector 25.png"
                        alt=""
                        height={1}
                        width={160}
                      />
                      <img
                        src="/images/yaming/index/star.png"
                        alt=""
                        className="star3"
                      />
                    </div>
                    <div className="shane-p mt-1">
                      <p>{product.tea_name}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="container">
            <div className=" row ">
              <Link href="/product/list">
                <div className="d-flex justify-content-center align-items-center mt-5 mb-5 shane-p">
                  <p className="pt-3 me-3">更多頁面</p>
                  <img
                    src="/images/yaming/index/更多頁面.png"
                    alt=""
                    width="100px"
                    height="12px"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className="container">
            <div className="shane-star mt-3 mb-5 mx-5">
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
              <img
                src="/images/yaming/index/Vector 25.png"
                alt=""
                width="100%"
                height="1px"
                style={{ margin: '0 -2px' }}
              />
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
            </div>
          </div>
          {/* 商品 */}
          {/* 課程 */}
          <div className="container mb-5">
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/上.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shane-wood  mb-4" />
              <div className="h1 shane-store row text-center justify-content-center">
                課程
                <div className="p text-center ">Course</div>
              </div>
              <div className="shane-wood  mb-4" />
            </div>
            <div className="d-flex justify-content-center mb-1 mb-5">
              <img
                src="/images/yaming/index/下.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
            <Viewpager></Viewpager>
            <div className="shane-activity m-0">
              <div className="row text-center">
                <div className="col-12 col-md-6 shane-activity justify-content-center align-items-center mt-5">
                  <h5 className="mt-3 mb-3 row">
                    {courseData.map((course, index) => (
                      <button
                        key={index}
                        className="shane-optionButton"
                        onClick={() => setSelectedCourseIndex(index)} // 當點擊選項時，切換當前選中課程
                      >
                        <div className="shane-star2 mb-1">
                          <img
                            src="/images/yaming/index/star.png"
                            alt=""
                            width={8}
                            height={8}
                          />
                          <img
                            src="/images/yaming/index/Vector 25.png"
                            alt=""
                            width="180px"
                            height="1px"
                            style={{ margin: '0 -2px' }}
                          />
                          <img
                            src="/images/yaming/index/star.png"
                            alt=""
                            width={8}
                            height={8}
                          />
                        </div>
                        {course.title}
                        <div className="shane-star2 mt-1">
                          <img
                            src="/images/yaming/index/star.png"
                            alt=""
                            width={8}
                            height={8}
                          />
                          <img
                            src="/images/yaming/index/Vector 25.png"
                            alt=""
                            width="180px"
                            height="1px"
                            style={{ margin: '0 -2px' }}
                          />
                          <img
                            src="/images/yaming/index/star.png"
                            alt=""
                            width={8}
                            height={8}
                          />
                        </div>
                      </button>
                    ))}
                  </h5>
                  <Link href="/course/courselist">
                    <div className="shane-detail">
                      <h5 className="mt-5">課程詳情</h5>
                      <img
                        src="/images/yaming/index/Frame 23.png"
                        alt=""
                        width={80}
                        height={16}
                      />
                    </div>
                  </Link>
                </div>
                <div className="col-12 col-md-6 shane-activity1">
                  <div className="shane-union d-flex justify-content-center align-items-center ms-5">
                    <div>
                      {courseData[selectedCourseIndex].video ? (
                        <video
                          src={courseData[selectedCourseIndex].video}
                          controls
                          autoPlay
                          muted
                          loop // 確保影片無限循環播放
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <img
                          src={courseData[selectedCourseIndex].image}
                          alt={courseData[selectedCourseIndex].title}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                      <h5 className="mt-3">
                        {courseData[selectedCourseIndex].title}
                      </h5>
                    </div>
                  </div>
                  <div className="shane-star">
                    <img
                      src="/images/yaming/index//star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index//Vector 25.png"
                      alt=""
                      width={300}
                      height="2px"
                      style={{ margin: '0 -2px' }}
                    />
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="shane-star mt-3 mb-5 mx-5">
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
              <img
                src="/images/yaming/index/Vector 25.png"
                alt=""
                width="100%"
                height="1px"
                style={{ margin: '0 -2px' }}
              />
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
            </div>
          </div>
          {/* 課程 */}
          {/* 文章部分 */}
          <div className="container">
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/上.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shane-wood mb-4" />
              <div className="h1 shane-store row text-center justify-content-center">
                文章
                <div className="shane-store p text-center ">Article</div>
              </div>
              <div className="shane-wood mb-4" />
            </div>
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/下.png"
                alt=""
                width={80}
                height={8}
              />
            </div>

            {/* 顯示動態加載的文章 */}
            {articles.slice(0, 2).map((article, index) => (
              <div className="row mt-5" key={article.id}>
                {index % 2 === 0 ? (
                  <>
                    {/* 左圖右文 */}

                    <div className="col-12 col-md-6 justify-content-center text-center shane-article px-3">
                      <img
                        src={`/images/article/articlelist/teaall/${article.article_images}`}
                        alt={article.title}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-12 col-md-6 justify-content-start mt-5 px-5 ">
                      <div className="shane-article">
                        <h2>{article.title}</h2>
                      </div>
                      <p className="mt-5 shane_index_p">{article.content}</p>
                      <div className="d-flex align-items-center mt-5 shane-article_morepage">
                        <Link href={`/article/${article.id}`}>
                          <p className="mt-3 pe-2 shane-store">更多頁面</p>
                        </Link>
                        <img
                          src="/images/yaming/index/更多頁面.png"
                          alt=""
                          width="100px"
                          height="12px"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 右圖左文 */}
                    <div className="col-12 col-md-6 justify-content-start mt-5 px-5 shane-article2">
                      <div className="shane-article2">
                        <h2>{article.title}</h2>
                      </div>
                      <p className="mt-5 shane_index_p">{article.content}</p>
                      <div className="d-flex align-items-center mt-5">
                        <Link href={`/article/${article.id}`}>
                          <p className="mt-3 pe-2 shane-store">更多頁面</p>
                        </Link>
                        <img
                          src="/images/yaming/index/更多頁面.png"
                          alt=""
                          width="100px"
                          height="12px"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 justify-content-center text-center shane-article2 px-3">
                      <img
                        src={`/images/article/articlelist/teaall/${article.article_images}`}
                        alt={article.title}
                        className="img-fluid"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="container mt-5 mb-5">
            <div className="shane-star mt-3 mb-5 px-5">
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
              <img
                src="/images/yaming/index/Vector 25.png"
                alt=""
                width="100%"
                height="1px"
                style={{ margin: '0 -2px' }}
              />
              <img
                src="/images/yaming/index/star.png"
                alt=""
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="contaier">
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/上.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="shane-wood  mb-4" />
              <div className="h1 shane-store row text-center justify-content-center">
                互動地圖
                <div className="shane-store p text-center ">map</div>
              </div>
              <div className="shane-wood  mb-4" />
            </div>
            <div className="d-flex justify-content-center mb-1">
              <img
                src="/images/yaming/index/下.png"
                alt=""
                width={80}
                height={8}
              />
            </div>
          </div>
          {/* 地圖 */}
          <MapComponent></MapComponent>
        </div>
      </div>
    </>
  )
}
