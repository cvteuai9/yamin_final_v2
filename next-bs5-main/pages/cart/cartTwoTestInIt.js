import { useState, useEffect, useRef } from 'react'
import PaymentForm from '@/components/cart/testCard-2'
import { YaminUseCart } from '@/hooks/yamin-use-cart'
export default function CartTwo() {
  const { cart, items, increment, decrement, removeItem } = YaminUseCart()
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    delivery: '',
    address: '',
    note: '',
  })

  const [errors, setErrors] = useState({})
  const inputRefs = {
    username: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    delivery: useRef(null),
    address: useRef(null),
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    let valid = true
    let newErrors = {}

    // Custom validation logic
    if (!formData.username) {
      newErrors.username = '姓名是必填项'
      valid = false
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '請輸入有效的email'
      valid = false
    }
    if (!formData.phone) {
      newErrors.phone = '電話是必填項'
      valid = false
    }
    if (!formData.delivery) {
      newErrors.delivery = '請選擇配送方式'
      valid = false
    }
    if (!formData.address) {
      newErrors.address = '配送地址是必填項'
      valid = false
    }

    // 信用卡資料驗證
    if (!formData.cardNumber) {
      newErrors.cardNumber = '卡號是必填項'
      valid = false
    }
    if (!formData.cardHolder) {
      newErrors.cardHolder = '持卡人姓名是必填項'
      valid = false
    }
    if (!formData.expireDate) {
      newErrors.expireDate = '到期日期是必填項'
      valid = false
    }

    setErrors(newErrors)
    if (!valid) {
      const firstErrorField = Object.keys(newErrors)[0]
      inputRefs[firstErrorField]?.current?.focus()
    }
    return valid
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // formRef.current.submit()
    if (validateForm()) {
      formRef.current.submit()
      console.log('表單提交成功', formData)

      // Perform form submission or additional actions here
    } else {
      console.log('表單提交失敗')
    }
  }

  // test

  // testend
  let testTotal
  let testQty
  return (
    <>
      <div className="container-fluid cart ">
        <div className="CartTitle d-flex justify-content-center mb-5 ">
          <img src="/images/cart/Vector 20.svg" className="me-3" alt="" />
          <img src="/images/cart/商品title-center.svg" alt="" />
          <img src="/images/cart/Vector 20.svg" className="ms-3" alt="" />
        </div>
        <div className="CartProcess d-flex justify-content-center mb-6 ">
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
              src="/images/cart/check2,state=hover.svg"
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
              src="/images/cart/check3,state=default.svg"
              className="cartProcess"
              alt=""
            />
            <h5 className="mt-2">訂單完成</h5>
          </div>
        </div>
        {/* 商品start */}
        <h2 className="text-center mb-5">商品</h2>
        <div className="tableBor p-5 mb-6">
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite">圖片</div>
            <div className="col-4 text-center colorWhite">名稱</div>
            <div className="col-2 text-center colorWhite">單價</div>
            <div className="col-1 text-center colorWhite">數量</div>
            <div className="col-3 text-center colorWhite">小計</div>
          </div>
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite py-4">
              <img src="/images/cart/image_0001.jpg" alt="" />
            </div>
            <div className="col-4 text-center colorWhite cartlistCol Gotext">
              精品原葉丨三峽碧螺 40g–精裝盒
            </div>
            <div className="col-2 text-center colorWhite cartlistCol">1000</div>
            <div className="col-1 text-center colorWhite cartlistCol">
              <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                $1000
              </button>
            </div>
            <div className="col-3 text-center colorWhite cartlistCol">1000</div>
          </div>

          {items.length === 0 ? (
            <h1>購物車為空</h1>
          ) : (
            items.map((v, i) => {
              return (
                <div key={v.id} className="row cartlistBor h5">
                  <div className="col-2 text-center colorWhite py-4">
                    <img
                      src={`/images/product/list1/products-images/${v.paths}`}
                      alt=""
                    />
                  </div>
                  <div className="col-4 text-center colorWhite cartlistCol Gotext">
                    {v.product_name}
                  </div>
                  <div className="col-2 text-center colorWhite cartlistCol">
                    {v.price}
                  </div>
                  <div className="col-1 text-center colorWhite cartlistCol">
                    <button
                      className="btn cartBtn  h5 cardTotalBtn"
                      type="button"
                    >
                      {v.qty}
                    </button>
                  </div>
                  <div className="col-3 text-center colorWhite cartlistCol">
                    {v.subtotal}
                  </div>
                </div>
              )
            })
          )}
          {/* 390的list */}
          {items.length === 0 ? (
            <h1>購物車為空</h1>
          ) : (
            items.map((v, i) => {
              return (
                <div key={v.id} className="row cartlistBorMd h5">
                  <div className="col-3 text-center colorWhite">
                    <img
                      src={`/images/product/list1/products-images/${v.paths}`}
                      alt=""
                    />
                  </div>
                  <div className="col-8 ps-4  colorWhite">
                    <p style={{ marginLeft: '6px' }}>{v.product_name}</p>
                    <p style={{ marginLeft: '6px' }}>單價:{v.price}</p>
                    <p style={{ marginLeft: '6px' }}>總價:{v.subtotal}</p>
                    <div className="CartListBtnMdBox">
                      <button
                        className="btn cartBtn  h5 cardTotalBtn"
                        type="button"
                      >
                        <p>數量:{v.qty}</p>
                      </button>
                    </div>
                  </div>
                  <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end"></div>
                </div>
              )
            })
          )}
          {/* 390的list end */}
          <div className=" h2 pe-2 ">
            <h5 className="text-end d-line-block my-5 colorWhite">
              總共{cart.totalItems}項
            </h5>
            <h5 className="text-end d-line-block colorWhite">
              總計:${cart.totalPrice}
            </h5>
          </div>
        </div>
        {/* 商品end */}
        {/* 課程start */}
        <h2 className="text-center mb-5">課程</h2>
        <div className="tableBor p-5 mb-6">
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite">圖片</div>
            <div className="col-4 text-center colorWhite">名稱</div>
            <div className="col-2 text-center colorWhite">單價</div>
            <div className="col-1 text-center colorWhite">數量</div>
            <div className="col-3 text-center colorWhite">小計</div>
          </div>
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite py-4">
              <img src="/images/cart/image_0001.jpg" alt="" />
            </div>
            <div className="col-4 text-center colorWhite cartlistCol">
              精品原葉丨三峽碧螺 40g–精裝盒
            </div>
            <div className="col-2 text-center colorWhite cartlistCol">1000</div>
            <div className="col-1 text-center colorWhite cartlistCol">
              <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                $1000
              </button>
            </div>
            <div className="col-3 text-center colorWhite cartlistCol">1000</div>
          </div>
          {/* 390的list */}
          <div className="row cartlistBorMd h5">
            <div className="col-3 text-center colorWhite">
              <img src="/images/cart/image_0001.jpg" alt="" />
            </div>
            <div className="col-8 ps-4  colorWhite">
              <p>精品原葉丨三峽碧螺 40g–精裝盒</p>
              <p>$1000</p>
              <div className="CartListBtnMdBox">
                <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                  $1000
                </button>
              </div>
            </div>
            <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end"></div>
          </div>
          {/* 390的list end */}
          <div className=" h2 pe-2  ">
            <h5 className="text-end d-line-block my-5 colorWhite">總共項</h5>
            <h5 className="text-end d-line-block colorWhite">總計:$3000</h5>
          </div>
        </div>
        {/* 課程end */}
        {/* 付款摘要 */}
        <h2 className="text-center mb-5">付款摘要</h2>
        <div className="cartSubTotalBor  py-5 mb-6  d-flex justify-content-center">
          <div className="cartSubTotal mb-5 h5  colorWhite">
            <div className=" cartSubTotal  d-flex justify-content-center mb-5">
              <h3>共{cart.totalItems}項目</h3>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5 className="orderPay">總計:</h5>
              <h5>${cart.totalPrice}</h5>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5 className="me-5">優惠券折抵:</h5>
              <h5>$3000</h5>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between ">
              <h5 className="me-5">應付金額:</h5>
              <h5>$3000</h5>
            </div>
          </div>
        </div>
        {/* 付款摘要end */}
        {/* 收件人資訊 */}
        <h2 className="text-center mb-5">收件人資訊</h2>
        <div className="cartSubTotalBor py-5 mb-6 d-flex justify-content-center h5 cartInput-2">
          <form
            ref={formRef}
            action=""
            id="myFrom"
            className="colorWhite CartformMdText"
          >
            <div className="d-flex ">
              <div className="d-flex flex-column me-5 mb-5 ">
                <label htmlFor="" className="mb-4">
                  姓名
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  ref={inputRefs.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="error-message">{errors.username}</div>
                )}
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="" className="mb-4">
                  電話
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  ref={inputRefs.phone}
                  required
                />
                {errors.phone && (
                  <div className="error-message">{errors.phone}</div>
                )}
              </div>
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-4">
                Email
              </label>
              <input
                type="email"
                className="w-100"
                name="email"
                value={formData.email}
                ref={inputRefs.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="delivery" className="mb-4">
                配送方式
              </label>
              <select
                name="delivery"
                id="delivery"
                value={formData.delivery}
                ref={inputRefs.delivery}
                onChange={handleChange}
              >
                <option value="" disabled>
                  請選擇取貨方式
                </option>
                <option value="宅配取貨">宅配取貨</option>
                <option value="超商取貨">超商取貨</option>
              </select>
              {errors.delivery && (
                <div className="error-message">{errors.delivery}</div>
              )}
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-4">
                配送地址
              </label>
              <input
                type="text"
                className="w-100"
                name="address"
                value={formData.address}
                ref={inputRefs.address}
                onChange={handleChange}
              />
              {errors.address && (
                <div className="error-message">{errors.address}</div>
              )}
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-3">
                配送備註
              </label>
              <input
                type="text"
                className="w-100"
                name="note"
                value={formData.note}
                ref={inputRefs.note}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
        {/* 收件人資訊end */}
        {/* 付款資訊 */}
        <h2 className="text-center mb-5">付款資訊</h2>
        <PaymentForm></PaymentForm>
        {/* 付款資訊end */}
        <div className="text-center">
          <button
            type="button"
            className="h5  goNextBtn"
            onClick={handleSubmit}
          >
            送出
          </button>
        </div>
      </div>
    </>
  )
}
