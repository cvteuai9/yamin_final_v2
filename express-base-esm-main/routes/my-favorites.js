import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let perpage = 0
    const user_id = Number(req.query.user_id) || 0
    const type = req.query.type || ''
    let order = Number(req.query.order) || 1
    let queryCluse = ``
    switch (type) {
      case 'product':
        perpage = 8
        queryCluse = `SELECT mp.id,mp.product_name, mp.paths, mp.weight, mp.price, brand.name AS brand_name, tea.name AS tea_name, style.name AS style_name
          FROM my_products mp
          JOIN favorites f ON f.product_id = mp.id
          JOIN brand ON brand.id = mp.brand_id
          JOIN tea ON tea.id = mp.tea_id
          JOIN style ON style.id = mp.style_id
          WHERE f.user_id = ${user_id}`
        break
      case 'course':
        perpage = 4
        queryCluse = `SELECT c.id, c.name AS course_name, c.start_time, c.end_time, c.location, c.description, c.price, c.current_number, c.limit_people, c.img1, category_id.name AS category_name FROM course c
        JOIN category_id ON category_id.id = c.category_id
        JOIN favorites f ON f.course_id = c.id
        WHERE f.user_id = ${user_id}`
        break
      case 'article':
        if (order !== 3 && order !== 4) {
          order = 3
        }
        perpage = 4
        queryCluse = `SELECT articles.id, articles.title, articles.content, articles.created_at, articles.article_images, ac.name AS category_name FROM articles JOIN articles_category ac ON ac.id = articles.category_id JOIN favorites f ON f.article_id = articles.id WHERE f.user_id = ${user_id}`
        break
      default:
        throw new Error('error')
    }

    switch (order) {
      case 1:
        queryCluse += ' ORDER BY price ASC'
        break
      case 2:
        queryCluse += ' ORDER BY price DESC'
        break
      case 3:
        queryCluse += ' ORDER BY ac.name ASC'
        break
      case 4:
        queryCluse += ' ORDER BY ac.name DESC'
        break
    }
    const page = Number(req.query.page) || 1
    const start = (page - 1) * perpage
    const end = perpage * page
    const [rows] = await db.execute(queryCluse)
    let myFavData = {}
    myFavData.data = rows.slice(start, end)
    myFavData.totalCount = rows.length
    myFavData.totalPage = Math.ceil(rows.length / perpage)
    return res.status(200).json(myFavData)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: 'Favorite Data Not Found' })
  }
})
export default router
