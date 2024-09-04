import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
export default function CartThree() {
  // lineconfirm
  const [orderUUid, setorderUUid] = useState('')
  const [cardPayOrderId, setCardPayOrderId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [result, setResult] = useState({
    info: '',
    returnCode: '',
    returnMessage: '',
  })
  // 確認交易，處理伺服器通知line pay已確認付款，為必要流程
  const handleConfirm = async (transactionId) => {
    console.log('now看', transactionId)
    const confirmUrl = `http://localhost:3005/api/yamin_cart/confirm?transactionId=${transactionId}`
    // const res = await fetch(confirmUrl, {
    //   method: 'GET',
    // })

    const res = await axiosInstance.get(
      `http://localhost:3005/api/yamin_cart/confirm?transactionId=${transactionId}`
    )

    console.log(res.data)
    if (res.data.status === 'fail') {
      window.location.href = 'http://localhost:3000/'
    }
    setorderUUid(res.data.data.info.packages[0].id)

    if (res.data.status === 'success') {
      toast.success('付款成功')
    } else {
      toast.error('付款失敗')
    }

    if (res.data.data) {
      setResult(res.data.data)
    }

    // 處理完畢，關閉載入狀態
    setIsLoading(false)
  }
  const cardHandleConfirm = async (orderId) => {
    console.log('信用卡支付', orderId)
    try{const apiUrl = new URL(`http://localhost:3005/api/yamin_cart/cardpay?orderId=${orderId}`)
      const res = await fetch(apiUrl)
      const data = await res.json()
      console.log('成功後的',data[0][0].order_uuid)
      setCardPayOrderId(data[0][0].order_uuid)
    }catch(err){

    }
  }
 useEffect(()=>{},[setCardPayOrderId])
  
  // confirm回來用的

  useEffect(() => {
    if (router.isReady) {
      // 這裡確保能得到router.query值
      console.log(router.query)
      // http://localhost:3000/order?transactionId=2022112800733496610&orderId=da3b7389-1525-40e0-a139-52ff02a350a8
      // 這裡要得到交易id，處理伺服器通知line pay已確認付款，為必要流程
      // TODO: 除非為不需登入的交易，為提高安全性應檢查是否為會員登入狀態
      const { transactionId, orderId } = router.query
      if(!transactionId && orderId){
        cardHandleConfirm(orderId)
      }
      // 如果沒有帶transactionId或orderId時，導向至首頁(或其它頁)
      if (!transactionId || !orderId) {
        // 關閉載入狀態
        setIsLoading(false)
        // 不繼續處理
        return
      }

      // 向server發送確認交易api
      handleConfirm(transactionId)
    }

    // eslint-disable-next-line
  }, [router.isReady])
  // lineconfirmEnd

  return (
    <>
      <div className="container-fluid cart">
        <div className="CartTitle d-flex justify-content-center mb-5 ">
          <img src="/images/cart/Vector 20.svg" className="me-3" alt="" />
          <img src="/images/cart/商品title-center.svg" alt="" />
          <img src="/images/cart/Vector 20.svg" className="ms-3" alt="" />
        </div>
        <div className="CartProcess d-flex justify-content-center mb-5 ">
          <div className="CartProcess-test d-flex align-items-center flex-column ">
            <img
              src="/images/cart/check1,state=default.svg"
              className="cartProcess"
              alt=""
            />
            <h5 className="mt-2">確認商品</h5>
          </div>
          <div className="CartProcess-test d-flex justify-content-center align-items-center flex-column px-3">
            <img src="/images/cart/Vector.svg" className="cartProcess" alt="" />
          </div>
          <div className="CartProcess-test d-flex align-items-center flex-column ">
            <img
              src="/images/cart/check2,state=default.svg"
              className="cartProcess"
              alt=""
            />
            <h5 className="mt-2">填寫資料</h5>
          </div>
          <div className="CartProcess-test d-flex justify-content-center align-items-center flex-column px-3">
            <img src="/images/cart/Vector.svg" className="cartProcess" alt="" />
          </div>
          <div className="CartProcess-test d-flex align-items-center flex-column ">
            <img
              src="/images/cart/check3,state=hover.svg"
              className="cartProcess"
              alt=""
            />
            <h5 className="mt-2">訂單成立</h5>
          </div>
        </div>
        <div className="cartOk d-flex align-items-center flex-column">
          <div className="cartOkImg d-flex justify-content-center mb-4">
            <img src="/images/cart/ok,web.svg" alt="" />
          </div>
          <div className="cartOkContent ">
            <h2 className="text-center mb-6">訂單成立</h2>
            <h2 className="text-center mb-6"> 訂單編號為:{orderUUid?orderUUid : cardPayOrderId}</h2>
            <Link
              className="cartOk-Alink text-center px-5 h3"
              href="http://localhost:3000/order"
            >
              返回訂單列表
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
