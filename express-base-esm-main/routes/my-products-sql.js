import express from 'express'
const router = express.Router()

// 資料庫使用直接使用 mysql 來查詢
import db from '#configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const [rows] = await db.query('SELECT * FROM my_product')
  const products = rows

  // 標準回傳JSON
  return res.json({ status: 'success', data: { products } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [rows] = await db.query('SELECT * FROM my_product WHERE id = ?', [id])
  const product = rows[0]

  return res.json({ status: 'success', data: { product } })
})

export default router
