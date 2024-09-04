import styles from './member.module.scss'
import Link from 'next/link'
import { useState, useEffect } from 'react'
// countdown use
import useInterval from '@/hooks/use-interval'

import { requestOtpToken, resetPassword } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)

  // 倒數計時 countdown use
  const [count, setCount] = useState(60) // 60s
  const [delay, setDelay] = useState(null) // delay=null可以停止, delay是數字時會開始倒數

  // 倒數計時 countdown use
  useInterval(() => {
    setCount(count - 1)
  }, delay)
  // 倒數計時 countdown use
  useEffect(() => {
    if (count <= 0) {
      setDelay(null)
      setDisableBtn(false)
    }
  }, [count])

  // 處理要求一次性驗証碼用
  const handleRequestOtpToken = async () => {
    if (delay !== null) {
      toast.error('錯誤 - 60s內無法重新獲得驗証碼')
      return
    }

    const res = await requestOtpToken(email)

    // 除錯用
    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('資訊 - 驗証碼已寄送到電子郵件中')
      setCount(60) // 倒數 60秒
      setDelay(1000) // 每 1000ms = 1s 減1
      setDisableBtn(true)
    } else {
      toast.error(`錯誤 - ${res.data.message}`)
    }
  }

  // 處理重設密碼用
  const handleResetPassword = async () => {
    const res = await resetPassword(email, password, token)
    // 除錯用
    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('資訊 - 密碼已成功修改')
    } else {
      toast.error(`錯誤 - ${res.data.message}`)
    }
  }


  return (
    <>
      <main className={styles.ForgetPS}>
        <div className={`${styles['forgetps']}`}>
          <div
            className={['d-flex flex-column', styles['forgetpssec']].join(' ')}
          >
            <div className='d-flex justify-content-center my-3'>
              <img src="/images/mobile-password.png" alt="" width={180} />
            </div>
            <h2 className="text-center my-5">重設密碼</h2>
            <p className="text-center my-3">輸入你的會員電子郵件地址，按下&quot;取得驗證碼&ldquo;按鈕後，我們會將密碼重設指示寄送給你。</p>
            <div
              className={`mb-3 ${styles['fp-form']}`}
            >
              <label className="mt-3">
                電子郵件*
                <div className='d-flex'>
                  <input
                    type="email"
                    placeholder="請輸入你的電子郵件"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary p-0"
                    id="button-addon2"
                    onClick={handleRequestOtpToken} disabled={disableBtn}
                  >
                    {delay ? count + '秒後可以再次取得驗証碼' : '取得驗証碼'}
                  </button>
                </div>
              </label>
              {/* <span className={`${styles['error']}`}>{errors.email}</span> */}
              <label className="mt-3">
                電子郵件驗證碼*
                <input
                  type="text"
                  value={token}
                  placeholder="請輸入你的電子郵件驗證碼"
                  onChange={(e) => setToken(e.target.value)}
                />
              </label>
              {/* <span className={`${styles['error']}`}>{errors.email}</span> */}
              <label className="mt-3">
                新密碼*
                <div
                  className={`${styles['inputarea']} "d-flex justify-between"`}
                >
                  <input
                    type="text"
                    placeholder="請輸入你的密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>
              {/* <span className={`${styles['error']}`}>{errors.password}</span> */}
              <div
                className={[
                  styles['btn-div'],
                  'm-2 d-flex justify-content-center',
                ].join(' ')}
              >
                <button
                  className={`${styles['btn-in']} mt-4`}
                  onClick={handleResetPassword}
                >
                  重設密碼
                </button>
              </div>
            </div>
            <div
              className={`${styles['form-footer']} d-flex justify-content-center mb-5`}
            >
              <Link href="/member/login">返回登入</Link>
            </div>
          </div>
          {/* 土司訊息視窗用 */}
          <Toaster />
        </div>
      </main>
    </>
    // <main className={`form-member w-100 m-auto text-center`}>
    //   <h2 className="text-center mb-5">重設密碼</h2>
    //   <p className={`text-center mb-3 ${styles['text-note']}`}>
    //     輸入你的會員電子郵件地址，按下&quot;取得驗証碼&ldquo;按鈕後，我們會將密碼重設指示寄送給你。
    //   </p>
    //   <div className={`${styles['fp-form']}`}>
    //     <div className="row mb-3">
    //       <div className="col-sm-12">
    //         <input
    //           type="email"
    //           className=''
    //           placeholder="電子郵件地址"
    //         />
    //       </div>
    //       <div className={`${styles['error']} my-2 text-start`}>
    //         請輸入有效的註冊會員電子郵件地址。
    //       </div>
    //     </div>
    //     <div className="row mb-3">
    //       <div className="col-sm-12">
    //         <div className="input-group">
    //           <input
    //             type="text"
    //             className={`form-control ${styles['form-control']} ${styles['invalid']} `}
    //             placeholder="電子郵件驗證碼"
    //           />
    //           <button
    //             className="btn btn-outline-secondary"
    //             type="button"
    //             id="button-addon2"
    //           >
    //             取得驗証碼
    //           </button>
    //         </div>
    //       </div>
    //       <div className={`${styles['error']} my-2 text-start`}>
    //         請輸入驗証碼。
    //       </div>
    //     </div>

    //     <div className="row mb-3">
    //       <div className="col-sm-12">
    //         <input
    //           type="password"
    //           className={`form-control w-100 ${styles['form-control']} ${styles['invalid']} `}
    //           placeholder="密碼"
    //         />
    //       </div>
    //       <div className={`${styles['error']} my-2 text-start`}>
    //         請輸入新密碼。
    //       </div>
    //     </div>
    //     <div className="row mb-3">
    //       <div className="col-sm-12">
    //         <input
    //           type="password"
    //           className={`form-control w-100 ${styles['form-control']} ${styles['invalid']} `}
    //           placeholder="確認密碼"
    //         />
    //       </div>
    //       <div className={`${styles['error']} my-2 text-start`}>
    //         請輸入確認密碼。
    //       </div>
    //     </div>

    //     <button type="submit" className="btn btn-primary w-100">
    //       確定
    //     </button>

    //     <div className="row mt-2">
    //       <p className={`${styles['notice']}`}>
    //         還不是會員？
    //         <Link href="/member/register">加入我們</Link>。
    //       </p>
    //     </div>
    //   </div>
    // </main >
  )
}
