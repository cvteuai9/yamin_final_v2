import React, { useEffect, useState } from 'react'
import Leftnav from '@/components/member/left-nav'
import { useAuth } from '@/hooks/my-use-auth'
export default function OrderOne() {
  const { auth } = useAuth()
  const [userID, setUserId] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  const [orderDetail, setOrderDetail] = useState([])
  useEffect(() => {
    setUserId(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  useEffect(() => {
    if (userID !== 0 && isAuth) {
      getOrderDetails(userID)
    }
  }, [userID, isAuth])
  async function getOrderDetails(userID) {
    try {
      const apiUrl = new URL('http://localhost:3005/api/yamin_order')
      let searchParams = new URLSearchParams({
        user_id: userID,
      })
      apiUrl.search = searchParams

      const res = await fetch(apiUrl)
      const data = await res.json()
      setOrderDetail(data)
      // console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  async function CheckOrderDetail(orderId, orderState) {
    try {
      const apiUrl = new URL('http://localhost:3005/api/yamin_order/orderId')
      let searchParams = new URLSearchParams({
        orderId: orderId,
        orderState: orderState,
      })

      apiUrl.search = searchParams
      const res = await fetch(apiUrl)
      const data = await res.json()
      orderId = parseInt(orderId)
      switch (orderState) {
        case 1:
          console.log('看switch', orderState)
          window.location.href = `http://localhost:3000/order/orderTwoOneList?orderId=${orderId}`
          break
        case 2:
          console.log('看switch', orderState)
          window.location.href = `http://localhost:3000/order/orderTwoTwoList?orderId=${orderId}`
          break
        case 3:
          console.log('看switch', orderState)
          window.location.href = `http://localhost:3000/order/orderTwoThreeList?orderId=${orderId}`
          break
        case 4:
          console.log('看switch', orderState)
          window.location.href = `http://localhost:3000/order/orderTwoFourList?orderId=${orderId}`
          break
        case 5:
          console.log('看switch', orderState)
          window.location.href = `http://localhost:3000/order/orderTwoFiveList?orderId=${orderId}`
          break
      }
    } catch (err) {
      console.log(err)
    }
  }

  console.log(orderDetail)
  return (
    <>
      <div className="container-fluid order">
        {/* 會員中心Title */}
        <div className="LiaoUserTitleMd w-100  mb-6">
          <img
            src="/images/cart/userTItle.svg"
            alt=""
            className="d-block mx-auto"
          />
          <img
            src="/images/favorite/group.svg"
            alt=""
            style={{ width: '100%' }}
          />
        </div>
        {/* 會員中心Title End */}
        <div className="orderColRow row">
          <div className="orderCol orderColLeft col-4">
            <Leftnav fromOrder="fromOrder" />
          </div>
          {/* 歷史訂單部分 */}
          <div className="orderCol orderColRight col-8">
            <div className="orderColH3 orderTitleMd orderTitle w-100 mb-3">
              <h3>首頁 / 會員 / 訂單</h3>
            </div>
            <div className="orderColH3 orderTitle mb-3 w-100">
              <h3>歷史訂單</h3>
            </div>
            <div className="orderlistRow mb-3 row">
              <div className="orderListCol col-3">
                <h5>訂單編號</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>訂單日期</h5>
              </div>
              <div className="orderListCol col-2">
                <h5>總價</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>訂單狀態</h5>
              </div>
              <div className="orderListCol col-1"></div>
            </div>
            {/* <div className="orderlistRow mb-3 row">
              <div className="orderListCol col-3">
                <h5>3131231231</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>2000/1/1</h5>
              </div>
              <div className="orderListCol col-2">
                <h5>100000</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>完成訂單</h5>
              </div>
              <div className="orderListCol col-1">
                <h5 className="">
                  <button className="orderListBtn">
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                </h5>
              </div>
            </div> */}
            {/* <div className="orderlistRow mb-3 row">
              <div className="orderListCol col-3">
                <h5>3131231231</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>2000/1/1</h5>
              </div>
              <div className="orderListCol col-2">
                <h5>100000</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>完成訂單</h5>
              </div>
              <div className="orderListCol col-1">
                <h5 className="">
                  <button className="orderListBtn">
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                </h5>
              </div>
            </div> */}
            {/* <div className="orderlistRow mb-3 row">
              <div className="orderListCol col-3">
                <h5>3131231231</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>2000/1/1</h5>
              </div>
              <div className="orderListCol col-2">
                <h5>100000</h5>
              </div>
              <div className="orderListCol col-3">
                <h5>完成訂單</h5>
              </div>
              <div className="orderListCol col-1">
                <h5 className="">
                  <button className="orderListBtn">
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                </h5>
              </div>
            </div> */}
            {orderDetail.map((v, i) => {
              let stateString = ``
              switch (v.state) {
                case 1:
                  stateString = '訂單成立'
                  break
                case 2:
                  stateString = '已出貨'
                  break
                case 3:
                  stateString = '已到貨'
                  break
                case 4:
                  stateString = '已取貨'
                  break
                case 5:
                  stateString = '完成訂單'
                  break
              }
              return (
                <div key={v.id} className="orderlistRow mb-3 row">
                  <div className="orderListCol col-3">
                    <h5>{v.order_uuid}</h5>
                  </div>
                  <div className="orderListCol col-3">
                    <h5>{v.created_at}</h5>
                  </div>
                  <div className="orderListCol col-2">
                    <h5>{v.total_price}</h5>
                  </div>
                  <div className="orderListCol col-2">
                    <h5>{stateString}</h5>
                  </div>
                  <div className="orderListCol  col-2">
                    <h5 className="" style={{ textAlign: 'center' }}>
                      <button
                        className="orderListBtn"
                        onClick={() => {
                          CheckOrderDetail(v.id, v.state)
                        }}
                      >
                        <i className="fa-solid fa-magnifying-glass" />
                      </button>
                    </h5>
                  </div>
                </div>
              )
            })}
          </div>
          {/* 歷史訂單部分 end*/}
        </div>
      </div>
    </>
  )
}
