import express from 'express'
const router = express.Router()
import db from '#configs/mysql.js'

/* GET home page. */
router.get('/', async function (req, res) {
  const [rows] = await db.query(
    'SELECT  my_products.id,my_products.product_name,my_products.paths, tea.name AS tea_name FROM `my_products` JOIN tea ON tea.id=my_products.tea_id'
  )
  const products = rows
  return res.json(products)
})

export default router
