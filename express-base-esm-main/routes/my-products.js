import express from 'express'
const router = express.Router()

import sequelize from '#configs/db.js'
const { My_Product } = sequelize.models

router.get('/', async function (req, res) {
  const products = await My_Product.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json(products)
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'my-products' })
})

export default router
