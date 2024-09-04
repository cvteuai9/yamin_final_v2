import { useState, useEffect } from 'react'
import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'
export default function OrderTwoOneList() {
  const [orderDetail, setOrderDetail] = useState([])
  const [productTotalPrice, setProductTotalPrice] = useState([])
  const [productAmount, setProductAmount] = useState([])
  const [courseTotalPrice, setCourseTotalPrice] = useState([])
  const [courseAmount, setCourseAmount] = useState([])
  const [allAmount, setAllAmount] = useState()
  const [allTotalPrice, setAllTotalPrice] = useState()
  const [discount, setDiscount] = useState()
  const [afterDiscount, setAfterDiscount] = useState()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  // const [init]
  useEffect(() => {
    if (typeof window !== 'undefined') {
      CheckOrderDetail()
    }
  }, [])
  useEffect(() => {}, [
    orderDetail,
    productTotalPrice,
    productAmount,
    courseTotalPrice,
    courseAmount,
    allAmount,
    allTotalPrice,
    discount,
    afterDiscount,
  ])
  if (!hydrated) {
    return null
  }
  async function CheckOrderDetail() {
    try {
      const params = new URLSearchParams(window.location.search)
      const orderId = params.get('orderId')
      console.log('看res值', orderId)
      const apiUrl = new URL('http://localhost:3005/api/yamin_order/orderId')
      let searchParams = new URLSearchParams({
        orderId: orderId,
      })

      apiUrl.search = searchParams
      const res = await fetch(apiUrl)
      const data = await res.json()
      console.log('打印', data)
      console.log('打印打印', data[0][0].total_price)
      console.log('打印打印', data[0][0].coupon_discount)
      setDiscount(data[0][0].coupon_discount)
      setAfterDiscount(data[0][0].total_price)
      setOrderDetail(data)
      const goCourseAmount = data[1].reduce((acc, v) => {
        const amount = v.course_quantity
        return acc + amount
      }, 0)
      const goCoursetotalPrice = data[1].reduce((acc, v) => {
        const totalPrice = v.course_totalprice
        return acc + totalPrice
      }, 0)
      const goProductAmount = data[2].reduce((acc, v) => {
        const amount = v.product_quantity
        return acc + amount
      }, 0)
      const goProductTotalPrice = data[2].reduce((acc, v) => {
        const totalPrice = v.product_totalprice
        return acc + totalPrice
      }, 0)
      const goAllAmount = goCourseAmount + goProductAmount
      const goAllTotalPrice = goProductTotalPrice + goCoursetotalPrice
      setCourseTotalPrice(goCoursetotalPrice)
      setCourseAmount(goCourseAmount)
      setProductAmount(goProductAmount)
      setProductTotalPrice(goProductTotalPrice)
      setAllAmount(goAllAmount)
      setAllTotalPrice(goAllTotalPrice)
      console.log('測試總數量', testData)
      // const orderId = parseInt(orderId)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="container-fluid order">
        {/* 會員中心Title */}
        <div className="userTitle LiaoUserTitleMd w-100  mb-6">
          <img
            src="/images/cart/userTItle.svg"
            alt=""
            className="d-block mx-auto"
          />
        </div>
        {/* 會員中心Title End */}
        <div className="orderColRow row">
          <div className="orderCol orderColLeft col-4">
            <Leftnav fromOrder="fromOrder" />
          </div>
          {/* 訂單狀態部分 */}
          <div className="orderCol orderStateCol col-8">
            <div className="orderColH3 w-100">
              <Link
                href="http://localhost:3000/order"
                className="mb-3 orderBack"
              >
                <i className="fa-solid fa-left-long" />
              </Link>
              <h3 className="mb-3">訂單狀態</h3>
            </div>
            <div className="orderState w-100 mb-6">
              <div className="orderStateRow text-center row">
                <div className="col-3">
                  <h3>訂單成立</h3>
                  <h5 className="orderStateTextMargin">(待店家出貨)</h5>
                  <div className="orderStateImg">
                    <img src="/images/cart/orderOk,state=hover.svg" alt="" />
                  </div>
                </div>
                <div className="col-2">
                  <h3 className="orderStateMargin ">已出貨</h3>
                  <div className="orderStateImg">
                    <img src="/images/cart/truck,state=default.svg" alt="" />
                  </div>
                </div>
                <div className="col-2">
                  <h3 className="orderStateMargin ">已到貨</h3>
                  <div className="orderStateImg">
                    <img src="/images/cart/Arrived,state=default.svg" alt="" />
                  </div>
                </div>
                <div className="col-2">
                  <h3 className="orderStateMargin ">已取貨</h3>
                  <div className="orderStateImg">
                    <img src="/images/cart/box,state=default.svg" alt="" />
                  </div>
                </div>
                <div className="col-3">
                  <h3 className="orderStateMargin ">完成訂單</h3>
                  <div className="orderStateImg">
                    <img src="/images/cart/star,state=default.svg" alt="" />
                  </div>
                </div>
              </div>
            </div>
            {/* 訂單商品 */}
            <h2 className="text-center mb-5 orderProductH2">商品</h2>
            <div className="tableBor p-5 mb-6">
              <div className="row cartlistBor h5">
                <div className="col-2 text-center colorWhite">圖片</div>
                <div className="col-4 text-center colorWhite">名稱</div>
                <div className="col-2 text-center colorWhite">單價</div>
                <div className="col-1 text-center colorWhite">數量</div>
                <div className="col-2 text-center colorWhite">小計</div>
                <div className="col-1 text-center colorWhite">評價</div>
              </div>
              {Array.isArray(orderDetail[2]) &&
                orderDetail[2].map((v, i) => {
                  return (
                    <div key={v.id} className="row cartlistBor h5">
                      <div className="col-2 text-center colorWhite py-4">
                        <img
                          src={`/images/product/list1/products-images/${v.product_image}`}
                          className="orderCartImg"
                          alt=""
                        />
                      </div>
                      <div className="col-4 text-center colorWhite cartlistCol">
                        {v.product_name}
                      </div>
                      <div className="col-2 text-center colorWhite cartlistCol">
                        {v.product_unitprice}
                      </div>
                      <div className="col-1 text-center colorWhite cartlistCol">
                        <button
                          className="btn cartBtn  h5 cardTotalBtn"
                          type="button"
                        >
                          {v.product_quantity}
                        </button>
                      </div>
                      <div className="col-2 text-center colorWhite cartlistCol">
                        {v.product_totalprice}
                      </div>
                      <div className="col-1 text-center colorWhite cartlistCol">
                        <button type="button" className="orderProductBtnDone">
                          <i className="fa-regular fa-pen-to-square" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              {/* 390的list */}
              {Array.isArray(orderDetail[2]) &&
                orderDetail[2].map((v, i) => {
                  return (
                    <div key={v.id} className="row cartlistBorMd h5">
                      <div className="col-3 text-center colorWhite">
                        <img
                          src={`/images/product/list1/products-images/${v.product_image}`}
                          alt=""
                        />
                      </div>
                      <div className="col-8 ps-4  colorWhite">
                        <p style={{ marginLeft: '6px' }}>{v.product_name}</p>
                        <p style={{ marginLeft: '6px' }}>
                          單價:{v.product_unitprice}
                        </p>
                        <p style={{ marginLeft: '6px' }}>
                          總價:{v.product_totalprice}
                        </p>
                        <div className="CartListBtnMdBox">
                          <button
                            className="btn cartBtn  h5 cardTotalBtn"
                            type="button"
                          >
                            {v.product_quantity}
                          </button>
                        </div>
                      </div>
                      <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
                        <button type="button" className="orderProductBtnDone">
                          <i className="fa-regular fa-pen-to-square" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              {/* <div className="row cartlistBorMd h5">
                <div className="col-3 text-center colorWhite">
                  <img src="/images/cart/image_0001.jpg" alt="" />
                </div>
                <div className="col-8 ps-4  colorWhite">
                  <p>精品原葉丨三峽碧螺 40g–精裝盒</p>
                  <p>$1000</p>
                  <div className="CartListBtnMdBox">
                    <button
                      className="btn cartBtn  h5 cardTotalBtn"
                      type="button"
                    >
                      $1000
                    </button>
                  </div>
                </div>
                <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
                  <button type="button" className="orderProductBtnDone">
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                </div>
              </div> */}
              {/* 390的list end */}
              <div className=" h2 pe-2 ">
                <h5 className="text-end d-line-block my-5 colorWhite">
                  總共
                  {productAmount}項
                </h5>
                <h5 className="text-end d-line-block colorWhite">
                  總計:$
                  {productTotalPrice}
                </h5>
              </div>
            </div>
            {/* 訂單商品end */}
            {/* 課程 */}
            <h2 className="text-center mb-5 orderProductH2">課程</h2>
            <div className="tableBor p-5 mb-6">
              <div className="row cartlistBor h5">
                <div className="col-2 text-center colorWhite">圖片</div>
                <div className="col-4 text-center colorWhite">名稱</div>
                <div className="col-2 text-center colorWhite">單價</div>
                <div className="col-1 text-center colorWhite">數量</div>
                <div className="col-2 text-center colorWhite">小計</div>
                <div className="col-1 text-center colorWhite">評價</div>
              </div>
              {Array.isArray(orderDetail[1]) &&
                orderDetail[1].map((v, i) => {
                  return (
                    <div key={v.id} className="row cartlistBor h5">
                      <div className="col-2 text-center colorWhite py-4">
                        <img
                          src={`/images/yaming/tea_class_picture/${v.course_image}`}
                          className="orderCartImg"
                          alt=""
                        />
                      </div>
                      <div className="col-4 text-center colorWhite cartlistCol">
                        {v.course_name}
                      </div>
                      <div className="col-2 text-center colorWhite cartlistCol">
                        {v.course_unitprice}
                      </div>
                      <div className="col-1 text-center colorWhite cartlistCol">
                        <button
                          className="btn cartBtn  h5 cardTotalBtn"
                          type="button"
                        >
                          {v.course_quantity}
                        </button>
                      </div>
                      <div className="col-2 text-center colorWhite cartlistCol">
                        {v.course_totalprice}
                      </div>
                      <div className="col-1 text-center colorWhite cartlistCol">
                        <button type="button" className="orderProductBtnDone">
                          <i className="fa-regular fa-pen-to-square" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              {/* 390的list */}
              {Array.isArray(orderDetail[1]) &&
                orderDetail[1].map((v, i) => {
                  return (
                    <div key={v.id} className="row cartlistBorMd h5">
                      <div className="col-3 text-center colorWhite">
                        <img
                          src={`/images/yaming/tea_class_picture/${v.course_image}`}
                          alt=""
                        />
                      </div>
                      <div className="col-8 ps-4  colorWhite">
                        <p style={{ marginLeft: '6px' }}>{v.course_name}</p>
                        <p style={{ marginLeft: '6px' }}>
                          單價:{v.course_unitprice}
                        </p>
                        <p style={{ marginLeft: '6px' }}>
                          總價:{v.course_totalprice}
                        </p>
                        <div className="CartListBtnMdBox">
                          <button
                            className="btn cartBtn  h5 cardTotalBtn"
                            type="button"
                          >
                            {v.course_quantity}
                          </button>
                        </div>
                      </div>
                      <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
                        <button type="button" className="orderProductBtnDone">
                          <i className="fa-regular fa-pen-to-square" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              {/* <div className="row cartlistBorMd h5">
                <div className="col-3 text-center colorWhite">
                  <img src="/images/cart/image_0001.jpg" alt="" />
                </div>
                <div className="col-8 ps-4  colorWhite">
                  <p>精品原葉丨三峽碧螺 40g–精裝盒</p>
                  <p>$1000</p>
                  <div className="CartListBtnMdBox">
                    <button
                      className="btn cartBtn  h5 cardTotalBtn"
                      type="button"
                    >
                      $1000
                    </button>
                  </div>
                </div>
                <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
                  <button type="button" className="orderProductBtnDone">
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                </div>
              </div> */}
              {/* 390的list end */}
              <div className=" h2 pe-2 ">
                <h5 className="text-end d-line-block my-5 colorWhite">
                  總共
                  {courseAmount}項
                </h5>
                <h5 className="text-end d-line-block colorWhite">
                  總計:${courseTotalPrice}
                </h5>
              </div>
            </div>
            {/* 課程end */}
            {/* 訂單資訊 */}
            <h2 className="text-center mb-5 orderProductH2 ">訂單資訊</h2>
            {Array.isArray(orderDetail[0]) &&
              orderDetail[0].map((v) => {
                return (
                  <div key={v.id} className="orderDetailRow row mb-6">
                    <div className="orderDetailCol col-6 mb-5 ">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl orderPeName">姓名</h5>
                        <h5>{v.username}</h5>
                      </div>
                    </div>
                    <div className="orderDetailCol col-6 mb-5">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl orderDetailBoxMlList">
                          電話
                        </h5>
                        <h5>{v.phone}</h5>
                      </div>
                    </div>
                    <div className="orderDetailCol col-6 mb-5 ">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl orderPeEmail orderDetailBoxMlList">
                          E-mail
                        </h5>
                        <h5>{v.email}</h5>
                      </div>
                    </div>
                    <div className="orderDetailCol col-6 mb-5 ">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl orderDetailBoxMlList">
                          付款方式
                        </h5>
                        {v.pay_state === 'linepay' ? (
                          <h5>linepay</h5>
                        ) : (
                          <h5 className="d-none"></h5>
                        )}
                        {v.pay_state === 'cardpay' ? (
                          <h5>信用卡/金融卡</h5>
                        ) : (
                          <h5 className="d-none"></h5>
                        )}
                        {v.pay_state === 'ecpay' ? (
                          <h5>綠界</h5>
                        ) : (
                          <h5 className="d-none"></h5>
                        )}
                      </div>
                    </div>
                    <div className="orderDetailCol col-12 mb-5 ">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl orderDetailBoxMlList">
                          配送方式
                        </h5>
                        <h5>{v.delivery}</h5>
                      </div>
                    </div>
                    <div className="orderDetailCol col-12 mb-5 ">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl orderDetailBoxMlList ">
                          配送地址
                        </h5>
                        <h5>{v.address}</h5>
                      </div>
                    </div>
                    <div className="orderDetailCol col-12 mb-5 ">
                      <div className="orderDetailList d-flex ">
                        <h5 className="orderDetailBoxMl  orderDetailBoxMlList  orderDetailLastBoxMl ">
                          備註
                        </h5>
                        <h5>{v.note}</h5>
                      </div>
                    </div>
                  </div>
                )
              })}
            {/* 訂單資訊end */}
            {/* 付款摘要 */}
            <h2 className="text-center mb-5 orderProductH2">付款摘要</h2>
            <div className="cartSubTotalBor InOrderSubTotal py-5 mb-6 pe-3 d-flex justify-content-center">
              <div className="cartSubTotal  mb-5 h5  colorWhite">
                <div className=" cartSubTotal  d-flex justify-content-center mb-5">
                  <h3>共{allAmount}項目</h3>
                </div>
                <div className=" cartSubTotal d-flex justify-content-start mb-5">
                  <h5 className="orderPay">總計:</h5>
                  <h5>${allTotalPrice}</h5>
                </div>
                <div className=" cartSubTotal d-flex justify-content-between mb-5">
                  <h5 className="me-5">優惠券折抵:</h5>
                  <h5>
                    {discount ? (
                      discount < 1 ? (
                        <h5>{discount * 100}折</h5>
                      ) : (
                        <h5>${discount}</h5>
                      )
                    ) : (
                      <h5>$0</h5>
                    )}
                  </h5>
                </div>
                <div className=" cartSubTotal d-flex justify-content-between ">
                  <h5 className="me-5">應付金額:</h5>
                  <h5>${afterDiscount}</h5>
                </div>
              </div>
            </div>
            {/* 付款摘要end */}
          </div>
          {/* 歷史訂單部分 end*/}
        </div>
      </div>
    </>
  )
}
