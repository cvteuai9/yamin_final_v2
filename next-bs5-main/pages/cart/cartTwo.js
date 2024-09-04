import React from 'react'

export default function CartTwo() {
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
          <div className=" h2 pe-2 ">
            <h5 className="text-end d-line-block my-5 colorWhite">總共3項</h5>
            <h5 className="text-end d-line-block colorWhite">總計:$3000</h5>
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
            <h5 className="text-end d-line-block my-5 colorWhite">總共3項</h5>
            <h5 className="text-end d-line-block colorWhite">總計:$3000</h5>
          </div>
        </div>
        {/* 課程end */}
        {/* 付款摘要 */}
        <h2 className="text-center mb-5">付款摘要</h2>
        <div className="cartSubTotalBor  py-5 mb-6  d-flex justify-content-center">
          <div className="cartSubTotal mb-5 h5  colorWhite">
            <div className=" cartSubTotal  d-flex justify-content-center mb-5">
              <h3>共3項目</h3>
            </div>
            <div className=" cartSubTotal d-flex justify-content-between mb-5">
              <h5 className="orderPay">總計:</h5>
              <h5>$3000</h5>
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
          <form action="" novalidate className="colorWhite CartformMdText">
            <div className="d-flex ">
              <div className="d-flex flex-column me-5 mb-5 ">
                <label htmlFor="" className="mb-4">
                  姓名
                </label>
                <input type="text" />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="" className="mb-4">
                  電話
                </label>
                <input type="text" />
              </div>
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-4">
                Email
              </label>
              <input type="email" className="w-100" />
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-4">
                配送方式
              </label>
              <select name="" id="">
                <option value="" se="">
                  宅配取貨
                </option>
              </select>
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-4">
                配送地址
              </label>
              <input type="text" className="w-100" />
            </div>
            <div className="d-flex flex-column  mb-5">
              <label htmlFor="" className="mb-3">
                配送備註
              </label>
              <input type="email" className="w-100" />
            </div>
          </form>
        </div>
        {/* 收件人資訊end */}
        {/* 付款資訊 */}
        <h2 className="text-center mb-5">付款資訊</h2>
        <div className="cartSubTotalBor mb-5 h5">
          <div className="cartGoBuyAllOption m-4">
            <div className="cartGoBuyOption mb-5">
              <input
                type="radio"
                id="cartBuy-card"
                name="card"
                className="cartBuyInput cartBuy-card"
              />
              <label htmlFor="">信用卡支付</label>
            </div>
            <div className="cartGoBuyOption mb-5">
              <input
                type="radio"
                id="cartBuy-linepay"
                name="card"
                className="cartBuyInput cartBuy-linepay"
              />
              <label htmlFor="">linepay</label>
            </div>
            <div className="cartGoBuyOption mb-5">
              <input
                type="radio"
                id="cartBuy-green"
                name="card"
                className="cartBuyInput cartBuy-green"
              />
              <label htmlFor="">綠界金流</label>
            </div>
          </div>
          {/* 信用卡部分 */}
          <div className="cardContainerAll d-none d-flex align-items-center  ">
            <form action="" className="CardForm h5">
              <div className="cardInputBox">
                <label htmlFor="">Card Number</label>
                <input type="text" maxLength={19} className="cardNumberInput" />
              </div>
              <div className="cardInputBox">
                <label htmlFor="">Card Holder</label>
                <input type="text" maxLength={19} className="cardHolderInput" />
              </div>
              <div className="CardflexBox">
                <div className="cardInputBox">
                  <label htmlFor="">Expiration MM</label>
                  <select name="" id="" className="monthInput">
                    <option value="month" selected="" disabled="">
                      月
                    </option>
                    <option value={1}>01</option>
                    <option value={2}>02</option>
                    <option value={3}>03</option>
                    <option value={4}>04</option>
                    <option value={5}>05</option>
                    <option value={6}>06</option>
                    <option value={7}>07</option>
                    <option value={8}>08</option>
                    <option value={9}>09</option>
                    <option value={10}>10</option>
                    <option value={11}>11</option>
                    <option value={12}>12</option>
                  </select>
                </div>
                <div className="cardInputBox">
                  <label htmlFor="">Expiration YY</label>
                  <select name="" id="" className="yearInput">
                    <option value="month" selected="" disabled="">
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
                  <input type="text" maxLength={4} className="cvvInput" />
                </div>
              </div>
              <input
                type="submit"
                defaultValue="送出"
                className="submitBtn h5"
              />
            </form>
            <div className="cardContainer">
              <div className="front">
                <div className="cardContainerImage d-flex align-items-center justify-content-between">
                  <img src="../images/chip.png" alt="" />
                  <img src="../images/visa.png" alt="" />
                </div>
                <div className="cardContainerNumberBox h5">
                  ################
                </div>
                <div className="CardContainerFlexBox CardContainerFlexBoxN1 h5">
                  <div className="CardContainerFlexBoxN1 box">
                    <span className="h5">Card holder</span>
                    <div className="cardHolderName ">Full name</div>
                  </div>
                  <div className="box">
                    <span className="h5">Expires</span>
                    <div className="cardExpiration">
                      <span className="expMonth">mm</span>
                      <span className="expYear">yy</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cartBack">
                <div className="stripe" />
                <div className="box">
                  <span>cvv</span>
                  <div className="cvvBox" />
                  <img src="../images/visa.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          {/* 信用卡end */}
        </div>
        {/* 付款資訊end */}
        <div className="text-center">
          <button type="button" className="h5  goNextBtn">
            送出
          </button>
        </div>
      </div>
    </>
  )
}
