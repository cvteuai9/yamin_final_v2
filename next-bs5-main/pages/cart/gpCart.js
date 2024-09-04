import { useState, useEffect, useRef } from 'react'
import PaymentForm from '@/components/cart/testCard-2'
import { YaminUseCart } from '@/hooks/yamin-use-cart'
import Cards from 'react-credit-cards-2'
import {
  formatCVC,
  formatExpirationDate,
  formatCreditCardNumber,
  formatFormData,
} from '@/hooks/cartCheckNumber'

export default function CartTwo() {
  const { cart, items, increment, decrement, removeItem } = YaminUseCart()
  const formRef = useRef(null)
  const showCard = useRef(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    delivery: '',
    address: '',
    note: '',
    payState: '',
    cardnumber: '',
    cardholder: '',
    cardexpiry: '',
    cvc: '',
  })
  const [state, setState] = useState({
    cardnumber: '',
    cardexpiry: '',
    cvc: '',
    cardholder: '',
    focus: '',
  })
  const [errors, setErrors] = useState({})
  const inputRefs = {
    username: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    delivery: useRef(null),
    address: useRef(null),
  }

  const handleCardPayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.remove('d-none')
      setFormData((prev) => ({ ...prev, payState: e.target.value }))
    }
  }

  const handleLinePayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.add('d-none')
    }
  }

  const handleGreenPayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.add('d-none')
    }
  }

  const handleInputChange = (evt) => {
    let { name, value } = evt.target
    let formattedValue = value

    if (name === 'cardnumber') {
      formattedValue = formatCreditCardNumber(value)
    } else if (name === 'cardexpiry') {
      formattedValue = formatExpirationDate(value)
    } else if (name === 'cvc') {
      formattedValue = formatCVC(value)
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    setState((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    let valid = true
    let newErrors = {}

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

    setErrors(newErrors)
    if (!valid) {
      const firstErrorField = Object.keys(newErrors)[0]
      inputRefs[firstErrorField]?.current?.focus()
    }
    return valid
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (validateForm()) {
      formRef.current.submit()
      console.log('表單提交成功', formData)
      // Perform form submission or additional actions here
    } else {
      console.log('表單提交失敗')
    }
  }

  return (
    <>
      <div className="container-fluid cart">
        <div className="CartTitle d-flex justify-content-center mb-5">
          <img src="/images/cart/Vector 20.svg" className="me-3" alt="" />
          <img src="/images/cart/商品title-center.svg" alt="" />
          <img src="/images/cart/Vector 20.svg" className="ms-3" alt="" />
        </div>
        <div className="CartProcess d-flex justify-content-center mb-6">
          <div className="CartProcess-test d-flex align-items-center flex-column">
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
          <div className="CartProcess-test d-flex align-items-center flex-column">
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
          <div className="CartProcess-test d-flex align-items-center flex-column">
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
          {items.length === 0 ? (
            <h1>購物車為空</h1>
          ) : (
            items.map((v) => (
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
                  <button className="btn cartBtn h5 cardTotalBtn" type="button">
                    {v.qty}
                  </button>
                </div>
                <div className="col-3 text-center colorWhite cartlistCol">
                  {v.subtotal}
                </div>
              </div>
            ))
          )}
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

        {/* 填寫資料start */}
        <h2 className="text-center mb-5">填寫資料</h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="formTest container-fluid px-4 pb-5"
        >
          <div className="row">
            <div className="col-12 col-md-6">
              <label htmlFor="username">姓名</label>
              <input
                ref={inputRefs.username}
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${
                  errors.username ? 'is-invalid' : ''
                }`}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="email">Email</label>
              <input
                ref={inputRefs.email}
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6">
              <label htmlFor="phone">電話</label>
              <input
                ref={inputRefs.phone}
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="delivery">配送方式</label>
              <select
                ref={inputRefs.delivery}
                name="delivery"
                id="delivery"
                value={formData.delivery}
                onChange={handleChange}
                className={`form-control ${
                  errors.delivery ? 'is-invalid' : ''
                }`}
              >
                <option value="">請選擇配送方式</option>
                <option value="express">快遞配送</option>
                <option value="standard">標準配送</option>
              </select>
              {errors.delivery && (
                <div className="invalid-feedback">{errors.delivery}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="address">配送地址</label>
              <textarea
                ref={inputRefs.address}
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="note">備註</label>
              <textarea
                name="note"
                id="note"
                value={formData.note}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="mt-4">
            <div>
              <input
                type="radio"
                id="cardPay"
                name="payState"
                value="credit"
                onChange={handleCardPayChange}
              />
              <label htmlFor="cardPay">信用卡付款</label>
            </div>
            <div>
              <input
                type="radio"
                id="linePay"
                name="payState"
                value="line"
                onChange={handleLinePayChange}
              />
              <label htmlFor="linePay">LinePay</label>
            </div>
            <div>
              <input
                type="radio"
                id="greenPay"
                name="payState"
                value="green"
                onChange={handleGreenPayChange}
              />
              <label htmlFor="greenPay">GreenPay</label>
            </div>
          </div>

          <div ref={showCard} className="credit-card-form d-none">
            <div className="credit-card-container d-flex justify-content-center align-items-center flex-column mt-4">
              <Cards
                number={state.cardnumber}
                name={state.cardholder}
                expiry={state.cardexpiry}
                cvc={state.cvc}
                focused={state.focus}
              />
              <div className="credit-card-inputs mt-4">
                <input
                  type="text"
                  name="cardnumber"
                  placeholder="卡號"
                  value={formData.cardnumber}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <input
                  type="text"
                  name="cardexpiry"
                  placeholder="到期日"
                  value={formData.cardexpiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <input
                  type="text"
                  name="cvc"
                  placeholder="CVC"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <input
                  type="text"
                  name="cardholder"
                  placeholder="持卡人姓名"
                  value={formData.cardholder}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            提交
          </button>
        </form>
        {/* 填寫資料end */}
      </div>
    </>
  )
}
