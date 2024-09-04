import { useState } from 'react'
import validator from 'validator'
import styles from './member.module.scss'
import Link from 'next/link'
import Star from '@/components/star/star'
import dynamic from 'next/dynamic'
import GoogleLogo from '@/components/icons/google-logo'
import Image from 'next/image'
import { RiEyeLine } from 'react-icons/ri'
import { RiEyeOffLine } from 'react-icons/ri'
import {
  register,
  login,
  parseJwt,
  getUserById,
  googleLogin,
} from '@/services/my-user'
import useFirebase from '@/hooks/use-firebase'
import { useAuth, initUserData } from '@/hooks/my-use-auth'
import toast, { Toaster } from 'react-hot-toast'

// Datepicker relies on browser APIs like document
// dynamically load a component on the client side,
// use the ssr option to disable server-rendering.
const InputDatePicker = dynamic(() => import('../common/input-date-picker'), {
  ssr: false,
})

export default function RegisterForm() {
  const { auth, setAuth } = useAuth()
  const [user, setUser] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false, // checkbox 同意會員註冊條款
  })

  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: '', // 錯誤訊息用字串
  })
  const { loginGoogle } = useFirebase()
  // 處理google登入後，要向伺服器進行登入動作
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log(providerData)
    // 如果目前react(next)已經登入中，不需要再作登入動作
    if (auth.isAuth) return
    // 向伺服器進行登入動作(向本地端伺服器去登入)
    const res = await googleLogin(providerData)

    if (res.data.status === 'success') {
      // 從JWT存取令牌中解析出會員資料
      // 注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
      const jwtUser = await parseJwt(res.data.data.accessToken)
      console.log(jwtUser)

      const res1 = await getUserById(jwtUser.id)

      if (res1.data.status === 'success') {
        // 只需要initUserData中的定義屬性值，詳見use-auth勾子
        const dbUser = res1.data.data.user
        console.log(dbUser)
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }
        // 設定到全域狀態中
        setAuth({
          isAuth: true,
          userData,
        })
        console.log(auth)
      }
    }
  }
  const handleRegister = async () => {
    const response = await register(user)

    if (response.status === 201) {
      alert('註冊成功')
      // 你可以在這裡處理註冊成功後的邏輯，例如導航到登入頁面
    }

    if (response.data.status === 'error') {
      alert(response.data.message)
      return
    } else {
      console.log(user);
      const res = await login(user)
      if (res.data.status === 'success') {
        // 從JWT存取令牌中解析出會員資料
        // 注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
        const jwtUser = parseJwt(res.data.data.accessToken)
        console.log(jwtUser)

        const res1 = await getUserById(jwtUser.id)
        console.log(res1.data)

        if (res1.data.status === 'success') {
          // 只需要initUserData中的定義屬性值，詳見use-auth勾子
          const dbUser = res1.data.data.user
          const userData = { ...initUserData }

          for (const key in userData) {
            if (Object.hasOwn(dbUser, key)) {
              userData[key] = dbUser[key]
            }
          }

          // 設定到全域狀態中
          setAuth({
            isAuth: true,
            userData,
          })

          toast.success('已成功登入')
        } else {
          toast.error('登入後無法得到會員資料')
          // 這裡可以讓會員登出，因為這也算登入失敗，有可能會造成資料不統一
        }
      } else {
        toast.error(`登入失敗`)
      }
    }
  }

  // checkbox 呈現密碼用
  const [showPassword, setShowPassword] = useState(false)
  //一開始showPassword是false關起來，所以顯示閉眼圖示，
  // 點擊圖示後，觸發handleIconClick，showPassword透過setShowPassword(!showPassword)變成true，就會顯示張眼圖示
  // 透過此函數同時可以設定type的屬性
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handlePasswordIconClick = () => {
    setShowPassword(!showPassword) // 切換圖示狀態
    // 表示取反操作，也就是說，如果 showEye 為 false，取反後就會變成 true，因此會顯示 RiEyeLine 圖示。如果 showEye 為 true，取反後就會變成 false，顯示 RiEyeOffLine 圖示。
  }
  // 專門切換 confirm password 欄位的顯示狀態
  const handleConfirmPasswordIconClick = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // 多欄位共用事件函式
  const handleFieldChange = (e) => {
    // console.log(e.target.name, e.target.value, e.target.type)

    if (e.target.name === 'agree') {
      setUser({ ...user, [e.target.name]: e.target.checked })
    } else {
      setUser({ ...user, [e.target.name]: e.target.value })
    }

    // ES6特性: 計算得來的屬性名稱(computed property names)
    // [e.target.name]: e.target.value
    // ^^^^^^^^^^^^^^^ 這樣可以動態的設定物件的屬性名稱
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E5%90%8D
  }

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 表單檢查 --- START
    // 建立一個新的錯誤物件
    const newErrors = {
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }

    if (!user.user_name) {
      newErrors.user_name = '姓名為必填'
    }
    if (!user.email) {
      newErrors.email = 'email為必填'
    }
    // 強密碼驗證
    if (
      !validator.isStrongPassword(user.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      newErrors.password =
        '密碼需為8到12個字元，必須包含大小寫英文字母和數字'
    }
    if (user.password.length > 12) {
      newErrors.password = '密碼至多12個字元'
    }

    if (user.password !== user.confirmPassword) {
      newErrors.password = '密碼與確認密碼需要一致'
      newErrors.confirmPassword = '密碼與確認密碼需要一致'
    }

    if (!user.password) {
      newErrors.password = '密碼為必填'
    }

    if (!user.confirmPassword) {
      newErrors.confirmPassword = '密碼確認為必填'
    }

    // if (!user.agree) {
    //   newErrors.agree = '請先同意會員註冊條款'
    // }

    // 呈現錯誤訊息
    setErrors(newErrors)

    // 物件屬性值中有非空白字串時，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 有錯誤，不送到伺服器，跳出submit函式
    if (hasErrors) {
      return
    } else {
      handleRegister()
    }
    // 表單檢查 --- END

    // 最後檢查完全沒問題才送到伺服器(ajax/fetch)
    // alert('送到伺服器去')
  }

  return (
    <>
      <main className={styles.registerPage}>
        <div className={styles.imageSectionReg}>
          {/* 這裡可以添加一些覆蓋在圖片上的文字或logo */}
        </div>
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.logoContainer}>
              <Image src="/images/main-title/signup.svg" alt="register" width={200} height={100} />
            </div>
            <button
              className={styles.googleButton}
              onClick={() => loginGoogle(callbackGoogleLoginPopup)}
            >
              <GoogleLogo className={styles.googleIcon} />
              <span>快速註冊</span>
            </button>
            <div className={styles.divider}>
              <span>或</span>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
              <label htmlFor="name">姓名</label>
              <input
                  type="text"
                  id='name'
                  name="user_name"
                  placeholder="姓名"
                  value={user.user_name}
                  onChange={handleFieldChange}
                />
                {errors.user_name && <span className={styles.error}>{errors.user_name}</span>}
              </div>
              <div className={styles.inputGroup}>
              <label htmlFor="email">電子郵件</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="電子郵件"
                  value={user.email}
                  onChange={handleFieldChange}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
              <div className={styles.inputGroup}>
              <label htmlFor="password">密碼</label>
                <div className={styles.passwordInput}>
              <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id='password'
                    placeholder="8到12個字元，須包含大小寫英文字母和數字"
                    value={user.password}
                    onChange={handleFieldChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeIcon}
                  >
                    {showPassword ? <RiEyeLine />:<RiEyeOffLine /> }
                  </button>
                </div>
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>
              <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">確認密碼</label>
              <div className={styles.passwordInput}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='confirmPassword'
                    name="confirmPassword"
                    placeholder="確認密碼"
                    value={user.confirmPassword}
                    onChange={handleFieldChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.eyeIcon}
                  >
                    {showConfirmPassword ? <RiEyeLine />:<RiEyeOffLine />}
                  </button>
                </div>
                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className={styles.submitButton}>註冊</button>
            </form>
            <div className={styles.links}>
              <p>已經有會員帳號？ <Link href="/member/login">會員登入</Link></p>
            </div>
          </div>
        </div>
        <Toaster />
      </main>
    </>
  )
}
