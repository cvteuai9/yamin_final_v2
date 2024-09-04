import express from 'express'
import cors from 'cors'
import multer from 'multer'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import authenticate from '#middlewares/authenticate.js'
import { v4 as uuidv4 } from 'uuid'
const router = express.Router()
// 解析 JSON 請求體
router.use(express.json())

// 資料庫使用直接使用 mysql 來查詢
import db from '#configs/mysql.js'

// 定義安全的私鑰字串
const secretKey = process.env.ACCESS_TOKEN_SECRET

// const blackList = []
const upload = multer()

// 設定部份
let whitelist = ['http://localhost:5500', 'http://localhost:3000']
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

router.use(cors(corsOptions))

// 檢查登入狀態用
// authenticate 中間件會在請求進入路由處理程序之前執行，用來確保用戶已經登入並且有權訪問該路由。
router.get('/check', authenticate, async (req, res) => {
  try {
    // 取得用戶ID
    const userId = parseInt(req.user.id)

    // 執行原生 SQL 查詢
    const [rows] = await db.query(
      'SELECT id, user_name, email,nick_name,phone,gender,birthday FROM users WHERE id = ?',
      [userId]
    )

    // 檢查是否找到使用者
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' })
    }

    // 取得使用者資料
    const user = rows[0]

    // 回傳資料，不包含密碼
    return res.json({ status: 'success', data: { user } })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ status: 'error', message: 'Database query error' })
  }
})

router.post('/login', upload.none(), async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users')
  const { email, password } = req.body

  const user = rows.find((u) => u.email === email && u.password === password)
  if (!user) {
    res.status(400).json({
      status: 'fail',
      message: '使用者帳號密碼錯誤',
    })
    return
  }
  // 登入成功送出的內容
  const token = jwt.sign(
    {
      // account: user.account,
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      // head: user.head,
    },
    secretKey,
    {
      // 讓token有期限:expiresIn多少時間後會過期
      expiresIn: '30m',
    }
  )
  res.status(200).json({
    status: 'success',
    token,
    user_name: user.user_name,
  })
})
router.get(
  '/logout',
  (req, res, next) => {
    // 匿名的function:(req,res,next)=>{}
    checkToken(req, res, next)
  },
  (req, res) => {
    const { user_name, email } = req.decoded

    if (!email) {
      res.status(400).json({
        status: 'fail',
        message: '登出失敗，請稍後再試',
      })
      return
    }
    const token = jwt.sign(
      {
        user_name: undefined,
        email: undefined,
      },
      secretKey,
      {
        expiresIn: '-1s',
      }
    )
    res.status(200).json({
      status: 'success',
      message: '登出成功',
      token,
    })
  }
)
router.post('/glogout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

router.get(
  '/status',
  (req, res, next) => {
    checkToken(req, res, next)
  },
  (req, res) => {
    const { id, user_name, email } = req.decoded
    if (!email) {
      res.status(400).json({
        status: 'fail',
        message: '驗證錯誤，請重新登入',
      })
      return
    }
    const token = jwt.sign(
      {
        id,
        user_name,
        email,
      },
      secretKey,
      {
        expiresIn: '30m',
      }
    )
    res.status(200).json({
      status: 'success',
      message: '使用者於登入狀態',
      token,
    })
  }
)

function checkToken(req, res, next) {
  let token = req.get('Authorization')

  if (token && token.indexOf('Bearer ') === 0) {
    token = token.slice(7)
    // 開發中會用blackList測試
    // 類似session的做法
    // 不是很保險，因為伺服器重啟blackList就會消失
    // if (blackList.includes(token)) {
    //   return res.status(401).json({
    //     status: 'error',
    //     message: '登入驗證失效，請重新登入',
    //   })
    // }
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.error('Token verification failed:', error.message)
        res.status(401).json({
          status: 'error',
          message: '登入驗證失效，請重新登入',
        })
        return
      }
      req.decoded = decoded // 有拿到資料就拿
      console.log('Decoded token:', req.decoded)
      next() //有中間鍵middleware可以繞出去
    })
  } else {
    res.status(401).json({
      status: 'error',
      message: '沒有驗證資料,請重新登入',
    })
  }
}

export default router
