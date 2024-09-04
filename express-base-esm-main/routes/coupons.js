import express from 'express'
import db from '#configs/mysql.js'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router()

// 獲取註冊後自動送出的優惠券清單
export async function getAutoSentCouponList() {
  try {
    const [coupons] = await db.query(
      `
      SELECT code
      FROM coupons
      WHERE auto_send = 1
      `
    )
    // 檢查查詢結果
    if (!Array.isArray(coupons)) {
      console.warn('Unexpected result format from database query')
      return []
    }

    // 如果是空數組，直接返回
    if (coupons.length === 0) {
      return []
    }

    // 如果只有一個元素，將其包裝在數組中
    if (coupons.length === 1) {
      return coupons[0].code ? [coupons[0].code] : []
    }

    // 多個元素的情況，使用 map
    return coupons.map((coupon) => coupon.code).filter(Boolean)
  } catch (error) {
    console.error('Error fetching auto-sent coupons:', error)
    throw error
  }
}

export async function getUnClaimedAnnivCouponListById(userId) {
  try {
    // 返回未領過的清單，領過不重複給
    const [coupons] = await db.query(
      `
      SELECT
        name
        ,code
        ,discount
        ,info
        ,uc.user_id
        FROM coupons AS c
          LEFT JOIN users_coupons AS uc 
          ON c.id = uc.coupon_id AND uc.user_id = ?
        WHERE 1=1
          AND name LIKE "全館%"
          AND c.status = "available"
          AND uc.user_id IS NULL
      `,
      [userId]
    )
    // 檢查查詢結果
    if (!Array.isArray(coupons)) {
      console.warn('Unexpected result format from database query')
      return []
    }

    // 如果是空數組，返回空
    if (coupons.length === 0) {
      return []
    }

    // 多個元素的情況，使用 map
    return coupons
      .map(({ name, code, discount, info }) => ({ name, code, discount, info }))
      .filter((coupon) => coupon.code)
  } catch (error) {
    console.error('Error fetching anniv coupons:', error)
    throw error
  }
}

// POST 領取週年慶優惠券
router.post(
  '/claim-anniv-coupons',
  authenticate,
  async (req, res) => {
    const userId = Number(req.user.id)
    var annivCoupons = []
    try {
      // 獲取全館優惠列表
      annivCoupons = await getUnClaimedAnnivCouponListById(userId)

      // 全部都領過為0，返回不可重複領取
      if (annivCoupons.length === 0) {
        return res.status(401).json({
          error: 'COUPON_ALREADY_CLAIMED',
          status: 'failed',
          data: null,
        })
      }

      console.log('準備發放優惠券', annivCoupons)
      const annivCouponCodeList = annivCoupons.map((coupon) => coupon.code)

      // 開始發送優惠券
      for (const couponCode of annivCouponCodeList) {
        try {
          const [result] = await db.query(
            `
          INSERT INTO users_coupons (user_id, coupon_id)
          SELECT u.id, c.id
          FROM users u
          JOIN coupons c ON c.code = ?
          WHERE u.id = ?
          `,
            [couponCode, userId]
          )
          if (result.affectedRows === 0) {
            console.warn(
              `Failed to assign coupon ${couponCode} to user ${userId}`
            )
          } else {
            console.log(
              `Successfully assigned coupon ${couponCode} to user ${userId}`
            )
          }
        } catch (couponError) {
          console.error(`Error assigning coupon ${couponCode}:`, couponError)
        }
      }
    } catch (error) {
      // 發送優惠券時出現錯誤，但暫時不做處理
      console.error('Error in sending coupons:', error)
    }

    return res.status(201).json({
      status: 'success',
      message: 'success claimed anniv coupons',
      data: annivCoupons,
    })
  },

  // GET /coupons 獲取特定用戶的所有優惠券
  router.get('/', authenticate, async (req, res) => {
    const userId = Number(req.user.id)
    try {
      const [coupons] = await db.query(
        `
      SELECT uc.user_id, uc.status AS user_status , c.*
      FROM users_coupons AS uc
      LEFT JOIN coupons AS c ON c.id = uc.coupon_id
      WHERE uc.user_id = ?
      `,
        [userId]
      )
      res.json(coupons)
    } catch (error) {
      console.error('Error fetching user coupons:', error)
      res.status(500).json({ error: 'Failed to retrieve user coupons' })
    }
  }),

  // POST / - 為用戶添加優惠券
  router.post('/', authenticate, async (req, res) => {
    const { couponCode } = req.body
    const userId = Number(req.user.id)
    if (!userId || !couponCode) {
      return res.status(400).json({ error: 'ERROR_INPUT' })
    }

    try {
      // 首先檢查是否已經領過
      const [claimed] = await db.query(
        `
      SELECT 1
            FROM users_coupons AS uc
            LEFT JOIN coupons AS c
            ON uc.coupon_id = c.id
            WHERE uc.user_id = ?
            AND c.code = ? 
            AND c.code IS NOT NULL
      `,
        [userId, couponCode]
      )
      if (claimed.length > 0) {
        return res.status(401).json({ error: 'COUPON_ALREADY_CLAIMED' })
      }

      // 首先檢查優惠券存在且已開放
      const [coupons] = await db.query(
        `
        SELECT id
            FROM coupons
            WHERE code = ?   
            AND status != 'unreleased'  
        `,
        [couponCode]
      )

      if (coupons.length === 0) {
        return res.status(401).json({ error: 'COUPON_NOT_FOUND' })
      }

      // 首先檢查優惠券是否過期
      const [expired] = await db.query(
        `
        SELECT id
            FROM coupons
            WHERE code = ?
            AND status = 'expired'
        `,
        [couponCode]
      )

      if (expired.length === 1) {
        return res.status(401).json({ error: 'COUPON_EXPIRED' })
      }

      const couponId = coupons[0].id

      // // ===========08-27 julia_test區
      // const [availableCoupons] = await db.query(
      //   `
      //   SELECT id, code, name, discount
      //   FROM coupons
      //   WHERE name LIKE '全館%' AND status = 'active' AND id NOT IN (
      //     SELECT coupon_id FROM users_coupons WHERE user_id = ?
      //   )
      //   LIMIT 1
      //   `,
      //   [userId]
      // )
      // if (availableCoupons.length === 0) {
      //   await db.rollback()
      //   return res.status(404).json({ error: 'No available global coupons' })
      // }
      // const coupon = availableCoupons[0]
      // // 將優惠券分配給用戶
      // await db.query(
      //   `INSERT INTO users_coupons (user_id, coupon_id, status) VALUES (?, ?, 'unused')`,
      //   [userId, coupon.id]
      // )
      // // 提交交易
      // await db.commit()
      // // ===========08-27 julia_test區

      // 寫入DB
      const [result] = await db.query(
        `
      INSERT INTO users_coupons (user_id, coupon_id) VALUE(?, ?)
      `,
        [userId, couponId]
      )

      res.status(201).json({
        id: result.insertId,
        user_id: userId,
        coupon_id: couponId,
        coupon_code: couponCode,
      })
    } catch (error) {
      console.error('Error creating user coupon:', error)
      res.status(500).json({ error: 'Failed to create user coupon' })
    }
  })
)
export default router
