import express from 'express'
import cors from 'cors'
// 上傳檔案用使用multer
import path from 'path'
import multer from 'multer'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import authenticate from '#middlewares/authenticate.js'
import { v4 as uuidv4 } from 'uuid'
// 密碼編碼和檢查比對用
import { generateHash, compareHash } from '##/db-helpers/password-hash.js'
// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
// eslint-disable-next-line import/namespace
import { getAutoSentCouponList } from '../routes/coupons.js'

const router = express.Router()

// 解析 JSON 請求體
router.use(express.json())

// 資料庫使用直接使用 mysql 來查詢
import db from '#configs/mysql.js'

// 定義安全的私鑰字串
const secretKey = process.env.ACCESS_TOKEN_SECRET

// const blackList = []
// multer的設定值 - START
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // 存放目錄
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    // 經授權後，req.user帶有會員的id
    const newFilename = req.user.id
    // 新檔名由表單傳來的req.body.newFilename決定
    callback(null, newFilename + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })
// multer的設定值 - END

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

router.get('/', async function (req, res) {
  const [rows] = await db.query('SELECT * FROM users')

  // map不回傳就跟foreach一樣
  const users = rows.map((u) => {
    // 不需要 .data 是因為資料已經是從資料庫直接取得的，而不是從本地的物件資料結構中讀取的。
    // 只有psw不要 => 剩餘參數
    const { password, ...others } = u
    return others
  })
  if (!users) {
    return res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
  }
  res.status(200).json({
    status: 'success',
    message: '獲取所有使用者成功',
    users,
  })
  // return res.json({ status: 'success', data: { users } })
})

router.get('/search', async (req, res) => {
  const [users] = await db.query('SELECT * FROM users')
  const id = req.query.id //用於獲取查詢參數（Query Parameters）是URL中?之後的部分，它們通常用來過濾、排序或進行其他操作。
  let results = users.filter((u) => u.email.includes(id))
  if (!results) {
    res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
    return
  }
  res.status(200).json({
    status: 'success',
    message: '找到使用者',
    users: results,
  })
  // res.status(200).send("使用 ID 作為搜尋條件來搜尋使用者：" + id);
})

// 創uuid
// router.get('/push', async (req, res) => {
//   try {
//     // 查询 `member_id` 为空的记录
//     const [users] = await db.query(
//       'SELECT id FROM users WHERE member_id IS NULL OR member_id = ""'
//     )

//     // 为每条记录生成 UUID 并更新
//     for (const user of users) {
//       const member_id = uuidv4()

//       await db.query('UPDATE users SET member_id = ? WHERE id = ?', [
//         member_id,
//         user.id,
//       ])
//     }

//     console.log('UUIDs generated and updated for existing records.')
//   } catch (error) {
//     console.error('Error updating member_id:', error)
//   }
// })

router.get('/:id', authenticate, async (req, res) => {
  const [users] = await db.query('SELECT * FROM users')
  const id = parseInt(req.params.id) //路由參數使用方法
  let dbuser = users.find((u) => u.id === id)
  // console.log(users)
  if (!dbuser) {
    res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
    return
  }
  // res.status(200).json({
  //   status: 'success',
  //   message: '獲取使用者成功',
  //   user,
  // })
  const { password, ...user } = dbuser
  return res.json({ status: 'success', data: { user } })
})

// 註冊，新增使用者
// router.post('/', upload.none(), async (req, res) => {
//   // 有安裝multer,就可以用upload.none()幫我們把表單的內容產生在req.body裡面
//   // const [users] = await db.query('SELECT * FROM users')
//   const { email, password, user_name } = req.body
//   // let member_id = uuidv4()
//   await db.query(
//     // 'INSERT INTO users (member_id email, password, user_name) VALUES (?, ?, ?,?)',
//     'INSERT INTO users ( email, password, user_name) VALUES (?, ?, ?)',
//     [email, password, user_name]
//     // [member_id, email, password, user_name]
//   )
//   return res.status(201).json({
//     status: 'success',
//     message: '註冊成功',
//     // member_id,
//   })
// })
router.post('/', async function (req, res) {
  // 要新增的會員資料
  const newMember = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (!newMember.user_name || !newMember.email || !newMember.password) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 先檢查username或是email不能有相同的
  const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
    newMember.email,
  ])

  console.log('rows', rows)

  if (rows.length > 0) {
    return res.json({
      status: 'error',
      message: '建立會員失敗，有重覆的帳號或email',
    })
  }

  // 以下是準備新增會員
  // 1. 進行密碼編碼
  const passwordHash = await generateHash(newMember.password)

  // 2. 新增到資料表
  const [rows2] = await db.query(
    `INSERT INTO users(user_name, password, email, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW())`,
    [newMember.user_name, passwordHash, newMember.email]
  )

  console.log(rows2)

  if (!rows2.insertId) {
    return res.json({
      status: 'error',
      message: '建立會員失敗，資料庫錯誤',
    })
  }

  // 註冊成功，自動發送優惠券
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
          WHERE u.password = ?
          `,
          [couponCode, passwordHash]
        )
        if (result.affectedRows === 0) {
          console.warn(`Failed to assign coupon ${couponCode} to new user`)
        } else {
          console.log(`Successfully assigned coupon ${couponCode} to new user`)
        }
      } catch (couponError) {
        console.error(`Error assigning coupon ${couponCode}:`, couponError)
      }
    }
  } catch (error) {
    // 自動發送優惠券時出現錯誤，但暫時不做處理
    console.error('Error in auto-sending coupons:', error)
  }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  return res.status(201).json({
    status: 'success',
    data: null,
  })
})

// 更新使用者
router.put('/:id', upload.none(), async (req, res) => {
  const [users] = await db.query('SELECT * FROM users')
  const id = parseInt(req.params.id)
  let { email, user_name, nick_name, phone, birthday, gender } = req.body

  let user = users.find((u) => u.id === id)
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
  }
  await db.query(
    'UPDATE users SET email = ?, user_name = ?,nick_name=?,phone=?,birthday=?,gender=? WHERE id = ?',
    [email, user_name, nick_name, phone, birthday, gender, id]
  )
  return res.json({ status: 'success', data: { user } })
})

router.delete('/:id', async (req, res) => {
  const [users] = await db.query('SELECT * FROM users')
  const id = req.params.id
  let user = users.find((u) => u.member_id === id)
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
  }
  await db.query('DELETE FROM users WHERE member_id = ?', [id])
  res.status(200).json({
    status: 'success',
    message: '刪除成功',
  })
})
// POST - 可同時上傳與更新會員檔案用，使用multer(設定值在此檔案最上面)
router.post(
  '/upload-avatar',
  authenticate,
  upload.single('avatar'), // 上傳來的檔案(這是單個檔案，表單欄位名稱為avatar)
  async function (req, res) {
    // req.file 即上傳來的檔案(avatar這個檔案)
    // req.body 其它的文字欄位資料…
    console.log(req.file, req.body)

    if (req.file) {
      const id = req.user.id
      const data = req.file.filename
      console.log(data)

      // 對資料庫執行update
      const [affectedRows] = await db.query(
        'UPDATE users SET user_image=? WHERE id =?',
        [data, id]
      )

      // 沒有更新到任何資料 -> 失敗或沒有資料被更新
      if (!affectedRows) {
        return res.json({
          status: 'error',
          message: '更新失敗或沒有資料被更新',
        })
      }

      return res.json({
        status: 'success',
        data: { user_image: req.file.filename },
      })
    } else {
      return res.json({ status: 'fail', data: null })
    }
  }
)

// PUT - 更新會員資料(排除更新密碼)
router.put('/:id/profile', authenticate, async function (req, res) {
  const id = parseInt(req.params.id)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  // user為來自前端的會員資料(準備要修改的資料)
  const user = req.body
  const { email, user_name, nick_name, phone, birthday, gender } = user

  // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)
  if (!id || !user.user_name) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 查詢資料庫目前的資料
  const dbUser = await db.query('SELECT * FROM users WHERE id = ?', [id])

  // null代表不存在
  if (!dbUser) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // 有些特殊欄位的值沒有時要略過更新，不然會造成資料庫錯誤
  // if (!user.birth_date) {
  //   delete user.birth_date
  // }

  // 對資料庫執行update
  const [affectedRows] = await db.query(
    'UPDATE users SET email = ?, user_name = ?,nick_name=?,phone=?,birthday=?,gender=? WHERE id = ?',
    [email, user_name, nick_name, phone, birthday, gender, id]
  )

  // 沒有更新到任何資料 -> 失敗或沒有資料被更新
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗或沒有資料被更新' })
  }

  // 更新成功後，找出更新的資料，updatedUser為更新後的會員資料
  const updatedUser = await db.query('SELECT * FROM users WHERE id = ?', [id])

  // password資料不需要回應給瀏覽器
  // delete updatedUser.password
  //console.log(updatedUser)
  // 回傳
  return res.json({ status: 'success', data: { user: updatedUser } })
})
// PUT - 更新會員資料(密碼更新用)
router.put('/:id/password', authenticate, async function (req, res) {
  const id = getIdParam(req)

  try {
    // 檢查是否為授權會員，只有授權會員可以存取自己的資料
    if (req.user.id !== id) {
      return res.json({ status: 'error', message: '存取會員資料失敗' })
    }

    // user為來自前端的會員資料(準備要修改的資料)
    const userPassword = req.body

    // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)，從前端接收的資料為
    // {
    //   originPassword: '', // 原本密碼，要比對成功才能修改
    //   newPassword: '', // 新密碼
    // }
    if (!id || !userPassword.origin || !userPassword.new) {
      return res.json({ status: 'error', message: '缺少必要資料' })
    }

    // 查詢資料庫目前的資料
    const [dbUserRow] = await db.query('SELECT * FROM users WHERE id = ?', [id])

    // null代表不存在
    if (!dbUserRow) {
      return res.json({ status: 'error', message: '使用者不存在' })
    }
    const [dbUser] = dbUserRow

    // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
    // isValid=true 代表正確
    console.log('Origin Password:', userPassword.origin)
    console.log('Hashed Password:', dbUser.password)
    const isValid = await compareHash(userPassword.origin, dbUser.password)

    // isValid=false 代表密碼錯誤
    if (!isValid) {
      return res.status(401).json({ status: 'error', message: '密碼錯誤' })
    } else {
      const passwordHash = await generateHash(userPassword.new)

      // 對資料庫執行update
      const [affectedRows] = await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [passwordHash, id]
      )

      // 沒有更新到任何資料 -> 失敗
      if (!affectedRows) {
        return res.json({ status: 'error', message: '更新失敗' })
      }
      // 成功，不帶資料
      return res.json({ status: 'success', data: null })
    }
  } catch (error) {
    console.error('Update error:', error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})
// PUT - 更新會員資料(密碼更新用)
router.put('/:id/password', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  // user為來自前端的會員資料(準備要修改的資料)
  const userPassword = req.body

  // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)，從前端接收的資料為
  // {
  //   originPassword: '', // 原本密碼，要比對成功才能修改
  //   newPassword: '', // 新密碼
  // }
  if (!id || !userPassword.origin || !userPassword.new) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 查詢資料庫目前的資料
  const [dbUserRow] = await db.query('SELECT * FROM users WHERE id = ?', [id])

  // null代表不存在
  if (!dbUserRow) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }
  const [dbUser] = dbUserRow

  // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
  // isValid=true 代表正確
  const isValid = await compareHash(userPassword.origin, dbUser.password)

  // isValid=false 代表密碼錯誤
  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }
  const passwordHash = await generateHash(userPassword.new)

  // 對資料庫執行update
  const [affectedRows] = await db.query(
    'UPDATE users SET password = ? WHERE id = ?',
    [passwordHash, id]
  )

  // 沒有更新到任何資料 -> 失敗
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗' })
  }

  // 成功，不帶資料
  return res.json({ status: 'success', data: null })
})
export default router
