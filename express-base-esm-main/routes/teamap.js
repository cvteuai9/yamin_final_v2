import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const type = req.query.type || 'teaHouse'
    const order = req.query.order || 'starDESC'
    // const businessStatus = req.query.businessStatus || 'all'
    const starRating = req.query.starRating || 'all'
    const searchRange = req.query.searchRange || '10k'
    const lat = Number(req.query.lat) || 23.896271539202733
    const lng = Number(req.query.lng) || 120.92187627041206
    console.log(type, order, starRating, searchRange, lat, lng)
    let queryCluse = ``,
      typeQueryCluse = ``,
      orderQueryCluse = ``,
      starRatingQueryCluse = ``,
      searchRangeQueryCluse = ``
    // 設定type為茶館/茶廠
    switch (type) {
      case 'teaFactory':
        typeQueryCluse = `gmap_tea_factory`
        break
      case 'teaHouse':
        typeQueryCluse = `gmap_tea_house`
        break
      default:
        typeQueryCluse = `gmap_tea_house`
        break
    }
    // 設定搜尋範圍(公里)
    switch (searchRange) {
      case '1k':
        searchRangeQueryCluse = `1`
        break
      case '5k':
        searchRangeQueryCluse = `5`
        break
      case '10k':
        searchRangeQueryCluse = `10`
        break
    }
    // 設定排序 by 星等or總評論數or距離(公里)
    switch (order) {
      case 'starDESC':
        orderQueryCluse = 'ORDER BY rating DESC'
        break
      case 'starASC':
        orderQueryCluse = 'ORDER BY rating ASC'
        break
      case 'ratingCountDESC':
        orderQueryCluse = 'ORDER BY user_ratings_total DESC'
        break
      case 'ratingCountASC':
        orderQueryCluse = 'ORDER BY user_ratings_total ASC'
        break
      case 'distanceDESC':
        orderQueryCluse = 'ORDER BY distance DESC'
        break
      case 'distanceASC':
        orderQueryCluse = 'ORDER BY distance ASC'
        break
    }
    // 設定星等篩選
    switch (starRating) {
      case 'all':
        starRatingQueryCluse = ''
        break
      case '5':
        starRatingQueryCluse = ' WHERE rating = 5'
        break
      case '4':
        starRatingQueryCluse = ' WHERE rating >= 4 && rating <5'
        break
      case '3':
        starRatingQueryCluse = ' WHERE rating >= 3 && rating <4'
        break
      case '2':
        starRatingQueryCluse = ' WHERE rating >= 2 && rating <3'
        break
      case '1':
        starRatingQueryCluse = ' WHERE rating < 2'
        break
    }
    // 組合sql語句
    queryCluse = `SELECT *, (
    6371 * acos (
      cos ( radians(latitude) )
      * cos( radians( ${lat} ) )
      * cos( radians( ${lng} ) - radians(longitude) )
      + sin ( radians(latitude) )
      * sin( radians( ${lat} ) )
    )
  ) AS distance FROM ${typeQueryCluse}${starRatingQueryCluse} HAVING distance < ${searchRangeQueryCluse} ${orderQueryCluse}`
    // console.log(queryCluse)
    const [rows] = await db.query(queryCluse)
    // 處理營業時間字串，將字串轉為陣列
    let mapData = rows.map((v) => {
      if (v.opening_hours !== '(無提供)') {
        const testString = v.opening_hours
        let splitArray = testString.split('星期')
        // console.log('splitArray: ', splitArray)
        let filterArray = splitArray.filter((v) => v !== '')
        // console.log('filterArray: ', filterArray)
        let notfinalArray = filterArray.map((v) => v.split(','))
        // console.log('notfinalArray: ', notfinalArray)
        let finalArray = notfinalArray.map((v) => v.filter((x) => x !== ''))
        // console.log('finalArray: ', finalArray)
        let lastArray = finalArray.map((v) => v.join(','))
        // console.log('last: ', lastArray)
        return { ...v, opening_hours: lastArray }
      } else {
        return v
      }
    })

    res.status(200).json(mapData)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'Not Found' })
  }
})

export default router
