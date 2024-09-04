import express from 'express'
import db from '#configs/mysql.js'
// import Yamin_order from '##/models/Yamin_order.js'
const router = express.Router()
import { Op, UUIDV4 } from 'sequelize'
import sequelize from '#configs/db.js'
import moment from 'moment'
import authenticate from '../middlewares/authenticate.js'
import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'
// import { result } from 'lodash'
const { YaminOrder, YaminOrderDetail } = sequelize.models
const upload = multer()
// line pay使用npm套件
import { createLinePayClient } from 'line-pay-merchant'
// 存取`.env`設定檔案使用
import 'dotenv/config.js'

router.use(express.json())
router.get('/', async (req, res) => {
  try {
    const user_id = req.query.user_id || 0
    console.log('檢查id', user_id)
    let getOrderDetailsSQL = `SELECT * FROM YaminOrder WHERE user_id = ${user_id} `
    const getOrderDetail = await db.query(getOrderDetailsSQL)
    console.log(getOrderDetail[0])
    return res.json(getOrderDetail[0])
    // res.json('123')
  } catch (err) {
    console.log(err)
  }
})

router.get('/orderId', async (req, res) => {
  try {
    const orderId = req.query.orderId || 0
    const orderState = parseInt(req.query.orderState) || 0
    const orderDetailSql = `SELECT  yaminOrder.* FROM yaminOrder WHERE yaminOrder.id = ${orderId} `
    const SearchOrderDetaill = await db.query(orderDetailSql)
    const SearchOrderDetail = SearchOrderDetaill[0]
    // 課程
    const orderDetailCourseSql = `SELECT  yamincoursedetail.* FROM yamincoursedetail  WHERE yamincoursedetail.order_id = ${orderId} `
    const SearchOrderCourseDetaill = await db.query(orderDetailCourseSql)
    const SearchOrderCourseDetail = SearchOrderCourseDetaill[0]
    // 商品
    const orderDetailProductSql = `SELECT  yaminproductdetail.* FROM yaminproductdetail  WHERE yaminproductdetail.order_id = ${orderId} `
    const SearchOrderProductDetaill = await db.query(orderDetailProductSql)
    const SearchOrderProductDetail = SearchOrderProductDetaill[0]
    // 評價課程
    const orderReviewCourse = `SELECT member_comment.order_id, course_id FROM member_comment WHERE member_comment.order_id = ${orderId}`
    const SearchOrderReviewCoursee = await db.query(orderReviewCourse)
    const SearchOrderReviewCourse = SearchOrderReviewCoursee[0]
    // 評價商品
    const orderReviewProduct = `SELECT reviews.order_id, product_id FROM reviews WHERE reviews.order_id = ${orderId}`
    const SearchOrderReviewProductt = await db.query(orderReviewProduct)
    const SearchOrderReviewProduct = SearchOrderReviewProductt[0]
    // res.json(SearchOrderProductDetail)
    console.log('取來的值', orderId, orderState)
    console.log('看單筆order', SearchOrderDetail)
    console.log('看我的state', orderState)
    res.json([
      SearchOrderDetail,
      SearchOrderCourseDetail,
      SearchOrderProductDetail,
      SearchOrderReviewCourse,
      SearchOrderReviewProduct,
    ])
  } catch (err) {
    console.log(err)
  }

  // 測試結束
  //   try {
  //     const orderId = req.query.orderId || 0
  //     const orderState = parseInt(req.query.orderState) || 0
  //     const orderDetailSql = `SELECT yo.* , yamincoursedetail.*,yaminproductdetail.* FROM YaminOrder yo JOIN yamincoursedetail ON yamincoursedetail.order_id = yo.id  JOIN yaminproductdetail ON yaminproductdetail.order_id =yo.id WHERE yo.id = ${orderId} `
  //     const SearchOrderDetaill = await db.query(orderDetailSql)
  //     const SearchOrderDetail = SearchOrderDetaill[0]
  //     console.log('取來的值', orderId, orderState)
  //     console.log('看單筆order', SearchOrderDetail)
  //     console.log('看我的state', orderState)
  //     res.json(SearchOrderDetail)
  //   } catch (err) {
  //     console.log(err)
  //   }
})

router.post('/review', upload.none(), async (req, res) => {
  console.log('檢查傳來的內容', req.body)
  console.log('使用者id', req.body.userId)
  let CourseInsertReview
  const reviewContent = req.body
  console.log('傳到後台來的評論資料', reviewContent)
  try {
    if (reviewContent.courseId === 'null') {
      const today = moment().format()
      const InsertReviewSql =
        'INSERT INTO reviews(user_id,order_id,product_id,course_id,rating,comment,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)'
      const InsertReview = await db.query(
        InsertReviewSql,
        [
          reviewContent.userId,
          reviewContent.orderId,
          reviewContent.productId,
          reviewContent.courseId,
          reviewContent.star,
          reviewContent.note,
          today,
          today,
        ],
        (err, results) => {
          if (err) {
            res.json({ err })
          }
          if (results) {
            res.json(results)
          }
        }
      )
      console.log('後台sql評論內容', InsertReview)

      // res.json('評論內容如下', InsertReview)
    }
    if (reviewContent.productId === 'null') {
      const today = moment().format()
      const InsertReviewSql =
        'INSERT INTO member_comment(member_id,order_id,course_id,rating,comment,date,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)'
      const InsertReview = await db.query(
        InsertReviewSql,
        [
          reviewContent.userId,
          reviewContent.orderId,
          reviewContent.courseId,
          reviewContent.star,
          reviewContent.note,
          today,
          today,
          today,
        ],
        (err, results) => {
          if (err) {
            res.json({ err })
          }
          if (results) {
            res.json(results)
          }
        }
      )

      console.log('後台sql評論內容', InsertReview)
      // res.json('評論內容如下', InsertReview)
    }
  } catch (err) {
    console.log(err)
  }
  res.json('成功')
})

router.get('/review/course', async (req, res) => {
  const selectCourseReviewSql = 'SELECT * FROM member_comment'
})
export default router
