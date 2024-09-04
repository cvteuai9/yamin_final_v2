import { useState, useEffect, useRef } from 'react'
import PaymentForm from '@/components/cart/testCard-2'
import { YaminUseCart } from '@/hooks/yamin-use-cart'
import { YaminCourseUseCart } from '@/hooks/yamin-use-Course-cart'
import Cards from 'react-credit-cards-2'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/my-use-auth'
import { useShip711StoreOpener } from '@/hooks/use-ship-711-store'
import axiosInstance from '@/services/axios-instance'
import Swal from 'sweetalert2'
import {
  formatCVC,
  formatExpirationDate,
  formatCreditCardNumber,
  formatFormData,
} from '@/hooks/cartCheckNumber'
export default function CartTwo() {
  const [userID, setUserId] = useState(0)
  const { auth } = useAuth()
  const [options, setOptions] = useState([])
  const [userCoupons, setUserCoupons] = useState([])
  const [cardPayInsertId, setCardPayInsertId] = useState(0)
  useEffect(() => {
    setUserId(auth.userData.id)
  }, [auth])
  useEffect(() => {
    // console.log('123', userID)
    getUserCoupon(userID)
  }, [userID])
  useEffect(() => {}, [cardPayInsertId])
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    'http://localhost:3005/api/shipment/711',
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  )
  const { cart, items, increment, decrement, removeItem } = YaminUseCart()
  const { selectedValue, setSelectedValue, selectedId, setSelectedId } =
    YaminUseCart()
  const courseCart = YaminCourseUseCart()
  // let testLocl = JSON.parse(localStorage.getItem('cart'))
  const router = useRouter()
  const formRef = useRef(null)
  const form2Re2 = useRef(null)
  // const [selectedValue, setSelectValue] = YaminCoupon()
  const [formData, setFormData] = useState({
    // productId: getlocl,
    amount: '',
    totalPrice: '',
    userId: '',
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
    state: 1,
  })
  // confirm回來用的，在記錄確認之後，line-pay回傳訊息與代碼，例如
  // {returnCode: '1172', returnMessage: 'Existing same orderId.'}

  async function getUserCoupon(userID) {
    const url = new URL('http://localhost:3005/api/yamin_cart/cart/coupon')
    console.log('拿個id', userID)
    let searchParams = new URLSearchParams({
      user_id: userID,
    })
    url.search = searchParams
    const res = await fetch(url)
    const couponResult = await res.json()
    setUserCoupons(couponResult)
    console.log(couponResult)
    const fetchOptions = async () => {
      const fetchedOptions = couponResult.map((v) => {
        return v
      })
      setOptions(fetchedOptions)
    }
    fetchOptions()
  }

  const allTotalItems = cart.totalItems + courseCart.cart.totalItems
  const allTotalPrice = cart.totalPrice + courseCart.cart.totalPrice
  useEffect(() => {
    const updatedFormData = { ...formData }
    const allTotalItems = cart.totalItems + courseCart.cart.totalItems
    let allTotalPrice = cart.totalPrice + courseCart.cart.totalPrice
    if (selectedValue < 1) {
      allTotalPrice = Math.floor(Number(selectedValue) * allTotalPrice)
    }
    if (selectedValue > 1) {
      allTotalPrice = allTotalPrice - Number(selectedValue)
    }
    if (!selectedValue) {
      allTotalPrice = cart.totalPrice + courseCart.cart.totalPrice
    }
    updatedFormData.userId = userID
    updatedFormData.amount = allTotalItems
    updatedFormData.totalPrice = allTotalPrice
    updatedFormData.selectedValue = Number(selectedValue)
    updatedFormData.selectedCouponId = Number(selectedId)
    setFormData(updatedFormData)
    console.log('需要看', formData)
    // formData.amount = allTotalItems
    // formData.totalPrice = allTotalPrice
  }, [
    allTotalItems,
    allTotalPrice,
    cart.totalItems,
    cart.totalPrice,
    selectedValue,
    userID,
    selectedId,
    store711.storename,
  ])
  // 信用卡部分
  // 測試
  const showCard = useRef(null)
  // 測試結束
  const [state, setState] = useState({
    cardnumber: '',
    cardexpiry: '',
    cvc: '',
    cardholder: '',
    focus: '',
  })
  // 載入狀態(控制是否顯示載入中的訊息，和伺服器回傳時間點未完成不同步的呈現問題)

  const PostformData = new FormData()
  let getorderId
  useEffect(() => {}, [getorderId])
  const goLinePay = () => {
    // if (window.confirm('確認要導向至LINE Pay進行付款?')) {
    //   // 先連到node伺服器後，導向至LINE Pay付款頁面
    //   window.location.href = `http://localhost:3005/api/yamin_cart/linepay?orderId=${getorderId}`
    // }
    Swal.fire({
      title: '確認要導向至LINE Pay進行付款?',
      text: '確認將導向到LINE Pay進行付款',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '確認成功!',
          text: '即將導向Line Pay!',
          icon: 'success',
        })
      }
      window.location.href = `http://localhost:3005/api/yamin_cart/linepay?orderId=${getorderId}`
    })
  }
  const gocardPay = (cardPayId) => {
    console.log('我的cardpay', cardPayId)
    window.location.href = `http://localhost:3000/cart/cartThree?orderId=${cardPayId}`
  }
  const handleCardPayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.remove('d-none')
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleLinePayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.add('d-none')
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleGreenPayChange = (e) => {
    if (e.target.checked) {
      showCard.current.classList.add('d-none')
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleInputChange = (evt) => {
    let { name, value } = evt.target
    let formattedValue = value

    if (name === 'cardnumber') {
      evt.target.value = formatCreditCardNumber(evt.target.value)
    } else if (name === 'cardexpiry') {
      evt.target.value = formatExpirationDate(evt.target.value)
    } else if (name === 'cvc') {
      evt.target.value = formatCVC(evt.target.value)
    }
    // const updateState = { ...state, [name]: formattedValue }
    setFormData({ ...formData, [name]: value })
    setState((prev) => ({ ...prev, [name]: evt.target.value }))
    console.log(formData)
  }

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }))
  }
  //信用卡end
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
    if (formData.delivery === '超商取貨') {
      console.log('取貨', formData.delivery)
    }
    setFormData({ ...formData, [name]: value })

    console.log('111', formData)
    console.log('222', userID)
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

    setErrors(newErrors)
    if (!valid) {
      const firstErrorField = Object.keys(newErrors)[0]
      inputRefs[firstErrorField]?.current?.focus()
    }
    return valid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // formRef.current.submit()
    if (validateForm()) {
      PostformData.append('username', formData.username)
      PostformData.append('email', formData.email)
      PostformData.append('phone', formData.phone)
      PostformData.append('delivery', formData.delivery)
      if (formData.delivery === '超商取貨') {
        console.log('超商地址')
        PostformData.append('address', store711.storeaddress)
      }
      if (formData.delivery === '宅配取貨') {
        console.log('一般地址')
        PostformData.append('address', formData.address)
      }

      PostformData.append('note', formData.note)
      PostformData.append('payState', formData.payState)
      PostformData.append('cardnumber', formData.cardnumber)
      PostformData.append('cardholder', formData.cardholder)
      PostformData.append('cardexpiry', formData.cardexpiry)
      PostformData.append('cvc', formData.cvc)
      PostformData.append('amount', formData.amount)
      PostformData.append('totalPrice', formData.totalPrice)
      PostformData.append('userId', formData.userId)
      PostformData.append('cartItem', cart)
      PostformData.append('selectedCouponId', formData.selectedCouponId)
      PostformData.append('selectedValue', formData.selectedValue)
      items.forEach((item) => {
        console.log('我現在要看的', item)
        PostformData.append(
          `items[${item.id}][product_name]`,
          item.product_name
        )

        PostformData.append('PproductId', [{ productId: item.id }])
        PostformData.append(`productId[${item.id}]`, `productId[${item.id}]`)
        // PostformData.append(`items[${item.id}][price]`, item.price)
        // PostformData.append(`items[${item.id}][qty]`, item.qty)
        PostformData.append(`items[${item.id}][subtotal]`, item.subtotal)
      })
      const orderData = items.map((v) => ({
        product_id: v.id,
        product_image: v.paths,
        product_name: v.product_name,
        product_unitprice: v.price,
        product_qty: v.qty,
        product_totalprice: v.subtotal,
      }))
      const courseData = courseCart.items.map((v) => ({
        course_id: v.id,
        course_image: v.img1,
        course_name: v.name,
        course_unitprice: v.price,
        course_quantity: v.qty,
        course_totalprice: v.subtotal,
      }))
      console.log('1153看', orderData)
      // console.log(cartItems)
      PostformData.append('allProductId', JSON.stringify(orderData))
      PostformData.append('allCourseId', JSON.stringify(courseData))
      PostformData.append('state', formData.state)

      for (const [key, value] of PostformData.entries()) {
        console.log('123', (PostformData[key] = value))
      }
      // linepay測試
      if (formData.payState === 'linepay') {
        const url = 'http://localhost:3005/api/yamin_cart/linepay'
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(PostformData),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log('testurl', url)
            console.log('success', result)
            getorderId = result.goLineurl
            // window.location.href = result.lineUrl
          })
          .catch((error) => {
            console.error(error)
          })
        const sendUrl = new URL(
          'http://localhost:3005/api/yamin_cart/linepay/send'
        )
        try {
          const res = await fetch(sendUrl, {
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
            },
            body: PostformData,
          })
          const data = await res.json()
          console.log(data)
        } catch (err) {
          console.log(err)
        }
        // const goLineUrl = result.goLineurl
        goLinePay()
      }

      // linepay測試內容結束
      if (formData.payState === 'cardpay') {
        const url = 'http://localhost:3005/api/yamin_cart'
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(PostformData),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log('testurl', url)
            console.log('success', result)
            setCardPayInsertId(result.insertId)
            gocardPay(result.insertId)
          })
          .catch((error) => {
            console.error(error)
          })
        const sendUrl = new URL('http://localhost:3005/api/yamin_cart/send')
        try {
          const res = await fetch(sendUrl, {
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
            },
            body: PostformData,
          })
          const data = await res.json()
          console.log(data)
        } catch (err) {
          console.log(err)
        }
        console.log('取得', PostformData.get('username'))
        console.log('信用卡表單提交成功', formData)
      }

      // Perform form submission or additional actions here
    } else {
      console.log('表單提交失敗')
    }

    // router.push('http://localhost:3000/cart/cartThree')
    localStorage.removeItem('cart')
    localStorage.removeItem('courseCart')
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

          {items.length === 0 ? (
            <div className="checkCart">
              <h1>購物車為空</h1>
            </div>
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
            <div className="checkCartMd">
              <h1>購物車為空</h1>
            </div>
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
          {courseCart.items.length === 0 ? (
            <div className="checkCart">
              <h1>課程購物車為空</h1>
            </div>
          ) : (
            courseCart.items.map((v) => {
              return (
                <div key={v.id} className="row cartlistBor h5">
                  <div className="col-2 text-center colorWhite py-4">
                    <img
                      src={`/images/yaming/tea_class_picture/${v.img1}`}
                      alt=""
                    />
                  </div>
                  <div className="col-4 text-center colorWhite cartlistCol">
                    {v.name}
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
          {courseCart.items.length === 0 ? (
            <div className="checkCartMd">
              <h1>課程購物車為空</h1>
            </div>
          ) : (
            courseCart.items.map((v) => {
              return (
                <div key={v.id} className="row cartlistBorMd h5">
                  <div className="col-3 text-center colorWhite">
                    <img
                      src={`/images/yaming/tea_class_picture/${v.img1}`}
                      alt=""
                    />
                  </div>
                  <div className="col-8 ps-4  colorWhite">
                    <p style={{ marginLeft: '6px' }}>{v.name}</p>
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
          {/* <div className="row cartlistBorMd h5">
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
          </div> */}
          {/* 390的list end */}
          <div className=" h2 pe-2  ">
            <h5 className="text-end d-line-block my-5 colorWhite">
              總共{courseCart.cart.totalItems}項
            </h5>
            <h5 className="text-end d-line-block colorWhite">
              總計:${courseCart.cart.totalPrice}
            </h5>
          </div>
        </div>
        {/* 課程end */}
        {/* 付款摘要 */}
        <h2 className="text-center mb-5">付款摘要</h2>
        <div className="cartSubTotalBor  py-5 mb-6  d-flex justify-content-center">
          <div className="cartSubTotal mb-5 h5  colorWhite">
            <div className=" cartSubTotal  d-flex justify-content-center mb-5">
              <h3>共{cart.totalItems + courseCart.cart.totalItems}項目</h3>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5 className="orderPay">總計:</h5>
              <h5>${cart.totalPrice + courseCart.cart.totalPrice}</h5>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5 className="me-5">優惠券折抵:</h5>
              {/* <h5>{${selectedValue}}</h5> */}
              {selectedValue ? (
                selectedValue < 1 ? (
                  <h5>{selectedValue * 100}折</h5>
                ) : (
                  <h5>${selectedValue}</h5>
                )
              ) : (
                <h5>$0</h5>
              )}
            </div>
            <div className=" cartSubTotal d-flex justify-content-between ">
              <h5 className="me-5">應付金額:</h5>
              {selectedValue ? (
                selectedValue < 1 ? (
                  <h5>
                    {Math.floor(
                      Number(selectedValue) *
                        (cart.totalPrice + courseCart.cart.totalPrice)
                    )}
                  </h5>
                ) : (
                  <h5>
                    {cart.totalPrice +
                      courseCart.cart.totalPrice -
                      Number(selectedValue)}
                  </h5>
                )
              ) : (
                <h5>{cart.totalPrice + courseCart.cart.totalPrice}</h5>
              )}
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
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary2)',
                }}
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
                style={{
                  color: 'var(--primary2)',
                }}
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
            {formData.delivery === '超商取貨' ? (
              <div className="d-flex flex-column  mb-5">
                <button
                  type="button"
                  className="mb-5"
                  onClick={() => {
                    openWindow()
                  }}
                >
                  選擇門市
                </button>
                <label>選擇門市</label>
                <input type="text" value={store711.storename} disabled />
                <label htmlFor="" className="mb-4">
                  配送地址
                </label>
                <input
                  type="text"
                  className="w-100"
                  name="address"
                  value={store711.storeaddress}
                  ref={inputRefs.address}
                  onChange={handleChange}
                />
                {errors.address && (
                  <div className="error-message">{errors.address}</div>
                )}
              </div>
            ) : (
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
            )}
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
        {/* 信用卡 */}

        <div className="cartSubTotalBor mb-5 h5">
          <div className="cartGoBuyAllOption m-4">
            <div className="cartGoBuyOption mb-5">
              <input
                type="radio"
                id="cartBuy-card"
                name="payState"
                value="cardpay"
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
                value="linepay"
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
            <div className="CardForm h5">
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
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                  />
                </div>
              </div>
            </div>
            <div className="cardContainer">
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

        {/* 信用卡end */}
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
