/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import Star from '@/components/star/star'
import GoogleLogo from '@/components/icons/google-logo'
import { RiEyeLine } from 'react-icons/ri'
import { RiEyeOffLine } from 'react-icons/ri'
import { useAuth, initUserData } from '@/hooks/my-use-auth'
import useFirebase from '@/hooks/use-firebase'
import { useRouter } from 'next/router'
import { login, googleLogin, parseJwt, getUserById } from '@/services/my-user'
import toast, { Toaster } from 'react-hot-toast'

// import GoogleLogo from '@/components/icons/google-logo'

export default function LoginForm() {
  const { auth, setAuth } = useAuth()

  const { loginGoogle } = useFirebase()
  const router = useRouter()

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
      }
    }
  }

  const [user, setUser] = useState({
    email: '',
    password: '',
    // agree: false, // checkbox 同意會員註冊條款
  })

  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    // agree: '', // 錯誤訊息用字串
  })
  //---------fetch-token方法login----------
  // const { login } = useAuth()

  // const onLogin = async (e) => {
  //   // e.preventDefault() // 防止表單默認提交行為
  //   const user_name = await login(user.email, user.password)
  //   if (user_name) {
  //     alert(`歡迎回來，${user_name}！`)
  //   }
  // }
  //---------fetch-token方法login----------

  const handleLogin = async () => {
    try {
      // console.log(user)
      const res = await login(user)

      // console.log(res.data)

      if (res.data.status === 'success') {
        const jwtUser = parseJwt(res.data.data.accessToken)
        console.log(jwtUser)

        const res1 = await getUserById(jwtUser.id)
        console.log(res1.data)

        if (res1.data.status === 'success') {
          const dbUser = res1.data.data.user
          const userData = { ...initUserData }

          for (const key in userData) {
            if (Object.hasOwn(dbUser, key)) {
              userData[key] = dbUser[key]
            }
          }

          setAuth({
            isAuth: true,
            userData,
          })

          toast.success('已成功登入')
        } else {
          toast.error('登入後無法得到會員資料')
        }
      } else {
        toast.error(`登入失敗: ${res.data.message || '未知錯誤'}`)
      }
    } catch (error) {
      // console.error(error)
      alert('使用者帳號密碼錯誤')
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

  const handleSubmit = (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 表單檢查 --- START
    // 建立一個新的錯誤物件
    const newErrors = {
      email: '',
      password: '',
    }

    if (!user.email) {
      newErrors.email = 'email為必填'
    }

    if (!user.password) {
      newErrors.password = '密碼為必填'
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
    }
    // 表單檢查 --- END

    handleLogin()
    // 最後檢查完全沒問題才送到伺服器(ajax/fetch)
    alert('送到伺服器去')
  }
  return (
    <main className={styles.loginPage}>
      <div className={styles.imageSectionLog}>
        {/* 這裡可以添加一些覆蓋在圖片上的文字或logo */}
      </div>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.logoContainer}>
            <Image src="/images/main-title/login.svg" alt="login" width={200} height={100} />
          </div>
          <button 
            className={styles.googleButton} 
            onClick={() => loginGoogle(callbackGoogleLoginPopup)}
          >
            <GoogleLogo className={styles.googleIcon} />
            <span>快速登入</span>
          </button>
          <div className={styles.divider}>
            <span>或</span>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">電子郵件</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleFieldChange}
                placeholder="請輸入你的電子郵件"
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">密碼</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleFieldChange}
                  placeholder="請輸入你的密碼"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeIcon}
                >
                  {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                </button>
              </div>
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>
            <button type="submit" className={styles.submitButton}>
              登入
            </button>
          </form>
          <div className={styles.links}>
            <Link href="/member/register">註冊新帳號</Link>
            <Link href="/member/forget-password">忘記密碼</Link>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  


    // <main className={`form-member w-100 m-auto text-center`}>
    //   <h2 className="text-center mb-5">會員登入</h2>
    //   <form>
    //     <div className="row mb-3">
    //       <div className="col-sm-12">
    //         <input
    //           type="email"
    //           className={`form-control w-100 ${styles['form-control']} `}
    //           placeholder="電子郵件地址"
    //         />
    //       </div>
    //       <div className={`${styles['error']} my-2 text-start`}>
    //         請輸入有效的電子郵件地址。
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
    //         請輸入密碼。
    //       </div>
    //     </div>
    //     <div className="row mb-3">
    //       <div className="col-sm-6 text-start">
    //         <div className="form-check">
    //           <input
    //             className="form-check-input"
    //             type="checkbox"
    //             id="gridCheck1"
    //           />
    //           <label
    //             className={`form-check-label  ${styles['notice']}`}
    //             htmlFor="gridCheck1"
    //           >
    //             保持登入狀態
    //           </label>
    //         </div>
    //       </div>
    //       <div className="col-sm-4 offset-sm-2 test-end">
    //         <Link
    //           href="/member/forget-password"
    //           className={`${styles['notice']}`}
    //         >
    //           忘記密碼？
    //         </Link>
    //       </div>
    //     </div>
    //     <div className="row mb-2">
    //       <p className={`${styles['notice']}`}>
    //         如登入，即代表同意本站
    //         <Link href="/about">隱私權政策</Link>和
    //         <Link href="/about">使用條款</Link>。
    //       </p>
    //     </div>

    //     <button type="submit" className="btn btn-primary w-100">
    //       登入
    //     </button>

    //     <div className="row mt-2">
    //       <p className={`${styles['notice']}`}>
    //         還不是會員？
    //         <Link href="/member/register">加入我們</Link>。
    //       </p>
    //     </div>

    //     <div className={`mb-3 ${styles['hr-sect']}`}>快速登入</div>
    //     <div className="row mb-2">
    //       <div className="col-sm-12 text-start">
    //         <div className="d-flex justify-content-center">
    //           <LineLogo className="mx-3" />
    //           <GoogleLogo className="mx-3" />
    //           <FacebookLogo className="mx-3" />
    //         </div>
    //       </div>
    //     </div>
    //   </form>
    // </main>
  )
}
