import styles from './member.module.scss'
import Link from 'next/link'
import { useState, useEffect } from 'react'
// countdown use
import useInterval from '@/hooks/use-interval'

import { requestOtpToken, resetPassword } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import validator from 'validator'
import { RiEyeLine } from 'react-icons/ri'
import { RiEyeOffLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
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

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    token: '',
    password: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 處理要求一次性驗証碼用
  const handleRequestOtpToken = async () => {
    if (delay !== null) {
      toast.error('60s內無法重新獲得驗証碼')
      return
    }

    const res = await requestOtpToken(formData.email)

    // 除錯用
    // console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('驗證碼已寄送到電子郵件中')
      setCount(60) // 倒數 60秒
      setDelay(1000) // 每 1000ms = 1s 減1
      setDisableBtn(true)
    } else {
      // toast.error(`錯誤 - ${res.data.message}`)
      setErrors((prev) => ({
        ...prev,
        email: `${res.data.message}`,
      }))
    }
  }
  const router = useRouter()
  // checkbox 呈現密碼用
  const [showPassword, setShowPassword] = useState(false)
  // 處理重設密碼用
  const handleResetPassword = async () => {
    // Reset all errors
    setErrors({
      email: '',
      token: '',
      password: '',
    })

    // Validate inputs
    let newErrors = {}
    if (!formData.email) newErrors.email = 'Email為必填'
    if (!formData.token) newErrors.token = '驗證碼為必填'
    if (!formData.password) newErrors.password = '密碼為必填'
    // 強密碼驗證
    if (
      !validator.isStrongPassword(formData.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      newErrors.password = '密碼需為8到12個字元，必須包含大小寫英文字母和數字'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // console.log(formData.email)
      const res = await resetPassword(
        formData.email,
        formData.password,
        formData.token
      )
      if (res.data.status === 'success') {
        toast.success('密碼已成功修改，請重新登入')
        router.push('/member/login')
      } else {
        // Handle specific API errors
        if (res.data.message === 'OTP Token資料不存在') {
          setErrors((prev) => ({
            ...prev,
            token: '電子郵件驗證碼不存在',
          }))
        } else if (res.data.message === 'OTP Token已到期') {
          setErrors((prev) => ({ ...prev, token: '電子郵件驗證碼已過期' }))
        } else {
          toast.error('密碼重設失敗，請稍後再試')
        }
        // console.log(errors)
      }
    } catch (error) {
      toast.error('發生錯誤，請稍後再試')
    }
  }

  return (
    <>
      <main className={styles.ForgetPS}>
        <div className={`${styles['forgetps']}`}>
          <div
            className={['d-flex flex-column', styles['forgetpssec']].join(' ')}
          >
            <div className="d-flex justify-content-center my-3">
              <img src="/images/mobile-password.png" alt="" width={180} />
            </div>
            <h2 className="text-center my-5">重設密碼</h2>
            <p className="text-center my-3">
              輸入你的會員電子郵件地址，按下&quot;取得驗證碼&ldquo;按鈕後，我們會將密碼重設指示寄送給你。
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleResetPassword()
              }}
            >
              <div className={`mb-3 ${styles['fp-form']}`}>
                <label className="mt-3">
                  電子郵件*
                  <div className="d-flex">
                    <input
                      type="email"
                      name="email"
                      placeholder="請輸入電子郵件"
                      value={formData.email}
                      onChange={handleChange}
                      className={
                        errors.email && !email ? styles['hasError'] : ''
                      }
                    />
                    <button
                      type="button"
                      className={`${styles['btn-token']} 
                      "btn btn-outline-secondary p-0"`}
                      id="button-addon2"
                      onClick={handleRequestOtpToken}
                      disabled={disableBtn}
                    >
                      {delay ? count + '秒後可以再次取得驗證碼' : '取得驗證碼'}
                    </button>
                  </div>
                </label>
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
                <label className="mt-4">
                  電子郵件驗證碼*
                  <input
                    type="text"
                    name="token"
                    value={formData.token}
                    placeholder="請輸入電子郵件驗證碼"
                    onChange={handleChange}
                    className={errors.token ? styles.hasError : ''}
                  />
                </label>
                {errors.token && (
                  <span className={styles.error}>{errors.token}</span>
                )}
                <label className="mt-4">
                  新密碼*
                  <div
                    className={`${styles['inputarea']} "d-flex justify-between"`}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="請輸入新密碼"
                      value={formData.password}
                      onChange={handleChange}
                      className={
                        errors.password && !password ? styles['hasError'] : ''
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.icon}
                    >
                      {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                    </button>
                  </div>
                </label>
                {errors.password && (
                  <span className={styles.error}>{errors.password}</span>
                )}
                <div
                  className={[
                    styles['btn-div'],
                    'm-2 d-flex justify-content-center',
                  ].join(' ')}
                >
                  <button
                    className={`${styles['btn-in']} mt-4`}
                    // onClick={handleResetPassword}
                    type="submit"
                  >
                    {' '}
                    重設密碼
                  </button>
                </div>
              </div>
            </form>
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
  )
}
