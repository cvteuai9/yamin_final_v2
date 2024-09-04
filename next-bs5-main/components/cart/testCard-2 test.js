import React, { useState, useRef, useEffect } from 'react'
import Cards from 'react-credit-cards-2'
import {
  formatCVC,
  formatExpirationDate,
  formatCreditCardNumber,
  formatFormData,
} from '@/hooks/cartCheckNumber'

const PaymentForm = ({ formData = {}, handleChange }) => {
  // 測試
  const showCard = useRef(null)
  // 測試結束
  const [state, setState] = useState({
    cardnumber: formData.cardNumber || '',
    cardexpiry: formData.expireDate || '',
    cvc: formData.cvc || '',
    cardholder: formData.cardHolder || '',
    focus: '',
  })

  const handleCardPayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.remove('d-none')
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
    const updateState = { ...state, [name]: formattedValue }
    setState(updateState)
    handleChange(evt)
  }

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }))
  }

  return (
    <div className="cartSubTotalBor mb-5 h5">
      <div className="cartGoBuyAllOption m-4">
        <div className="cartGoBuyOption mb-5">
          <input
            type="radio"
            id="cartBuy-card"
            name="payState"
            value="cardPay"
            className="cartBuyInput cartBuy-card"
            onChange={handleCardPayChange}
          />
          <label htmlFor="">信用卡支付</label>
        </div>
        <div className="cartGoBuyOption mb-5">
          <input
            type="radio"
            id="cartBuy-linepay"
            name="payState"
            value="line"
            className="cartBuyInput cartBuy-linepay"
            onChange={handleLinePayChange}
          />
          <label htmlFor="">linepay</label>
        </div>
        <div className="cartGoBuyOption mb-5">
          <input
            type="radio"
            id="cartBuy-green"
            name="payState"
            value="ecpay"
            className="cartBuyInput cartBuy-green"
            onChange={handleGreenPayChange}
          />
          <label htmlFor="">綠界金流</label>
        </div>
      </div>

      <div
        ref={showCard}
        className="cardContainerAll d-none d-flex align-items-center  "
      >
        <form action="" className="CardForm h5">
          <div className="cardInputBox">
            <label htmlFor="">卡號</label>
            <input
              type="tel"
              name="cardnumber"
              maxLength={22}
              pattern="[\d| ]{16,22}"
              className="cardNumberInput"
              value={state.cardnumber}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="cardInputBox">
            <label htmlFor="">姓名</label>
            <input
              type="text"
              name="cardholder"
              maxLength={19}
              className="cardHolderInput"
              value={state.cardholder}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="CardflexBox">
            <div className="cardInputBox">
              <label htmlFor="">Expiration MM</label>
              <input
                type="tel"
                name="cardexpiry"
                className="form-control"
                placeholder="Valid Thru"
                pattern="\d\d/\d\d"
                required
                value={state.cardexpiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="monthInput"
              />
            </div>

            <div className="cardInputBox">
              <label htmlFor="">CVV</label>
              <input
                type="text"
                name="cvc"
                maxLength={4}
                className="cvvInput"
                pattern="\d{3,4}"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
        </form>
        <div class="cardContainer">
          <Cards
            number={state.cardnumber}
            expiry={state.cardexpiry}
            cvc={state.cvc}
            name={state.cardholder}
            focused={state.focus}
          />
        </div>
      </div>
    </div>
  )
}

export default PaymentForm
