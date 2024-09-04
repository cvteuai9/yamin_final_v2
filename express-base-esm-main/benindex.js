import express from 'express'
import multer from 'multer'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const secretKey = process.argv[2]
const mode = process.argv[3] //開發者模式package.json => "dev": "nodemon index.mjs benbenbenIamBen dev"
const blackList = []

const defaultData = { user: [], products: [] }
const db = new Low(new JSONFile('db.json'), defaultData)
await db.read()
// console.log(db.data);

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
const app = express()
app.use(cors(corsOptions))
// 續路由部份

app.get('/', (req, res) => {
  res.send('首頁')
})

app.get('/api/users/', (req, res) => {
  let users = db.data.user.map((u) => {
    // 只有psw不要 => 剩餘參數
    const { password, ...others } = u
    return others
  })
  // console.log(users);
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
})

// 要放在app.get("/api/users/:id",(req,res)=>{ 前面，才不會讓search變成id
app.get('/api/users/search/', (req, res) => {
  const id = req.query.id //用於獲取查詢參數（Query Parameters）是URL中?之後的部分，它們通常用來過濾、排序或進行其他操作。
  let results = db.data.user.filter((u) => u.account.includes(id))
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

app.post('/api/users/login', upload.none(), (req, res) => {
  const { account, password } = req.body
  let user
  // if (mode==="dev") {
  //   //找到想要比對的使用者
  //   user = db.data.user.find(u=>u.account ===account && u.password===password);
  // }else{
  //   接SQL處理，與mySQL部分
  //   user = await ...
  // }
  user = db.data.user.find(
    (u) => u.account === account && u.password === password
  )

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
      account: user.account,
      name: user.name,
      mail: user.mail,
      head: user.head,
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
  })

  // console.log(result); //帳號密碼打錯result會顯示undefined，就是!user
  // console.log("result");
  // res.status(200).send("使用者登入："+account);
})

// 使用開發者模式npm run dev會顯示“使用者登出”
// 使用正式模式npm start,因為Authorization沒有token,會顯示
// {
//   status: "error",
//   message: "沒有驗證資料,請重新登入",
// }
app.get(
  '/api/users/logout',
  (req, res, next) => {
    // 匿名的function:(req,res,next)=>{}
    if (mode === 'dev') {
      next()
    } else {
      checkToken(req, res, next)
    }
  },
  (req, res) => {
    if (mode === 'dev') {
      // 目的在測路由規則，如果有很多模式要測試這樣方便使用
      res.status(200).send('使用者登出')
      return
    }
    let token2 = req.get('Authorization')
    token2 = token2.slice(7)
    //blackList
    const { account, name, mail, head } = req.decoded
    if (!account) {
      res.status(400).json({
        status: 'fail',
        message: '登出失敗，請稍後再試',
      })
      return
    }
    const token = jwt.sign(
      {
        account: undefined,
        name: undefined,
        mail: undefined,
        head: undefined,
      },
      secretKey,
      {
        expiresIn: '-1s',
      }
    )
    blackList.push(token2)
    res.status(200).json({
      status: 'success',
      message: '登出成功',
      token,
    })
  }
)

app.get(
  '/api/users/status',
  (req, res, next) => {
    if (mode === 'dev') {
      next()
    } else {
      checkToken(req, res, next)
    }
  },
  (req, res) => {
    if (mode === 'dev') {
      res.status(200).send('檢查使用者登入狀態')
      return
    }
    const { account, name, mail, head } = req.decoded
    if (!account) {
      res.status(400).json({
        status: 'fail',
        message: '驗證錯誤，請重新登入',
      })
      return
    }
    const token = jwt.sign(
      {
        account,
        name,
        mail,
        head,
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

app.get('/api/users/:id', (req, res) => {
  const id = req.params.id //路由參數使用方法
  let user = db.data.user.find((u) => u.id === id)
  if (!user) {
    res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
    return
  }
  res.status(200).json({
    status: 'success',
    message: '獲取使用者成功',
    user,
  })
  // res.status(200).send("獲取特定ID的使用者：" + id);
})

app.post('/api/users/', upload.none(), async (req, res) => {
  // 有安裝multer,就可以用upload.none()幫我們把表單的內容產生在req.body裡面
  const { account, password, name, mail, head } = req.body
  let id = uuidv4()
  db.data.user.push({
    id,
    account,
    password,
    name,
    mail,
    head,
  })
  await db.write()


  
  res.status(201).json({
    status: 'success',
    message: '註冊成功',
    id,
  })
})

app.put('/api/users/:id', upload.none(), async (req, res) => {
  const id = req.params.id
  const { account, password, name, mail, head } = req.body
  let user = db.data.user.find((u) => u.id === id)
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
  }
  // let newData = { account, password, name, mail, head }; //使用者送出的新的資料（postman:body->form-data的資料）
  // user = {...user, ...newData}; //但會脫離db資料，是新的user
  // console.log(user);
  Object.assign(user, { account, password, name, mail, head })
  await db.write()
  res.status(200).json({
    status: 'success',
    message: '修改成功',
  })
})

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id
  let user = db.data.user.find((u) => u.id === id)
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: '找不到使用者',
    })
  }
  db.data.user = db.data.user.filter((u) => u.id !== id)
  await db.write()
  res.status(200).json({
    status: 'success',
    message: '刪除成功',
  })
  // res.status(200).send("刪除特定ID的使用者：" + id);
})

app.listen(3001, () => {
  console.log('http://localhost:3001')
})

function checkToken(req, res, next) {
  let token = req.get('Authorization')

  if (token && token.indexOf('Bearer ') === 0) {
    token = token.slice(7)
    // 開發中會用blackList測試
    // 類似session的做法
    // 不是很保險，因為伺服器重啟blackList就會消失
    // if(blackList.includes(token)){
    //   return res.status(401).json({
    //     status: "error",
    //     message: "登入驗證失效，請重新登入",
    //   });
    // }
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        res.status(401).json({
          status: 'error',
          message: '登入驗證失效，請重新登入',
        })
        return
      }
      req.decoded = decoded // 有拿到資料就拿
      next() //有中間鍵middleware可以繞出去
    })
  } else {
    res.status(401).json({
      status: 'error',
      message: '沒有驗證資料,請重新登入',
    })
  }
}
