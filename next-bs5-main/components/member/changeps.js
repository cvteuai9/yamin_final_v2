import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'
import { RiEyeLine } from 'react-icons/ri'
import { RiEyeOffLine } from 'react-icons/ri'
import { useAuth } from '@/hooks/my-use-auth'
import { updatePassword } from '@/services/my-user'
import toast, { Toaster } from 'react-hot-toast'


// 定義要在此頁呈現/編輯的會員資料初始物件
const initUserPassword = {
  origin: '', // 原本密碼，要比對成功才能修改
  new: '', // 新密碼
  confirm: '', //確認新密碼用(前端檢查用，不送後端)
}
export default function Changeps() {
  // 需要會員登入時的id
  const { auth } = useAuth()
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
  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 表單驗証 - START
    if (!userPassword.new || !userPassword.origin || !userPassword.confirm) {
      toast.error('密碼欄位為必填')
      return // 跳出函式
    }

    if (userPassword.new !== userPassword.confirm) {
      toast.error('新密碼與確認密碼不同')
      return // 跳出函式
    }
    // 表單驗証 - END

    // 送到伺服器進行更新
    const password = { origin: userPassword.origin, new: userPassword.new }
    console.log(password)
    console.log(id)

    try {
      const res = await updatePassword(id, password)
      if (res.status === 'error') {
        toast.error(res.data.message)
      }else{
        toast.success('會員密碼修改成功')
      }
    } catch (error) {
      // 捕捉異常情況並顯示錯誤訊息
      if (error.response && error.response.status === 401) {
        toast.error('密碼錯誤')
      } else {
        toast.error('密碼更新失敗，請稍後再試。')
      }
    }

    
  }
  const router = useRouter()
  useEffect(() => {
    if (auth.userData.google_uid && auth.userData.google_uid.length > 0) {
      alert('google快速登入用戶不需要修改密碼');
      router.push('/member/profile'); // 重定向到 profile 頁面
    }
  }, [auth.userData.google_uid, router]);
  console.log(auth.userData.google_uid);
  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return <></>
  if (auth.userData.google_uid && auth.userData.google_uid.length > 0) return <><div></div></>
  return (
    <>
      <main className='profile-cps-main'>
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
                <h4 className="goldenf">
                  <Link href="/member/profile" className="h5 goldenf">
                    個人檔案
                  </Link>
                  &nbsp;/&nbsp;
                  <Link href="/member/fav/profile" className="h5 goldenf">
                    已整合帳戶
                  </Link>
                  &nbsp;/&nbsp;
                  <Link href="/member/fav/profile" className="h5 goldenf">
                    載具管理
                  </Link>
                </h4>
                <form onSubmit={handleSubmit}>
                  <div className='changeps-label'>
                    <p className="mt-5 my-0 whitef">舊密碼</p>
                    <div className="changeps-inputgroup d-flex">
                      <input
                        className="changeps-inputtext "
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
                    <p className="my-0 mt-4 whitef">新密碼</p>
                    <div className="changeps-inputgroup d-flex">
                      <input
                        className="changeps-inputtext"
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
                    <p className="my-0 mt-4 whitef">密碼確認</p>
                    <div className="changeps-inputgroup d-flex">
                      <input
                        className="changeps-inputtext"
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
