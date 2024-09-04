import { useState, useEffect, useRef } from 'react'
// import CreditCard from '@/hooks/use-creditcard'
export default function PayCard() {
  // const [testNumber, setTestNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expYear, setExpYear] = useState('')
  const [expMonth, setExpMonth] = useState('')
  const [cvv, setCvv] = useState('')
  const [showBack, setShowBack] = useState('')
  // 測試內容

  const cvvInputRef = useRef(null)
  const frontRef = useRef(null)
  const backRef = useRef(null)

  useEffect(() => {
    console.log(frontRef)
    const handleFocus = () => {
      if (frontRef.current && backRef.current) {
        frontRef.current.style.transform =
          'perspective(1000px) rotateY(-180deg)'
        backRef.current.style.transform = 'perspective(1000px) rotateY(0deg)'
      }
    }

    const handleBlur = () => {
      if (frontRef.current && backRef.current) {
        frontRef.current.style.transform = 'perspective(1000px) rotateY(0deg)'
        backRef.current.style.transform = 'perspective(1000px) rotateY(180deg)'
      }
    }

    const cvvInput = cvvInputRef.current
    if (cvvInput) {
      cvvInput.addEventListener('focus', handleFocus)
      cvvInput.addEventListener('blur', handleBlur)
    }

    return () => {
      if (cvvInput) {
        cvvInput.removeEventListener('focus', handleFocus)
        cvvInput.removeEventListener('blur', handleBlur)
      }
    }
  }, [])
  // 測試內容結束

  // const [showBack, setShowBack] = useState(false)
  // const [paymentOption, setPaymentOption] = useState('card')

  // const handleCardNumberChange = (e) => {
  //   let number = e.target.value.replace(/\s+/g, '')
  //   if (number.length > 16) {
  //     number = number.slice(0, 16)
  //   }
  //   const formattedNumber = number.replace(/(\d{4})(?=\d)/g, '$1 ')
  //   setCardNumber(formattedNumber)
  // }

  // const handleCardHolderChange = (e) => setCardHolder(e.target.value)
  // const handleExpMonthChange = (e) => setExpMonth(e.target.value)
  // const handleExpYearChange = (e) => setExpYear(e.target.value)
  // const handleCvvChange = (e) => setCvv(e.target.value)

  // const handleOptionChange = (e) => {
  //   setPaymentOption(e.target.value)
  // }

  return (
    <>
      {/* 信用卡部分 */}
      <div className="cardContainerAll  d-flex align-items-center  ">
        <form action="" className="CardForm h5">
          <div className="cardInputBox">
            <label htmlFor="cardNumberInput">Card Number</label>
            <input
              type="text"
              maxLength={19}
              className="cardNumberInput"
              name="cardNumber"
              id="cardNumberInput"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value)
              }}
            />
          </div>
          <div className="cardInputBox">
            <label htmlFor="">Card Holder</label>
            <input
              type="text"
              maxLength={19}
              className="cardHolderInput"
              id="cardHolderInput"
              name="cardHolder"
              value={cardHolder}
              onChange={(e) => {
                setCardHolder(e.target.value)
              }}
            />
          </div>
          <div className="CardflexBox">
            <div className="cardInputBox">
              <label htmlFor="">Expiration MM</label>
              <select
                name="expMonth"
                id="expMonth"
                className="monthInput"
                value={expMonth}
                onChange={(e) => {
                  setExpMonth(e.target.value)
                }}
              >
                <option value="month" selected disabled>
                  月
                </option>
                <option value={'01'}>01</option>
                <option value={'02'}>02</option>
                <option value={'03'}>03</option>
                <option value={'04'}>04</option>
                <option value={'05'}>05</option>
                <option value={'06'}>06</option>
                <option value={'07'}>07</option>
                <option value={'08'}>08</option>
                <option value={'09'}>09</option>
                <option value={'10'}>10</option>
                <option value={'11'}>11</option>
                <option value={'12'}>12</option>
              </select>
            </div>
            <div className="cardInputBox">
              <label htmlFor="">Expiration YY</label>
              <select
                name=""
                id=""
                className="yearInput"
                value={expYear}
                onChange={(e) => {
                  setExpYear(e.target.value)
                }}
              >
                <option value="Year" selected disabled>
                  年
                </option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
                <option value={2029}>2029</option>
                <option value={2030}>2030</option>
              </select>
            </div>
            <div className="cardInputBox">
              <label htmlFor="">CVV</label>
              <input
                ref={cvvInputRef}
                type="text"
                maxLength={4}
                className="cvvInput"
                onFocus={setShowBack}
              />
            </div>
          </div>
          <input type="submit" defaultValue="送出" className="submitBtn h5" />
        </form>
        <div className="cardContainer">
          <div ref={frontRef} className="front">
            <div className="cardContainerImage d-flex align-items-center justify-content-between">
              <img src="/images/cart/chip.png" alt="" />
              <img src="/images/cart/visa.png" alt="" />
            </div>
            <div className="cardContainerNumberBox h5">
              {cardNumber || '###############'}
            </div>
            <div className="CardContainerFlexBox CardContainerFlexBoxN1 h5">
              <div className="CardContainerFlexBoxN1 box">
                <span className="h5">{cardHolder || 'cardHolder'}</span>
                <div className="cardHolderName ">Full name</div>
              </div>
              <div className="box">
                <span className="h5">Expires</span>
                <div className="cardExpiration">
                  <span className="expMonth">{expMonth || 'mm'} </span>
                  <span className="expYear">{expYear || 'yy'}</span>
                </div>
              </div>
            </div>
          </div>
          <div ref={backRef} className="cartBack">
            <div className="stripe" />
            <div className="box">
              <span>cvv</span>
              <div className="cvvBox" />
              <img src="/images/cart/visa.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* 信用卡end */}
    </>
  )
}
