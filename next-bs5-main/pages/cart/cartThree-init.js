import React from 'react'
import { useState, useEffect } from 'react'
export default function CartThree() {
  function getOrderDetail() {}

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
            <h5 className="mt-2">訂單完成</h5>
          </div>
        </div>
        <div className="cartOk d-flex align-items-center flex-column">
          <div className="cartOkImg d-flex justify-content-center mb-4">
            <img src="/images/cart/ok,web.svg" alt="" />
          </div>
          <div className="cartOkContent ">
            <h2 className="text-center mb-6">完成訂單</h2>
            <h3 className="text-center mb-6">您的訂單編號為:00000000000</h3>
            <a href="" className="cartOk-Alink text-center h3">
              返回訂單列表
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
