import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'
import { RiEyeLine } from 'react-icons/ri'
import { RiEyeOffLine } from 'react-icons/ri'
import { useAuth, initUserData } from '@/hooks/my-use-auth'
import { updatePassword } from '@/services/my-user'
import toast, { Toaster } from 'react-hot-toast'
import useFirebase from '@/hooks/use-firebase'
import { logout } from '@/services/my-user'
// 定義要在此頁呈現/編輯的會員資料初始物件
const initUserPassword = {
  origin: '', // 原本密碼，要比對成功才能修改
  new: '', // 新密碼
  confirm: '', //確認新密碼用(前端檢查用，不送後端)
}

export default function Changeps() {
  // 需要會員登入時的id
  const { auth, setAuth } = useAuth()
  const id = auth.userData.id
  // console.log(auth);
  // 本頁狀態用
  const [userPassword, setUserPassword] = useState(initUserPassword)

  // checkbox 呈現密碼用
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  //一開始showPassword是false關起來，所以顯示閉眼圖示，
  // 點擊圖示後，觸發handleIconClick，showPassword透過setShowPassword(!showPassword)變成true，就會顯示張眼圖示
  // 透過此函數同時可以設定type的屬性
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleOldPasswordIconClick = () => {
    setShowOldPassword(!showOldPassword) // 切換圖示狀態
  }
  const handlePasswordIconClick = () => {
    setShowPassword(!showPassword) // 切換圖示狀態
    // 表示取反操作，也就是說，如果 showEye 為 false，取反後就會變成 true，因此會顯示 RiEyeLine 圖示。如果 showEye 為 true，取反後就會變成 false，顯示 RiEyeOffLine 圖示。
  }
  // 專門切換 confirm password 欄位的顯示狀態
  const handleConfirmPasswordIconClick = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
  // 輸入資料用
  const handleFieldChange = (e) => {
    setUserPassword({ ...userPassword, [e.target.name]: e.target.value })
  }
  const { logoutFirebase } = useFirebase()

  // 處理登出
  const handleLogout = async () => {
    // firebase logout(注意，這並不會登出google帳號，是登出firebase的帳號)
    logoutFirebase()

    const res = await logout()

    // 成功登出後，回復初始會員狀態
    if (res.data.status === 'success') {
      toast.success('修改密碼成功，請重新登入')

      setAuth({
        isAuth: false,
        userData: initUserData,
      })
      // // 因為解除這些條件才能立刻讓圖片為初始圖片
      // setSelectedFile(null)
      // setUserProfile({})
    } else {
      toast.error(`登出失敗`)
    }
  }
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    origin: '',
    new: '',
    confirm: '',
  })
  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()
    // 建立一個新的錯誤物件
    const newErrors = {
      origin: '',
      new: '',
      confirm: '',
    }

    // 表單驗証 - START
    if (!userPassword.origin) {
      newErrors.origin = '舊密碼為必填'
    }
    if (!userPassword.new) {
      newErrors.new = '新密碼為必填'
    }
    if (!userPassword.confirm) {
      newErrors.confirm = '確認密碼為必填'
    }
    // 密碼匹配驗證
    if (userPassword.new !== userPassword.confirm) {
      newErrors.confirm = '新密碼與確認密碼不相符'
    }
    // 呈現錯誤訊息
    setErrors(newErrors)

    // 物件屬性值中有非空白字串時，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 有錯誤，不送到伺服器，跳出submit函式
    if (hasErrors) {
      return
    }

    // 表單驗証 - END

    // 送到伺服器進行更新
    const password = { origin: userPassword.origin, new: userPassword.new }

    try {
      const res = await updatePassword(id, password)
      if (res.status === 'error') {
        toast.error(res.data.message)
      } else {
        handleLogout()
      }
    } catch (error) {
      // 捕捉異常情況並顯示錯誤訊息
      if (error.response && error.response.status === 401) {
        setErrors({ ...newErrors, origin: '密碼錯誤' })
      } else {
        toast.error('密碼更新失敗，請稍後再試。')
      }
    }
  }
  const router = useRouter()
  useEffect(() => {
    if (auth.userData.google_uid && auth.userData.google_uid.length > 0) {
      alert('google快速登入用戶不需要修改密碼')
      router.push('/member/profile') // 重定向到 profile 頁面
    }
  }, [auth.userData.google_uid, router])
  console.log(auth.userData.google_uid)
  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return <></>
  if (auth.userData.google_uid && auth.userData.google_uid.length > 0)
    return (
      <>
        <div></div>
      </>
    )
  return (
    <>
      <main className="profile-cps-main">
        <div className="container-fluid mb-6">
          <div className="d-flex">
            <div className="titlenav">
              <img src="/images/favorite/title.svg" alt="title" />
              <img
                src="/images/favorite/group.svg"
                alt="group"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div className="profile-content">
            <div className="row mt-4">
              <div className="col-md-4 profile-content-left">
                <Leftnav />
              </div>
              <div className="col-md-8 profile-content-right">
                <h3 className="goldenf">修改密碼</h3>
                <form className="changeps-form" onSubmit={handleSubmit}>
                  <div className="changeps-label">
                    <p className="mt-5 my-0 whitef">舊密碼</p>
                    <div className="changeps-inputgroup d-flex">
                      <input
                        className={`changeps-inputtext goldenf ${
                          errors.origin ? 'hasError' : ''
                        }`}
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="8到12個字元，須包含大小寫英文字母和數字"
                        name="origin"
                        value={userPassword.origin}
                        onChange={handleFieldChange}
                      />
                      <div>
                        {showOldPassword ? (
                          <RiEyeLine
                            className="icon"
                            onClick={handleOldPasswordIconClick}
                          />
                        ) : (
                          <RiEyeOffLine
                            className="icon"
                            onClick={handleOldPasswordIconClick}
                          />
                        )}
                      </div>
                    </div>
                    {/* <div className="mb-2 p2 whitef">
                      * 8到12個字元，須包含大小寫英文字母和數字
                    </div> */}
                  </div>
                  <div>
                    <span className="error">{errors.origin}</span>
                  </div>
                  <div>
                    <p className="my-0 mt-4 whitef">新密碼</p>
                    <div className="changeps-inputgroup d-flex">
                      <input
                        className={`changeps-inputtext goldenf ${
                          errors.new ? 'hasError' : ''
                        }`}
                        placeholder="8到12個字元，須包含大小寫英文字母和數字"
                        value={userPassword.new}
                        name="new"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleFieldChange}
                      />
                      <div>
                        {showPassword ? (
                          <RiEyeLine
                            className="icon"
                            onClick={handlePasswordIconClick}
                          />
                        ) : (
                          <RiEyeOffLine
                            className="icon"
                            onClick={handlePasswordIconClick}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="error">{errors.new}</span>
                  </div>
                  <div>
                    <p className="my-0 mt-4 whitef">密碼確認</p>
                    <div className="changeps-inputgroup d-flex">
                      <input
                        className={`changeps-inputtext goldenf ${
                          errors.confirm ? 'hasError' : ''
                        }`}
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userPassword.confirm}
                        name="confirm"
                        placeholder="再輸入一次密碼"
                        onChange={handleFieldChange}
                      />
                      <div>
                        {showConfirmPassword ? (
                          <RiEyeLine
                            className="icon"
                            onClick={handleConfirmPasswordIconClick}
                          />
                        ) : (
                          <RiEyeOffLine
                            className="icon"
                            onClick={handleConfirmPasswordIconClick}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="error">{errors.confirm}</span>
                  </div>
                  <div className="changeps-btns mt-4">
                    <button type="submit" className="btn2 checked p">
                      確認
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* 土司訊息視窗用 */}
            <Toaster />
          </div>
        </div>
      </main>
    </>
  )
}
