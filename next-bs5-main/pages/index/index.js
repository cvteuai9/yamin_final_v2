import React, { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick'
import Link from 'next/link'
import Viewpager from '@/components/course/index_course'

export default function Yaming() {
  const [products, setProducts] = useState([])

  const getProducts = async () => {
    const apiURL = `http://localhost:3005/api/my_index`

    const res = await fetch(apiURL)
    const data = await res.json()
    console.log(data)
    setProducts(data)
  }
  useEffect(() => {
    getProducts()
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
                  <div className="shane-star mt-5">
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index/Vector 25.png"
                      alt=""
                      width="227px"
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
                  <h5 className="mt-3 mb-3">茶文化與歷史課程</h5>
                  <div className="shane-star">
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index/Vector 25.png"
                      alt=""
                      width="227px"
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
                  <h5 className="mt-3 mb-3">茶文化與歷史課程</h5>
                  <div className="shane-star">
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index/Vector 25.png"
                      alt=""
                      width="227px"
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
                  <h5 className="mt-3 mb-3">茶文化與歷史課程</h5>
                  <div className="shane-star">
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index/Vector 25.png"
                      alt=""
                      width="227px"
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
                  <h5 className="mt-3 mb-3">茶文化與歷史課程</h5>
                  <div className="shane-star">
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index/Vector 25.png"
                      alt=""
                      width="227px"
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
                  <h5 className="mt-3 mb-3">茶文化與歷史課程</h5>
                  <div className="shane-star">
                    <img
                      src="/images/yaming/index/star.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <img
                      src="/images/yaming/index/Vector 25.png"
                      alt=""
                      width="227px"
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
                    <img
                      src="/images/yaming/index/Union.png"
                      alt=""
                      width={230}
                      height={324}
                    />
                    <div className="shane-union2">
                      <img
                        src="/images/yaming/index/Union2.png"
                        alt=""
                        width={295}
                        height={440}
                      />
                    </div>
                  </div>
                  <h5>茶文化與歷史課程</h5>
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
          {/* 文章 */}
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
              <div className="shane-wood  mb-4" />
              <div className="h1 shane-store row text-center justify-content-center">
                文章
                <div className="shane-store p text-center ">store</div>
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
            <div className="row mt-5">
              <div className="col-12 col-md-6 justify-content-center text-center shane-article px-3">
                <img src="/images/yaming/index/Rectangle 7.png" alt="" />
              </div>
              <div className="col-12 col-md-6 justify-content-start mt-5 px-5 shane-article2">
                <div className="shane-article">
                  <h2>茶文化</h2>
                </div>
                <p className="mt-5">
                  臺灣是世界馳名的茶葉產區，對一般消費者而言茶葉專業品評用語又生澀難懂。風味輪就像是一種索引工具，藉由圖形化和既定詞彙的協助，讓品飲者方便聯想，去描述出他所品嚐到的風味，而不是憑空去想像，建立茶葉愛好者與專業評鑑人員間的共通用語。
                </p>
                <div className="d-flex align-items-center mt-5 shane-article_morepage">
                  <p className="mt-3 pe-2">更多頁面</p>
                  <img
                    src="/images/yaming/index/更多頁面.png"
                    alt=""
                    width="100px"
                    height="12px"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-5 shane-artitlce-disappear-992">
              <div className="col-12 col-md-6 justify-content-center mt-5 px-5 shane-article2  shane-article_morepage">
                <div className="shane-article2 ">
                  <h2>茶文化</h2>
                </div>
                <p className="mt-5">
                  臺灣是世界馳名的茶葉產區，對一般消費者而言茶葉專業品評用語又生澀難懂。風味輪就像是一種索引工具，藉由圖形化和既定詞彙的協助，讓品飲者方便聯想，去描述出他所品嚐到的風味，而不是憑空去想像，建立茶葉愛好者與專業評鑑人員間的共通用語。
                </p>
                <div className="d-flex align-items-center mt-5 ">
                  <p className="mt-3 pe-2">更多頁面</p>
                  <img
                    src="/images/yaming/index/更多頁面.png"
                    alt=""
                    width="100px"
                    height="12px"
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 justify-content-center text-center shane-article  px-3 ">
                <img src="/images/yaming/index/Rectangle 7.png" alt="" />
              </div>
            </div>
          </div>
          {/* 文章 */}
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
                地圖
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
        </div>
      </div>
    </>
  )
}
