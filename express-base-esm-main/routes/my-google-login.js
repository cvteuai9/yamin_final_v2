import express from 'express'
const router = express.Router()

import jsonwebtoken from 'jsonwebtoken'
// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 資料庫使用直接使用 mysql 來查詢
import db from '#configs/mysql.js'

import { v4 as uuidv4 } from 'uuid'

import { getAutoSentCouponList } from '../routes/coupons.js'

// 定義安全的私鑰字串
const secretKey = process.env.ACCESS_TOKEN_SECRET

router.post('/', async function (req, res, next) {
  // providerData =  req.body
  console.log(JSON.stringify(req.body))

  // 檢查從react來的資料
  // 典型的 Google 登入返回的使用者資訊可能會包含以下屬性：

  // •	displayName: 使用者的顯示名稱（如全名或暱稱）。
  // •	email: 使用者的電子郵件地址。
  // •	uid: 使用者的唯一標識符（通常是 Google 使用者 ID）。
  // •	photoURL: 使用者的頭像 URL。
  // •	providerId: 表示提供這些資料的驗證提供者（例如 google.com）。
  if (!req.body.providerId || !req.body.uid) {
    return res.json({ status: 'error', message: '缺少google登入資料' })
  }

  const { displayName, email, uid, photoURL } = req.body
  const google_uid = uid

  // 使用參數化查詢
  const [dbusers] = await db.query('SELECT * FROM users WHERE google_uid = ?', [
    google_uid,
  ])
  console.log(dbusers)

  let returnUser = {
    id: 0,
    user_name: '',
    google_uid: '',
  }
  const [dbusersemail] = await db.query('SELECT * FROM users WHERE email = ?', [
    email,
  ])
  // 如果google登入有一樣的google_uid，dbusers.length > 0，再返回使用者資訊
  if (dbusers.length > 0) {
    const dbuser = dbusers[0]
    returnUser = {
      id: dbuser.id,
      user_name: dbuser.user_name,
      google_uid: dbuser.google_uid,
    }
    // 如果沒有相同的google_uid，但有相同email，寫入google_uid
  } else if (dbusersemail.length > 0) {
    const [result] = await db.query(
      'UPDATE users SET google_uid = ? WHERE email = ?',
      [google_uid, email]
    )
    if (result.affectedRows === 1) {
      const [gUsers] = await db.query(
        'SELECT * FROM users WHERE google_uid = ?',
        [google_uid]
      )
      if (gUsers.length > 0) {
        const gUser = gUsers[0]
        returnUser = {
          id: gUser.id,
          user_name: gUser.user_name,
          google_uid: gUser.google_uid,
        }
      } else {
        throw new Error('Failed to retrieve new user after insertion')
      }
    } else {
      throw new Error('Failed to insert new user')
    }
  } else {
    // const member_id = uuidv4()
    const [result] = await db.query(
      // 'INSERT INTO users (member_id, email, user_name, google_uid) VALUES (?, ?, ?, ?)',
      'INSERT INTO users ( email, user_name, google_uid) VALUES (?, ?, ?)',
      // [member_id, email, displayName, google_uid]
      [email, displayName, google_uid]
    )
    // console.log(result)

    if (result.affectedRows === 1) {
      const [newUsers] = await db.query(
        'SELECT * FROM users WHERE google_uid = ?',
        [google_uid]
      )
      if (newUsers.length > 0) {
        const newUser = newUsers[0]
        returnUser = {
          id: newUser.id,
          user_name: newUser.user_name,
          google_uid: newUser.google_uid,
        }

        // auto sent coupons
        try {
          // 獲取自動發送的優惠券列表
          const autoSentCoupons = await getAutoSentCouponList()
          // 為新用戶添加自動發送的優惠券
          for (const couponCode of autoSentCoupons) {
            try {
              const [result] = await db.query(
                `
                INSERT INTO users_coupons (user_id, coupon_id)
                SELECT u.id, c.id
                FROM users u
                JOIN coupons c ON c.code = ?
                WHERE u.id = ?
                `,
                [couponCode, newUser.id]
              )
              if (result.affectedRows === 0) {
                console.warn(
                  `Failed to assign coupon ${couponCode} to new user`
                )
              } else {
                console.log(
                  `Successfully assigned coupon ${couponCode} to new user`
                )
              }
            } catch (couponError) {
              console.error(
                `Error assigning coupon ${couponCode}:`,
                couponError
              )
            }
          }
        } catch (error) {
          // 自動發送優惠券時出現錯誤，但暫時不做處理
          console.error('Error in auto-sending coupons:', error)
        }
      } else {
        throw new Error('Failed to retrieve new user after insertion')
      }
    } else {
      throw new Error('Failed to insert new user')
    }
  }

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, secretKey, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(react可以儲存在state中使用)
  return res.json({
    status: 'success',
    data: {
      accessToken,
    },
  })
})

export default router
