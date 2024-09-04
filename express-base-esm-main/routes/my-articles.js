import express from 'express'
import cors from 'cors'
const router = express.Router()

// 使用 CORS 中間件
router.use(cors())

// 解析 JSON 請求體
router.use(express.json())

// 資料庫使用直接使用 mysql 來查詢
import db from '#configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const [rows] = await db.query('SELECT * FROM articles')
  const articles = rows

  // 標準回傳JSON
  // return res.json({ status: 'success', data: { articles } })
  return res.json(articles)
})
// 拿取收藏資料
router.get('/favorites', async (req, res) => {
  try {
    const user_id = Number(req.query.user_id) || 0
    const [rows] = await db.execute(
      'SELECT article_id FROM favorites WHERE user_id = ?',
      [user_id]
    )
    // 防止撈出null或0的文章ID
    let favoriteArticle = []
    rows.map((v) => {
      if (v.article_id !== 0 && v.article_id !== null) {
        favoriteArticle.push(v.article_id)
      }
    })
    res.status(200).json(favoriteArticle)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Favorite Article Not Found' })
  }
})
// 新增收藏資訊
router.put('/favorites', async (req, res) => {
  try {
    const user_id = Number(req.query.user_id) || 0
    const article_id = Number(req.query.article_id) || 0
    await db.execute(
      'INSERT INTO favorites (user_id, article_id) VALUES (?, ?)',
      [user_id, article_id]
    )
    return res
      .status(200)
      .json({ message: 'Favorite Article Insert successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Favorite Article Not Found' })
  }
})
// 刪除收藏資訊
router.delete('/favorites', async (req, res) => {
  try {
    const user_id = Number(req.query.user_id) || 0
    const article_id = Number(req.query.article_id) || 0
    await db.execute(
      'DELETE FROM favorites WHERE user_id =? && article_id =?',
      [user_id, article_id]
    )
    return res
      .status(200)
      .json({ message: 'Favorite Article DELETE successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Favorite Article Not Found' })
  }
})
router.get('/category', async function (req, res) {
  const [rows] = await db.query('SELECT * FROM articles_category')
  const articles_category = rows

  return res.json({ status: 'success', data: { articles_category } })
})

router.get('/filter', async (req, res) => {
  const { category_id, page = 1, limit = 12, sort = 'date_desc' } = req.query
  const offset = (page - 1) * limit

  // 設定排序規則
  let orderBy
  switch (sort) {
    case 'date_asc':
      orderBy = 'created_at ASC'
      break
    case 'date_desc':
      orderBy = 'created_at DESC'
      break
    case 'views_asc':
      orderBy = 'views ASC'
      break
    case 'views_desc':
      orderBy = 'views DESC'
      break
    default:
      orderBy = 'created_at DESC'
  }

  try {
    // 取得該分類下的文章總數
    const [[{ totalCount }]] = await db.query(
      'SELECT COUNT(*) AS totalCount FROM articles WHERE category_id = ?',
      [category_id]
    )

    // 取得文章數據並進行分頁和排序
    const [articles] = await db.query(
      `SELECT * FROM articles WHERE category_id = ? ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [category_id, parseInt(limit), offset]
    )

    res.json({
      data: {
        articles,
        totalCount, // 包含總文章數
      },
    })
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

router.get('/top-views', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM `articles` ORDER BY `views` DESC LIMIT 5;'
  )
  const top_views = rows
  return res.json({ status: 'success', data: { top_views } })
})
router.get('/new-articles', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM `articles` ORDER BY `articles`.`created_at` DESC LIMIT 5'
  )
  const new_articles = rows
  return res.json({ status: 'success', data: { new_articles } })
})

// 為什麼ｐｏｓｔ不行？
router.get('/:id/views', async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid ID' })
  }
  try {
    const [result] = await db.query(
      'UPDATE articles SET views = views + 1 WHERE id = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Article not found' })
    }
    const [rows] = await db.query('SELECT views FROM articles')
    const views = rows

    res.json({
      status: 'success',
      data: { views },
    })
  } catch (error) {
    // 捕捉任何錯誤並返回錯誤信息
    console.error('Error updating article views:', error)
    res.status(500).json({ status: 'error', message: 'Error updating views' })
  }
})
//推薦好茶
router.get('/:id/recommendations', async function (req, res) {
  const id = Number(req.params.id) // 假設文章標題從請求參數中獲取
  const [result] = await db.query('SELECT title FROM articles WHERE id = ?', [
    id,
  ])
  // console.log(result)
  const articleTitle = result.length > 0 ? result[0].title : null
  // console.log(articleTitle)
  // 拆分文章标题为单个字
  const words = articleTitle.match(/[\u4e00-\u9fa5]/g) || [] // 只提取中文字符
  // console.log(words)
  try {
    // SQL 查詢：根據文章標題匹配茶名，然後返回相應的商品
    const [products] = await db.query(
      'SELECT id, product_name,price,paths FROM my_products'
    )
    // 計算每個商品的匹配度
    const matchedProducts = products.map((product) => {
      let matchCount = 0
      words.forEach((word) => {
        if (product.product_name.includes(word)) {
          matchCount++
        }
      })
      return { ...product, matchCount }
    })
    // 根據匹配度進行排序，選擇匹配度最高的前三個商品
    const topMatches = matchedProducts
      .filter((product) => product.matchCount > 0) // 只保留有匹配的商品
      .sort((a, b) => b.matchCount - a.matchCount) // 根據匹配度排序
      .slice(0, 4) // 取前4個
    console.log(topMatches)
    if (topMatches.length > 0) {
      return res.json({ status: 'success', data: { topMatches } })
    } else {
      return res.json({
        status: 'no_match',
        message: 'No products matched the article title.',
      })
    }
  } catch (error) {
    console.error('Error querying the database:', error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error.' })
  }
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [rows] = await db.query('SELECT * FROM articles WHERE id = ?', [id])
  const article = rows[0]

  return res.json({ status: 'success', data: { article } })
})

export default router
