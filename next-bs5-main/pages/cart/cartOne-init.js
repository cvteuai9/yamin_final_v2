import { useState, useEffect } from 'react'
import { YaminUseCart } from '@/hooks/yamin-use-cart'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'

// // {
//   cartItems = [],
//   handleIncrease = () => {},
//   handleDecrease = () => {},
//   handleRemove = () => {},
//   totalQty,
//   totalPrice,
// }
export default function CardOne() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return null
  }

  const { cart, items, increment, decrement, removeItem } = YaminUseCart()

  const CartMySwal = withReactContent(Swal)

  const CartNotifyAndRemove = (productName, productId) => {
    CartMySwal.fire({
      title: '您確定嗎?',
      text: productName + '將被移除',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: '取消',
      confirmButtonText: '確定刪除!',
    }).then((result) => {
      if (result.isConfirmed) {
        CartMySwal.fire({
          title: '已刪除!',
          text: productName + '已成功刪除',
          icon: 'success',
        })
        removeItem(productId)
      }
    })
  }
  const router = useRouter()
  function handleSubmit() {
    router.push('http://localhost:3000/cart/cartTwoTest')
  }

  return (
    <>
      <div className="container-fluid cart ">
        <div className="CartTitle d-flex justify-content-center mb-5 ">
          <img src="/images/cart/Vector 20.svg" className="me-3" alt="" />
          <img src="/images/cart/商品title-center.svg" alt="" />
          <img src="/images/cart/Vector 20.svg" className="me-3" alt="" />
        </div>
        <div className="CartProcess d-flex justify-content-center mb-6 ">
          <div className="CartProcess-test d-flex align-items-center flex-column ">
            <img
              src="/images/cart/check1,state=hover.svg"
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
            <div className="col-2 text-center colorWhite">小計</div>
            <div className="col-1 text-center colorWhite">移除</div>
          </div>
          {/* itemsMap開始 */}
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
                      className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep"
                      type="button"
                      onClick={() => {
                        // 先計算(預計)按了按鈕後，商品數量會變為多少
                        const nextQty = v.qty - 1
                        // 如果按了後商品數量<=0 ，進行移除
                        if (nextQty <= 0) {
                          // if (confirm('你確定要移除此商品?')) {
                          //   handleRemove(v.id)
                          // }
                          CartNotifyAndRemove(v.product_name, v.id)
                        } else {
                          decrement(v.id)
                        }
                      }}
                    >
                      -
                    </button>
                    <button
                      className="btn cartBtn  h5 cardTotalBtn"
                      type="button"
                    >
                      {v.qty}
                    </button>
                    <button
                      className="btn cartBtn h5 cardTotalBtn cartListBtnMdAdd"
                      type="button"
                      onClick={() => {
                        increment(v.id)
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="col-2 text-center colorWhite cartlistCol">
                    {v.subtotal}
                  </div>
                  <div className="col-1 text-center  colorWhite cartlistCol">
                    <button
                      type="button"
                      className="trashBtn cartBtn"
                      onClick={() => {
                        // if (confirm('你確定要移除此商品?')) {
                        //   handleRemove(v.id)
                        // }
                        CartNotifyAndRemove(v.product_name, v.id)
                      }}
                    >
                      <i className="fa-solid fa-trash-can colorWhite p-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
          {/* itemsMap end */}
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite py-4">
              <img src="/images/cart/image_0001.jpg" alt="" />
            </div>
            <div className="col-4 text-center colorWhite cartlistCol Gotext">
              精品原葉丨三峽碧螺 40g–精裝盒
            </div>
            <div className="col-2 text-center colorWhite cartlistCol">1000</div>
            <div className="col-1 text-center colorWhite cartlistCol">
              <button
                className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep"
                type="button"
              >
                -
              </button>
              <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                1000
              </button>
              <button
                className="btn cartBtn h5 cardTotalBtn cartListBtnMdAdd"
                type="button"
              >
                +
              </button>
            </div>
            <div className="col-2 text-center colorWhite cartlistCol">1000</div>
            <div className="col-1 text-center  colorWhite cartlistCol">
              <button type="button" className="trashBtn cartBtn">
                <i className="fa-solid fa-trash-can colorWhite p-3" />
              </button>
            </div>
          </div>

          {/* 390Map */}
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
                        className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep"
                        type="button"
                        onClick={() => {
                          // 先計算(預計)按了按鈕後，商品數量會變為多少
                          const nextQty = v.qty - 1
                          // 如果按了後商品數量<=0 ，進行移除
                          if (nextQty <= 0) {
                            // if (confirm('你確定要移除此商品?')) {
                            //   handleRemove(v.id)
                            // }
                            CartNotifyAndRemove(v.product_name, v.id)
                          } else {
                            decrement(v.id)
                          }
                        }}
                      >
                        -
                      </button>
                      <button
                        className="btn cartBtn  h5 cardTotalBtn"
                        type="button"
                      >
                        {v.qty}
                      </button>
                      <button
                        className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep"
                        type="button"
                        onClick={() => {
                          increment(v.id)
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
                    <button
                      type="button"
                      className=" trashBtn cartBtn"
                      onClick={() => {
                        // if (confirm('你確定要移除此商品?')) {
                        //   handleRemove(v.id)
                        // }
                        CartNotifyAndRemove(v.product_name, v.id)
                      }}
                    >
                      <i className="fa-solid fa-trash-can colorWhite " />
                    </button>
                  </div>
                </div>
              )
            })
          )}

          {/* 390Map end */}

          {/* 390的list */}
          <div className="row cartlistBorMd h5">
            <div className="col-3 text-center colorWhite">
              <img src="/images/cart/image_0001.jpg" alt="" />
            </div>
            <div className="col-8 ps-4  colorWhite">
              <p>精品原葉丨三峽碧螺 40g–精裝盒</p>
              <p>$1000</p>
              <div className="CartListBtnMdBox">
                <button className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep">
                  -
                </button>
                <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                  1000
                </button>
                <button className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep">
                  +
                </button>
              </div>
            </div>
            <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
              <button type="button" className=" trashBtn cartBtn">
                <i className="fa-solid fa-trash-can colorWhite " />
              </button>
            </div>
          </div>
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
        {/* 商品end */}
        {/* 課程start */}
        <h2 className="text-center mb-5">課程</h2>
        <div className="tableBor p-5 mb-6">
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite">圖片</div>
            <div className="col-4 text-center colorWhite">名稱</div>
            <div className="col-2 text-center colorWhite">單價</div>
            <div className="col-1 text-center colorWhite">數量</div>
            <div className="col-2 text-center colorWhite">小計</div>
            <div className="col-1 text-center colorWhite">移除</div>
          </div>
          <div className="row cartlistBor h5">
            <div className="col-2 text-center colorWhite py-4">
              <img src="/images/cart/image_0001.jpg" alt="" />
            </div>
            <div className=" col-4 text-center colorWhite cartlistCol">
              精品原葉丨三峽碧螺 40g–精裝盒
            </div>
            <div className="col-2 text-center colorWhite cartlistCol">1000</div>
            <div className="col-1 text-center colorWhite cartlistCol">
              <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                -
              </button>
              <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                1000
              </button>
              <button className="btn cartBtn h5 cardTotalBtn" type="button">
                +
              </button>
            </div>
            <div className="col-2 text-center colorWhite cartlistCol">1000</div>
            <div className="col-1 text-center  colorWhite cartlistCol">
              <button type="button" className="trashBtn cartBtn">
                <i className="fa-solid fa-trash-can colorWhite p-3" />
              </button>
            </div>
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
                <button className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep">
                  -
                </button>
                <button className="btn cartBtn  h5 cardTotalBtn" type="button">
                  1000
                </button>
                <button className="btn cartBtn h5 cardTotalBtn cartListBtnMdPrep">
                  +
                </button>
              </div>
            </div>
            <div className="trashBoxMd col-1 colorWhite d-flex justify-content-end align-ltems-end">
              <button type="button" className=" trashBtn cartBtn">
                <i className="fa-solid fa-trash-can colorWhite " />
              </button>
            </div>
          </div>
          {/* 390的list end */}
          <div className=" h2 pe-2 ">
            <h5 className="text-end d-line-block my-5 colorWhite">總共3項</h5>
            <h5 className="text-end d-line-block colorWhite">總計:$3000</h5>
          </div>
        </div>
        {/* 課程end */}
        {/* 付款摘要 */}
        <h2 className="text-center mb-5">付款摘要</h2>
        <div className="cartSubTotalBor py-5 mb-5 d-flex justify-content-center">
          <div className="cartSubTotal mb-5 h5  colorWhite">
            <select name="" id="" className="cartSelect h5 mb-5">
              <option value={1000}>優惠券選擇</option>
            </select>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5>總計:</h5>
              <h5>$3000</h5>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5>優惠券折抵:</h5>
              <h5>$3000</h5>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between ">
              <h5>應付金額:</h5>
              <h5>$3000</h5>
            </div>
          </div>
        </div>
        {/* 付款摘要end */}
        <div className="text-center">
          <button
            type="button"
            className="h5  goNextBtn"
            onClick={handleSubmit}
          >
            下一步
          </button>
        </div>
      </div>
    </>
  )
}
