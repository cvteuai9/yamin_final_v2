import express from 'express'
const router = express.Router()

import { createOtp, updatePassword } from '#db-helpers/otp.js'

import transporter from '#configs/mail.js'
import 'dotenv/config.js'

const mailHtml = (otpToken) => `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>重設密碼驗證碼</title>
    <style>
        body {
            font-family: Arial, "Microsoft JhengHei", sans-serif;
            line-height: 1.6;
            color: #faf7f0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #003445;
        }
        .header {
            background-color: #B29564;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #003E52;
            color: #faf7f0;         
        }
        .textp{
            color: #faf7f0;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            color: #B29564;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #faf7f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>雅茗 - 重設密碼驗證碼</h1>
        </div>
        <div class="content">
            <p class="textp">親愛的網站會員您好，</p>
            <p class="textp">這是您重設密碼所需要的驗證碼。請在重設密碼頁面的"電子郵件驗證碼"欄位中輸入以下的6位數字：</p>
            <div class="otp">${otpToken}</div>
            <p>請注意，此驗證碼將於寄送後30分鐘後到期。</p>
            <p>如有任何問題，請聯繫我們的客服人員。</p>
        </div>
        <div class="footer">
            <p>雅茗敬上</p>
            <p>此郵件為系統自動發送，請勿直接回覆。</p>
        </div>
    </div>
</body>
</html>`
// create otp
router.post('/otp', async (req, res, next) => {
  const { email } = req.body
  console.log('email', email)
  if (!email) return res.json({ status: 'error', message: '缺少必要資料' })

  // 建立otp資料表記錄，成功回傳otp記錄物件，失敗為空物件{}
  const otp = await createOtp(email)

  // console.log(otp)

  if (!otp.token)
    return res.json({ status: 'error', message: 'Email錯誤或期間內重覆要求' })

  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人名稱，email在.env檔中代入
    from: `"雅茗"<${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: '重設密碼要求的電子郵件驗證碼',
    html: mailHtml(otp.token),
  }

  // 寄送email
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      // console.log(err)
      return res.json({ status: 'error', message: '發送電子郵件失敗' })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
})

// 重設密碼用
router.post('/reset', async (req, res) => {
  const { email, token, password } = req.body
  console.log(email)
  if (!token || !email || !password) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // updatePassword中驗証otp的存在與合法性(是否有到期)
  const result = await updatePassword(email, token, password)

  if (result.status === 'fail') {
    return res.json({ status: 'error', message: result.message })
  }

  // 成功
  return res.json({ status: 'success', data: null })
})

export default router
