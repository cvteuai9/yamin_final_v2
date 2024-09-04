import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // 取出所有篩選條件的資料表
    const teaFilter = await handleFilterInfo('tea', 'tea_name') // 茶種
    const brandFilter = await handleFilterInfo('brand', 'brand_name') // 品牌
    const packageFilter = await handleFilterInfo(
      'package_category',
      'package_name'
    ) // 包裝方式
    const styleFilter = await handleFilterInfo('style', 'style_name') // 茶品型態
    const searchID = req.query.searchID || ''
    const order = req.query.order || '1'
    const perpage = Number(req.query.perpage) || 12
    const page = Number(req.query.page) || 1
    // 每頁第一筆資料索引 = (現在頁數 - 1) * 每頁顯示資料數量 -> 索引是從0開始計算
    const start = (page - 1) * perpage
    const end = perpage * page
    const price = [req.query.price][0].split(',') || []
    const tea = [req.query.tea][0].split(',') || []
    const brand = [req.query.brand][0].split(',') || []
    const pc = [req.query.package][0].split(',') || []
    const style = [req.query.style][0].split(',') || []
    // console.log(tea, brand, pc, style)
    let product = {}
    let totalPage
    // console.log(teaFilter, brandFilter, packageFilter, styleFilter)
    // console.log(Array.isArray(price))
    let orderSql = '',
      priceSql = '',
      teaSql = '',
      brandSql = '',
      packageSql = '',
      styleSql = '',
      searchSql = ''
    // 設定排序
    if (order === '1') {
      orderSql = ' ORDER BY price DESC'
    } else {
      orderSql = ' ORDER BY price ASC'
    }
    // 如果price不是空陣列 => 代表有勾選該篩選條件
    if (price[0] !== '') {
      if (price.includes('1') && price.includes('2') && price.includes('3')) {
        priceSql = ''
      } else if (price.includes('1') && price.includes('2')) {
        priceSql = ' price<=1000'
      } else if (price.includes('2') && price.includes('3')) {
        priceSql = ' price>500'
      } else if (price.includes('1') && price.includes('3')) {
        priceSql = ' (price<=500 OR price>1000)'
      } else if (price.includes('1')) {
        priceSql = ' price<=500'
      } else if (price.includes('2')) {
        priceSql = ' (price>500 && price<=1000)'
      } else if (price.includes('3')) {
        priceSql = ' price>1000'
      }
    }
    if (tea[0] !== '') {
      const teaConditions = tea.map((id) => `tea_id=${id}`).join(' || ')
      teaSql = teaConditions ? `(${teaConditions})` : ''
    }
    if (brand[0] !== '') {
      const brandConditions = brand.map((id) => `brand_id=${id}`).join(' || ')
      brandSql = brandConditions ? `(${brandConditions})` : ''
    }
    if (pc[0] !== '') {
      const pcConditions = pc.map((id) => `package_id=${id}`).join(' || ')
      packageSql = pcConditions ? `(${pcConditions})` : ''
    }
    if (style[0] !== '') {
      const styleConditions = style.map((id) => `style_id=${id}`).join(' || ')
      styleSql = styleConditions ? `(${styleConditions})` : ''
    }
    // 搜尋邏輯判斷
    if (searchID !== '') {
      searchSql = `product_name LIKE '%${searchID}%'`
    }
    // 如果有篩選條件，開頭要加WHERE
    let whereSql =
      priceSql !== '' ||
      teaSql !== '' ||
      brandSql !== '' ||
      packageSql !== '' ||
      styleSql !== '' ||
      searchSql !== ''
        ? ' WHERE '
        : ''

    // allFilterSql 陣列將所有篩選條件字串塞進來
    let allFilterSql = []
    allFilterSql.push(
      searchSql,
      priceSql,
      teaSql,
      brandSql,
      packageSql,
      styleSql
    )
    // 再透過filter去除掉空字串
    allFilterSql = allFilterSql.filter((p) => p !== '')
    // 再透過join方法將所有篩選條件用 && 串接起來成一個字串
    allFilterSql = allFilterSql.join(' && ')
    // 組合所有sql語句
    let queryCluse =
      'SELECT * FROM my_products' + whereSql + allFilterSql + orderSql
    console.log(queryCluse)

    // 取出商品資料
    const [rows] = await db.query(queryCluse)
    const totalData = rows.length
    // 將初始資料擴展一個紀錄是否被加入收藏的屬性值 fav，並設為false
    const nextData = rows.map((v) => {
      return { ...v, fav: false }
    })
    // 計算分頁資訊
    totalPage = Math.ceil(rows.length / perpage)
    // 商品資料為 全部資料用slice方法切割 第一頁為 (start(0), end(12))
    product.data = nextData.slice(start, end)
    product.totalPage = totalPage
    product.teaFilter = teaFilter
    product.brandFilter = brandFilter
    product.packageFilter = packageFilter
    product.styleFilter = styleFilter
    product.totalData = totalData
    // console.log(product)
    return res.status(200).json({ status: 'success', product: product })
  } catch (error) {
    console.error('Error executing query', error)
    return res.status(404).json({ error: 'All Product Not Found' })
  }
})

// 取得相關產品
router.get('/relation_product/:id', async (req, res) => {
  try {
    const currentProductID = Number(req.params.id)
    const product = await db.execute(
      `SELECT tea_id FROM my_products WHERE id = ?`,
      [currentProductID]
    )
    // console.log(product[0][0].tea_id)
    const { tea_id } = product[0][0]
    const [rows] = await db.execute(
      'SELECT id, product_name, price, paths FROM my_products WHERE tea_id = ?',
      [tea_id]
    )
    // 設定亂數取資料，Set物件可讓你儲存任何類型的唯一值（unique）
    // Set 對象是數值的收集器。你可以按插入順序迭代收集器中的元素。在 Set 裡的元素只會出現一次；意即在 Set 裡的元素都是獨一無二
    let randomNumber = new Set()
    // 設定一個while迴圈產生隨機亂數
    // !!
    while (randomNumber.size < Math.min(rows.length, 6)) {
      randomNumber.add(Math.floor(Math.random() * rows.length))
    }
    // 將隨機亂數陣列的值(v)當作rows的索引，再將rows[v]的物件值放到relation_product中，對應的索引(i)位置
    let relation_product = []
    // !!
    randomNumber.forEach((v, i) => {
      relation_product.push(rows[v])
    })
    // console.log(randomNumber)
    // console.log(relation_product)
    return res.status(200).json(relation_product)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: 'Relation Product Not Found' })
  }
})

// 請求收藏資料
router.get('/favorites', async (req, res) => {
  try {
    const user_id = Number(req.query.user_id) || 0
    const [rows] = await db.execute(
      `SELECT product_id FROM favorites WHERE user_id = ?`,
      [user_id]
    )
    let favoriteProduct = []
    rows.map((v) => {
      if (v.product_id !== 0 && v.product_id !== null) {
        return favoriteProduct.push(v.product_id)
      }
    })
    // console.log(rows)
    return res.status(200).json(favoriteProduct)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: 'Favorite Product Not Found' })
  }
})

router.put('/favorites', async (req, res) => {
  try {
    const user_id = req.query.user_id
    const product_id = req.query.product_id
    await db.execute(
      'INSERT INTO favorites (user_id, product_id) VALUES( ?, ?)',
      [user_id, product_id]
    )
    return res
      .status(200)
      .json({ message: 'Favorite Product Insert successfully' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'Invalid input data' })
  }
})

router.delete('/favorites', async (req, res) => {
  try {
    const user_id = req.query.user_id
    const product_id = req.query.product_id
    await db.execute(
      'DELETE FROM favorites WHERE user_id = ? && product_id = ?',
      [user_id, product_id]
    )
    return res
      .status(200)
      .json({ message: 'Favorite Product deleted successfully' })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'Product Not Found' })
  }
})

router.get('/reviews/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await db.query(
      `SELECT reviews.id, user_id, comment, rating, reviews.created_at, users.user_image, users.user_name FROM reviews JOIN users ON users.id = reviews.user_id WHERE product_id = ${id} ORDER BY reviews.created_at DESC`
    )
    // console.log(rows.length)
    // 設定各星級佔存
    let a = 0,
      b = 0,
      c = 0,
      d = 0,
      e = 0
    // 計算各星級數量
    rows.map((v, i) => {
      switch (v.rating) {
        case 1:
          a++
          break
        case 2:
          b++
          break
        case 3:
          c++
          break
        case 4:
          d++
          break
        case 5:
          e++
          break
      }
    })
    // 計算總星級數， toFixed(1) 取到小數點第一位(四捨五入)
    let allRating = (
      (a * 1 + b * 2 + c * 3 + d * 4 + e * 5) /
      rows.length
    ).toFixed(1)
    // 計算各星級 % 數
    const starArray = [
      Math.round((e / rows.length) * 100),
      Math.round((d / rows.length) * 100),
      Math.round((c / rows.length) * 100),
      Math.round((b / rows.length) * 100),
      Math.round((a / rows.length) * 100),
    ]
    const reviews = {}
    reviews.allData = rows
    reviews.someData = rows.slice(0, 3)
    reviews.eachRating = starArray
    reviews.allRating = allRating
    reviews.allLength = rows.length
    console.log(reviews)
    return res.status(200).json(reviews)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: 'Reviews Not Found' })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await db.query(
      `SELECT my_products.* , tea.name AS tea_name, brand.name AS brand_name, package_category.name AS pc_name, style.name AS style_name FROM my_products
      JOIN tea ON tea.id = my_products.tea_id 
      JOIN brand ON brand.id = my_products.brand_id 
      JOIN package_category ON package_category.id = my_products.package_id 
      JOIN style ON style.id = my_products.style_id 
      WHERE my_products.id = ${id}
      `
    )
    const [imageRows] = await db.query(
      `SELECT path FROM product_images JOIN my_products ON my_products.id = product_images.product_id WHERE product_images.product_id = ${id}`
    )
    let image = []
    imageRows.map((v, i) => {
      image.push(v.path)
      return image
    })
    // console.log(image)
    const product = { data: rows, images: image }
    return res.status(200).json(product)
  } catch (error) {
    console.log(error)
    return res.status(404).json('Product Not Found')
  }
})

// 取篩選資料的函式
async function handleFilterInfo(filter = '', name = '') {
  const [rows] = await db.query(`SELECT id, name as ${name} FROM ${filter}`)
  return rows
}

export default router
