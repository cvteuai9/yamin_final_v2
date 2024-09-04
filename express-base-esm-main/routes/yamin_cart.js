import express from 'express'
import db from '#configs/mysql.js'
// import Yamin_order from '##/models/Yamin_order.js'
const router = express.Router()
import { Op, UUIDV4 } from 'sequelize'
import sequelize from '#configs/db.js'
import moment from 'moment'
import authenticate from '../middlewares/authenticate.js'
import { v4 as uuidv4 } from 'uuid'
import transporter from '#configs/mail.js'
import 'dotenv/config.js'
// import { result } from 'lodash'
import multer from 'multer'
const upload = multer()
const { YaminOrder, YaminOrderDetail } = sequelize.models

// line pay使用npm套件
import { createLinePayClient } from 'line-pay-merchant'
// 存取`.env`設定檔案使用
import 'dotenv/config.js'
// 定義安全的私鑰字串
const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
})
let testline
let LinePayOrder
let reservation
let linePayResponse
let LineOrderInsertId
let linePayState
let orderinsertId
/* GET home page. */
router.use(express.json())
router.get('/cart/coupon', async (req, res) => {
  try {
    const Copuser_id = req.query.user_id || 0
    console.log('使用者id', Copuser_id)
    let GetUserCouponSQL =
      'SELECT coupons.* , uc.* FROM users_coupons uc JOIN coupons ON coupons.id = uc.coupon_id WHERE user_id=? AND uc.status=?'
    const testCouSql = await db.query(
      GetUserCouponSQL,
      [Copuser_id, 'unused'],
      (err, result) => {
        if (err) {
          res.json(err)
        }
        if (result) {
          res.json(result)
        }
      }
    )
    console.log('測試撈庫鵬卷', testCouSql[0])
    return res.json(testCouSql[0])
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'Coupons Not Found' })
  }
})
router.post('/', async (req, res) => {
  // const [user, created] = await User.findOrCreate({
  //   where: {
  //     [Op.or]: [{ username: newUser.username }, { email: newUser.email }],
  //   },
  //   defaults: {
  //     name: newUser.name,
  //     password: newUser.password,
  //     username: newUser.username,
  //     email: newUser.email,
  //   },
  // })
  const today = moment().format()
  // const uuid = shortUUID()
  // const shortCode = uuid.new()
  const newOrder = req.body
  // if (parseFloat(newOrder.selectedValue) === NaN) {
  //   newOrder.selectedValue = 0
  // }
  // if (parseFloat(newOrder.selectedValue) !== NaN) {
  //   newOrder.selectedValue = parseFloat(newOrder.selectedValue)
  // }
  // const resultOrder = newOrder.allProductId.
  console.log('咱們現在要看的', newOrder)
  const testOrder = [...newOrder.allProductId]
  // console.log(testOrder)
  const ArrayProductOrderData = JSON.parse(req.body.allProductId)
  const ArrayCourseOrderData = JSON.parse(req.body.allCourseId)
  console.log('1140看', ArrayCourseOrderData)
  const orderQuery =
    'INSERT INTO YaminOrder (state,order_uuid, user_id, coupon_id,coupon_discount, amount, total_price, username, email, phone, delivery, address, note, pay_state, cardnumber, cardholder, cardexpiry, cvc,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  const [yamintest] = await db.query(
    orderQuery,
    [
      newOrder.state,
      getRandomCode(),
      newOrder.userId,
      newOrder.selectedCouponId,
      Number(parseFloat(newOrder.selectedValue)),
      newOrder.amount,
      newOrder.totalPrice,
      newOrder.username,
      newOrder.email,
      newOrder.phone,
      newOrder.delivery,
      newOrder.address,
      newOrder.note,
      newOrder.payState,
      newOrder.cardnumber,
      newOrder.cardholder,
      newOrder.cardexpiry,
      newOrder.cvc,
      today,
      today,
    ],
    (err, results) => {
      if (err) {
        console.log('1234', err)
        res.json({ err })
        return false
      }
      if (results.insertId) {
        console.log('12345', results)

        res.json({ results })
        console.log('現在要看', results.insertId)
      }
    }
  )
  // const testYamin = JSON.stringify(yamintest)
  orderinsertId = yamintest.insertId
  console.log('12345', yamintest.insertId)

  const orderDeleteCouponQuery =
    'UPDATE users_coupons SET users_coupons.status = ? WHERE users_coupons.user_id = ? AND users_coupons.coupon_id = ?'
  const orderDeleteCouponUser = await db.query(
    orderDeleteCouponQuery,
    ['used', newOrder.userId, newOrder.selectedCouponId],
    (err, resultDeleteCoupon) => {
      if (err) {
        res.json(err)
      }
      if (resultDeleteCoupon) {
        res.json(resultDeleteCoupon)
      }
    }
  )

  if (yamintest.insertId) {
    const orderProductDetailQuery =
      'INSERT INTO YaminProductDetail (order_id,product_id,product_image,product_name,product_unitprice,product_quantity,product_totalprice,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)'

    const orderCourseDetailQuery =
      'INSERT INTO YaminCourseDetail (order_id,course_id,course_image,course_name,course_unitprice,course_quantity,course_totalprice,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)'
    if (ArrayProductOrderData) {
      ArrayProductOrderData.forEach((v) => {
        db.query(
          orderProductDetailQuery,
          [
            yamintest.insertId,
            v.product_id,
            v.product_image,
            v.product_name,
            v.product_unitprice,
            v.product_qty,
            v.product_totalprice,
            today,
            today,
          ],
          (err, resultProductDetails) => {
            if (err) {
              console.log(err)
              res.json({ err })
            }
            if (resultProductDetails) {
              res.json({ resultProductDetails })
            }
          }
        )
      })
    }
    if (ArrayCourseOrderData) {
      ArrayCourseOrderData.forEach((v) => {
        db.query(
          orderCourseDetailQuery,
          [
            yamintest.insertId,
            v.course_id,
            v.course_image,
            v.course_name,
            v.course_unitprice,
            v.course_quantity,
            v.course_totalprice,
            today,
            today,
          ],
          (err, resultCourseDetails) => {
            if (err) {
              console.log(err)
              res.json({ err })
            }
            if (resultCourseDetails) {
              res.json({ resultCourseDetails })
            }
          }
        )
      })
    }
    // 最一開始的新增資料
    // const testorder = newOrder.allProductId.split(',')
    // console.log('0822看', testorder)
    // testorder.forEach((v) => {
    //   db.query(
    //     orderProductDetailQuery,
    //     [yamintest.insertId, '', v, today, today],
    //     (err, resultDetails) => {
    //       if (err) {
    //         console.log(err)
    //         res.json({ err })
    //       }
    //       if (resultDetails) {
    //         res.json({ resultDetails })
    //       }
    //     }
    //   )
    // })
  }
  // 老師的寫法套用在我的訂單上
  // const [user, created] = await YaminOrder.findOrCreate({
  //   where: {
  //     [Op.or]: [
  //       // { username: newOrder.username },
  //       { email: newOrder.email },
  //       { username: newOrder.username },
  //     ],
  //   },
  //   defaults: {
  //     user_id: '',
  //     amount: newOrder.amount,
  //     total_price: newOrder.totalPrice,
  //     username: newOrder.username,
  //     email: newOrder.email,
  //     phone: newOrder.phone,
  //     delivery: newOrder.delivery,
  //     address: newOrder.address,
  //     note: newOrder.note,
  //     pay_state: newOrder.payState,
  //     cardnumber: newOrder.cardnumber,
  //     cardholder: newOrder.cardholder,
  //     cardexpiry: newOrder.cardexpiry,
  //     cvc: newOrder.cvc,
  //   },
  // })

  // if (!created) {
  //   return res.json({ status: 'error', message: '建立會員失敗' })
  // }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  // return res.status(201).json({
  //   status: 'success',
  //   data: null,
  // })
  res.json(yamintest)
  function getRandomCode(length = 11) {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
})

// linepay測試

router.post('/linepay', async (req, res) => {
  const today = moment().format()

  const newOrder = req.body

  console.log(newOrder)
  const testOrder = [...newOrder.allProductId]

  const ArrayProductOrderData = JSON.parse(req.body.allProductId)
  const ArrayCourseOrderData = JSON.parse(req.body.allCourseId)
  console.log('1140看', newOrder.selectedCouponId)
  const orderQuery =
    'INSERT INTO YaminOrder (state,order_uuid, user_id, coupon_id, coupon_discount, amount, total_price, username, email, phone, delivery, address, note, pay_state, cardnumber, cardholder, cardexpiry, cvc,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  const [yamintest] = await db.query(
    orderQuery,
    [
      newOrder.state,
      getRandomCode(),
      newOrder.userId,
      newOrder.selectedCouponId,
      parseFloat(newOrder.selectedValue),
      newOrder.amount,
      newOrder.totalPrice,
      newOrder.username,
      newOrder.email,
      newOrder.phone,
      newOrder.delivery,
      newOrder.address,
      newOrder.note,
      newOrder.payState,
      newOrder.cardnumber,
      newOrder.cardholder,
      newOrder.cardexpiry,
      newOrder.cvc,
      today,
      today,
    ],
    (err, results) => {
      if (err) {
        console.log('1234', err)
        res.json({ err })
        return false
      }
      if (results.insertId) {
        console.log('12345', results)
        res.json({ results })
        console.log('現在要看', results.insertId)
      }
    }
  )
  // 刪除使用優惠券的
  // const orderDeleteCouponQuery =
  //   'DELETE FROM users_coupons WHERE users_coupons.user_id = ? AND users_coupons.coupon_id = ?'
  // const orderDeleteCouponUser = await db.query(
  //   orderDeleteCouponQuery,
  //   [newOrder.userId, newOrder.selectedCouponId],
  //   (err, resultDeleteCoupon) => {
  //     if (err) {
  //       res.json(err)
  //     }
  //     if (resultDeleteCoupon) {
  //       res.json(resultDeleteCoupon)
  //     }
  //   }
  // )
  // 更新優惠券已使用
  const orderDeleteCouponQuery =
    'UPDATE users_coupons SET users_coupons.status = ? WHERE users_coupons.user_id = ? AND users_coupons.coupon_id = ?'
  const orderDeleteCouponUser = await db.query(
    orderDeleteCouponQuery,
    ['used', newOrder.userId, newOrder.selectedCouponId],
    (err, resultDeleteCoupon) => {
      if (err) {
        res.json(err)
      }
      if (resultDeleteCoupon) {
        res.json(resultDeleteCoupon)
      }
    }
  )

  console.log(orderDeleteCouponUser)
  // const testYamin = JSON.stringify(yamintest)
  console.log('12345', yamintest.insertId)
  if (yamintest.insertId) {
    const orderProductDetailQuery =
      'INSERT INTO YaminProductDetail (order_id,product_id,product_image,product_name,product_unitprice,product_quantity,product_totalprice,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)'

    const orderCourseDetailQuery =
      'INSERT INTO YaminCourseDetail (order_id,course_id,course_image,course_name,course_unitprice,course_quantity,course_totalprice,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)'
    if (ArrayProductOrderData) {
      ArrayProductOrderData.forEach((v) => {
        db.query(
          orderProductDetailQuery,
          [
            yamintest.insertId,
            v.product_id,
            v.product_image,
            v.product_name,
            v.product_unitprice,
            v.product_qty,
            v.product_totalprice,
            today,
            today,
          ],
          (err, resultProductDetails) => {
            if (err) {
              console.log(err)
              res.json({ err })
            }
            if (resultProductDetails) {
              res.json({ resultProductDetails })
            }
          }
        )
      })
    }
    if (ArrayCourseOrderData) {
      ArrayCourseOrderData.forEach((v) => {
        db.query(
          orderCourseDetailQuery,
          [
            yamintest.insertId,
            v.course_id,
            v.course_image,
            v.course_name,
            v.course_unitprice,
            v.course_quantity,
            v.course_totalprice,
            today,
            today,
          ],
          (err, resultCourseDetails) => {
            if (err) {
              console.log(err)
              res.json({ err })
            }
            if (resultCourseDetails) {
              res.json({ resultCourseDetails })
            }
          }
        )
      })
    }
  }
  // if (newOrder.payState === 'line') {
  //   if (yamintest.insertId) {
  //     console.log('line 0408', yamintest)

  //     const lineOrder = 'SELECT * FROM YaminOrder WHERE id = ?'
  //     testline = await db.query(
  //       lineOrder,
  //       [yamintest.insertId],
  //       (err, resultLine) => {
  //         if (err) {
  //           console.log(err)
  //           res.json({ err })
  //         }
  //         if (resultLine) {
  //           console.log(resultLine)
  //           res.json({ resultLine })
  //         }
  //       }
  //     )
  //     console.log('line416', testline[0][0])
  //     // 老師的部分
  //     LinePayOrder = {
  //       orderId: testline[0][0].id,
  //       currency: 'TWD',
  //       amount: testline[0][0].total_price,
  //       packages: [
  //         {
  //           id: testline[0][0].order_uuid,
  //           amount: testline[0][0].total_price,
  //           products: [
  //             {
  //               id: testline[0][0].id,
  //               name: '測試商品1',
  //               quantity: 1,
  //               price: testline[0][0].total_price,
  //             },
  //           ],
  //         },
  //       ],
  //       options: { display: { locale: 'zh_TW' } },
  //     }
  //     // 老師的部分end
  //     const redirectUrls = {
  //       confirmUrl: process.env.REACT_REDIRECT_CONFIRM_URL,
  //       cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
  //     }
  //     // line pay要求的訂單json
  //     try {
  //       linePayResponse = await linePayClient.request.send({
  //         body: { ...LinePayOrder, redirectUrls },
  //       })

  //       // 深拷貝一份order資料
  //       reservation = JSON.parse(JSON.stringify(LinePayOrder))

  //       reservation.returnCode = linePayResponse.body.returnCode
  //       reservation.returnMessage = linePayResponse.body.returnMessage
  //       reservation.transactionId = linePayResponse.body.info.transactionId
  //       reservation.paymentAccessToken =
  //         linePayResponse.body.info.paymentAccessToken

  //       const LinePayUpdateInOrder =
  //         'UPDATE `yaminorder` SET `transaction_id` = ?, `reservation` = ? WHERE `yaminorder`.`id` = ?;'
  //       const LinePayResultOrder = await db.query(
  //         LinePayUpdateInOrder,
  //         [
  //           JSON.stringify(LinePayOrder),
  //           reservation.transactionId,
  //           reservation.id,
  //         ],
  //         (err, lineResult) => {
  //           if (err) {
  //             console.log(err)
  //             res.json(err)
  //           }
  //           if (lineResult) {
  //             console.log(lineResult)
  //           }
  //         }
  //       )
  //       console.log('test')
  //     } catch (e) {
  //       console.log('錯促勿霧霧霧霧霧霧error', e)
  //     }
  //     console.log(`預計付款資料(Reservation)已建立。資料如下:`)
  //     console.log(reservation)
  //     console.log(`獲得訂單資料，內容如下`)
  //     console.log(LinePayOrder)
  //   }
  // }

  // res.json({
  //   status: 'success',
  //   data: { LinePayOrder },
  //   // lineUrl: linePayResponse.body.info.paymentUrl.web,
  // })
  LineOrderInsertId = yamintest.insertId
  linePayState = newOrder.payState
  // console.log('line測試要看的', LinePayOrder)
  res.json({
    status: 'success',
    data: { newOrder },
    goLineurl: yamintest.insertId,
  })
  function getRandomCode(length = 11) {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
})

// linepay測試結束

router.get('/linepay', async (req, res) => {
  const today = moment().format()
  const packageId = uuidv4()
  console.log(LineOrderInsertId)

  if (linePayState === 'linepay') {
    if (LineOrderInsertId) {
      console.log('line 0408', LineOrderInsertId)

      const lineOrder = 'SELECT * FROM YaminOrder WHERE id = ?'
      testline = await db.query(
        lineOrder,
        [LineOrderInsertId],
        (err, resultLine) => {
          if (err) {
            console.log(err)
            res.json({ err })
          }
          if (resultLine) {
            console.log(resultLine)
            res.json({ resultLine })
          }
        }
      )
      console.log('line416', testline[0][0])
      // 老師的部分
      LinePayOrder = {
        orderId: testline[0][0].order_uuid,
        currency: 'TWD',
        amount: testline[0][0].total_price,
        packages: [
          {
            id: testline[0][0].order_uuid,
            amount: testline[0][0].total_price,
            products: [
              {
                id: packageId,
                name: `訂單編號:${testline[0][0].order_uuid}`,
                quantity: 1,
                price: testline[0][0].total_price,
              },
            ],
          },
        ],
        options: { display: { locale: 'zh_TW' } },
      }
      // 老師的部分end
      const redirectUrls = {
        confirmUrl: process.env.REACT_REDIRECT_CONFIRM_URL,
        cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
      }
      // line pay要求的訂單json
      try {
        linePayResponse = await linePayClient.request.send({
          body: { ...LinePayOrder, redirectUrls },
        })

        // 深拷貝一份order資料
        reservation = JSON.parse(JSON.stringify(LinePayOrder))

        reservation.returnCode = linePayResponse.body.returnCode
        reservation.returnMessage = linePayResponse.body.returnMessage
        reservation.transactionId = linePayResponse.body.info.transactionId
        reservation.paymentAccessToken =
          linePayResponse.body.info.paymentAccessToken

        const LinePayUpdateInOrder =
          'UPDATE YaminOrder SET reservation = ?, transaction_id = ? WHERE id = ?'
        const LinePayResultOrder = await db.query(
          LinePayUpdateInOrder,
          [
            JSON.stringify(LinePayOrder),
            reservation.transactionId,
            LineOrderInsertId,
          ],
          (err, lineResult) => {
            if (err) {
              console.log(err)
              res.json(err)
            }
            if (lineResult) {
              console.log(lineResult)
            }
          }
        )

        console.log('test')
        // LinePayResultOrder()
        res.redirect(linePayResponse.body.info.paymentUrl.web)
      } catch (e) {
        console.log('錯促勿霧霧霧霧霧霧error', e)
      }
      console.log(`預計付款資料(Reservation)已建立。資料如下:`)
      console.log(reservation)
      console.log(`獲得訂單資料，內容如下`)
      console.log(LinePayOrder)
    }
  }

  // res.json({
  //   status: 'success',
  //   data: { LinePayOrder },
  //   // lineUrl: linePayResponse.body.info.paymentUrl.web,
  // })
  // res.redirect(linePayResponse.body.info.paymentUrl.web)
})
// line end

// router.post('/', async (req, res) => {})

router.get('/confirm', async (req, res) => {
  // 網址上需要有transactionId

  const transactionId = req.query.transactionId
  console.log('0829看的', transactionId)
  // 從資料庫取得交易資料
  // const dbOrder = await Purchase_Order.findOne({
  //   where: { transaction_id: transactionId },
  //   raw: true, // 只需要資料表中資料
  // })

  // mysql的取得方式
  const dbOrderSql = `SELECT * FROM YaminOrder WHERE transaction_id = ${transactionId}`
  const dbOrder = await db.query(dbOrderSql)
  console.log('123', dbOrder)

  // 交易資料
  const transaction = JSON.parse(dbOrder[0][0].reservation)

  console.log(transaction)
  console.log('我的賴id', transaction.orderId)
  // 交易金額
  const amount = transaction.amount
  console.log(amount)
  try {
    // 最後確認交易
    const linePayResponse = await linePayClient.confirm.send({
      transactionId: transactionId,
      body: {
        currency: 'TWD',
        amount: amount,
      },
    })

    // linePayResponse.body回傳的資料
    console.log('這邊勒', linePayResponse)

    //transaction.confirmBody = linePayResponse.body

    // status: 'pending' | 'paid' | 'cancel' | 'fail' | 'error'
    let status = 'paid'

    if (linePayResponse.body.returnCode !== '0000') {
      status = 'fail'
    }

    // 更新資料庫的訂單狀態
    // const result = await Purchase_Order.update(
    //   {
    //     status,
    //     return_code: linePayResponse.body.returnCode,
    //     confirm: JSON.stringify(linePayResponse.body),
    //   },
    //   {
    //     where: {
    //       id: dbOrder.id,
    //     },
    //   }
    // )

    // mysql方式
    const lineResultSql =
      'UPDATE YaminOrder SET status = ?, return_code = ?, confirm =? WHERE order_uuid = ?'
    const lineResult = await db.query(lineResultSql, [
      status,
      linePayResponse.body.returnCode,
      JSON.stringify(linePayResponse.body),
      transaction.orderId,
    ])
    console.log('我的lineResult', lineResult)

    return res.json({ status: 'success', data: linePayResponse.body })
  } catch (error) {
    return res.json({ status: 'fail', data: error.data })
  }
})

router.get('/cardpay', async (req, res) => {
  const cardPayid = req.query.orderId
  console.log('信用卡的id', cardPayid)
  const cardPaySql = 'SELECT * FROM YaminOrder WHERE id = ?'
  const SearchCardPayId = await db.query(
    cardPaySql,
    [cardPayid],
    (err, result) => {
      if (err) {
        res.json(err)
      }
      if (result) {
        res.json(result)
      }
    }
  )
  console.log('我要取uuid', SearchCardPayId)
  res.json(SearchCardPayId)
})
router.post('/send', upload.none(), async (req, res, next) => {
  // 寄送
  console.log('檢查傳出的insertId', orderinsertId)
  console.log('檢查送來的值', req.body)
  const checkOrderUuidSql = 'SELECT * FROM YaminOrder WHERE id = ?'
  const checkOrderUuid = await db.query(
    checkOrderUuidSql,
    [orderinsertId],
    (err, result) => {
      if (err) {
        console.log(err)
        res.json(err)
      }
      if (result) {
        console.log(result)
        res.json(result)
      }
    }
  )
  console.log('檢查要傳的orderId', checkOrderUuid)
  console.log('檢查要傳的email', checkOrderUuid[0][0].email)
  const mailOptions = {
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: `${checkOrderUuid[0][0].email}`,
    subject: `[雅茗]訂單成立，這是您的訂單編號${checkOrderUuid[0][0].order_uuid}`,
    // text: `感謝您的購買，\r\n<a href="http://localhost:3000/order/orderTwoFiveList?orderId=${checkOrderUuid[0][0].id}">前往訂單明細</a>\r\n這是您的訂單編號:${checkOrderUuid[0][0].order_uuid}。\r\n共消費:${checkOrderUuid[0][0].total_price}`,
    html: ` <div style="padding: 20px;width: 300px; height: 400px;background-color: #003E52;">

       <div style="margin-botton:10px">
        <img style="width: 80px ;background-size: cover;"  src="https://raw.githubusercontent.com/GuanLin-Liao/testImg/main/LOGO-%E7%9B%B4%E5%90%91.png" alt="">
       </div>
       <div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;">謝謝您的購買</div>
       <div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;"><a href="http://localhost:3000/order/orderTwoOneList?orderId=${checkOrderUuid[0][0].id}">前往訂單明細資料</a></div><div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;">訂單編號:${checkOrderUuid[0][0].order_uuid}</div><div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;">總價:${checkOrderUuid[0][0].total_price}</div>
       


    </div>`,
  }

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      return res.status(400).json({ status: 'error', message: err })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
  res.json('ok')
})
router.post('/linepay/send', upload.none(), async (req, res, next) => {
  // 寄送
  console.log('檢查傳出的insertId', LineOrderInsertId)
  console.log('檢查送來的值', req.body)
  const checkOrderUuidSql = 'SELECT * FROM YaminOrder WHERE id = ?'
  const checkOrderUuid = await db.query(
    checkOrderUuidSql,
    [LineOrderInsertId],
    (err, result) => {
      if (err) {
        console.log(err)
        res.json(err)
      }
      if (result) {
        console.log(result)
        res.json(result)
      }
    }
  )
  console.log('檢查要傳的orderId', checkOrderUuid)
  console.log('檢查要傳的email', checkOrderUuid[0][0].email)
  const mailOptions = {
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: `${checkOrderUuid[0][0].email}`,
    subject: `[雅茗]訂單成立，這是您的訂單編號${checkOrderUuid[0][0].order_uuid}`,
    // text: `感謝您的購買，\r\n<a href="http://localhost:3000/order/orderTwoFiveList?orderId=${checkOrderUuid[0][0].id}">前往訂單明細</a>\r\n這是您的訂單編號:${checkOrderUuid[0][0].order_uuid}。\r\n共消費:${checkOrderUuid[0][0].total_price}`,
    html: ` <div style="padding: 20px;width: 300px; height: 400px;background-color: #003E52;">

       <div style="margin-botton:10px">
        <img style="width: 80px ;background-size: cover;"  src="https://raw.githubusercontent.com/GuanLin-Liao/testImg/main/LOGO-%E7%9B%B4%E5%90%91.png" alt="">
       </div>
       <div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;">謝謝您的購買</div>
       <div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;"><a href="http://localhost:3000/order/orderTwoOneList?orderId=${checkOrderUuid[0][0].id}">前往訂單明細資料</a></div><div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;">訂單編號:${checkOrderUuid[0][0].order_uuid}</div><div style="color:#B29564 ;padding-bottom: 10px;border-bottom: 2px solid #B29564; margin-bottom: 21px;">總價:${checkOrderUuid[0][0].total_price}</div>
       


    </div>`,
  }

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      return res.status(400).json({ status: 'error', message: err })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
  res.json('ok')
})
export default router
