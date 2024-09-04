// NE為了測試修改過，如果有衝突麻煩再跟我說一下，感恩～
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'
import {
  updateProfile,
  getUserById,
  updateProfileAvatar,
} from '@/services/my-user'
import { useAuth } from '@/hooks/my-use-auth'
import toast from 'react-hot-toast'
import MyPreviewUploadImage from '@/components/user/my-preview-upload-image'
import { avatarBaseUrl } from '@/configs'
import { useUserProfile } from '@/context/UserProfileContext'
import { IoColorFill, IoColorFillSharp } from 'react-icons/io5'

export default function Profile() {
  const { userProfile, updateUserProfile, avatarVersion, updateAvatar } =
    useUserProfile()
  // const router = useRouter()
  // 定義要在此頁呈現/編輯的會員資料初始物件
  const initUserProfile = {
    id: '',
    user_name: '',
    nick_name: '',
    gender: '',
    phone: '',
    birthday: null,
    user_image: '',
    email: '',
    address: '',
  }
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    user_name: '',
    nick_name: '',
    gender: '',
    phone: '',
  })
  const { auth } = useAuth()
  // const [avatarVersion, setAvatarVersion] = useState(Date.now())移動到context去解決
  // const [userProfile, setUserProfile] = useState(initUserProfile)
  const [hasProfile, setHasProfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const getUserData = useCallback(async (id) => {
    const res = await getUserById(id)

    // console.log('res.data', res.data)
    // console.log('auth.userData', auth.userData)

    if (res.data.status === 'success') {
      // 以下為同步化目前後端資料庫資料，與這裡定義的初始化會員資料物件的資料
      const dbUser = res.data.data.user
      // console.log('dbUser ', dbUser) //有ＩＤ
      const dbUserProfile = { ...initUserProfile }

      for (const key in dbUserProfile) {
        if (Object.hasOwn(dbUser, key)) {
          // 這裡要將null值的預設值改為空字串 ''
          dbUserProfile[key] = dbUser[key] || ''
        }
      }

      // 設定到狀態中
      // setUserProfile(dbUserProfile)
      // toast.success('會員資料載入成功!')
    } else {
      toast.error(`會員資料載入失敗`)
    }
  }, [])
  // auth載入完成後向資料庫要會員資料
  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
    // eslint-disable-next-line
  }, [auth])

  // 提示其它相關個人資料元件可以載入資料
  useEffect(() => {
    // 純粹觀察userProfile狀態變化用
    // console.log('userProfile狀態變化', userProfile)
    if (userProfile.user_name) {
      setHasProfile(true)
    }
  }, [userProfile])

  const handleFieldChange = (e) => {
    updateUserProfile({ ...userProfile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 表單檢查 --- START
    // 建立一個新的錯誤物件
    const newErrors = {
      user_name: '',
      nick_name: '',
      gender: '',
      phone: '',
    }

    if (!userProfile.user_name) {
      newErrors.user_name = '姓名為必填'
    }
    if (!userProfile.gender) {
      newErrors.gender = '性別為必填'
    }
    if (!userProfile.phone) {
      newErrors.phone = '手機為必填'
    }
    if (userProfile.phone) {
      const phoneRegex = /^09\d{8}$/
      if (!phoneRegex.test(userProfile.phone)) {
        newErrors.phone = '手機格式有誤'
      }
    }

    // 呈現錯誤訊息
    setErrors(newErrors)

    // 物件屬性值中有非空白字串時，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 有錯誤，不送到伺服器，跳出submit函式
    if (hasErrors) {
      return
    }
    // 送到伺服器進行更新
    // 更新會員資料用，排除avatar
    let isUpdated = false

    const { user_image, ...user } = userProfile
    if (user.birthday === '') {
      user.birthday = null
    }
    // console.log('user:', auth.userData)
    const res = await updateProfile(auth.userData.id, user)

    // console.log(res.data)

    // 上傳頭像用，有選擇檔案時再上傳
    if (selectedFile) {
      const formData = new FormData()
      // 對照server上的檔案名稱 req.files.avatar
      formData.append('avatar', selectedFile)
      // console.log(formData)

      const res2 = await updateAvatar(formData)

      // console.log(res2.data)
      if (res2) {
        toast.success('會員頭像修改成功')
        // setAvatarVersion(Date.now())  // 更新版本號
      }
    }

    if (res.data.status === 'success') {
      toast.success('會員資料修改成功')
    } else {
      toast.error('會員資料修改失敗')
      console.log(res.data)
    }
  }
  // console.log(auth.userData.google_uid)

  if (!auth.isAuth) return <></>

  return (
    <>
      <main>
        <div className="container-fluid mb-6">
          <div className="d-flex">
            <div className="titlenav">
              <img src="/images/favorite/title.svg" alt="" className="my-3" />
              <img
                src="/images/favorite/group.svg"
                alt=""
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div className="profile-content">
            <div className="row mt-4 ">
              <div className="col-md-4 profile-content-left">
                <Leftnav fromProfile="fromProfile" />
              </div>
              <div className="col-md-8 profile-content-right">
                <h3 className="goldenf">個人檔案</h3>
                <p className="p whitef mt-5">
                  請放心，你的電子郵件、檔案及相關購買資料，網站將依照個人資料保護法保障你的個人隱私！
                </p>

                {hasProfile ? (
                  <MyPreviewUploadImage
                    key={avatarVersion}
                    avatarImg={`${userProfile.user_image}?v=${avatarVersion}`}
                    // uploadImg={updateProfileAvatar}
                    avatarBaseUrl={avatarBaseUrl}
                    // toast={toast}
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                    showText={true}
                  />
                ) : (
                  <div>
                    <div className="d-flex mt-3">
                      <div className="profile-picleft mt-3">
                        <p className="p whitef">更換頭貼</p>
                        <p className="p2 goldenf mt-6">
                          從電腦中選取圖檔：最佳大小為 600 x 600 px
                        </p>
                        {/* <button>選擇照片</button> */}
                        <div type="file" className="p btn1 low mt-5">
                          選擇照片
                        </div>
                      </div>
                      <div>
                        <div className="profile-picright">
                          <img src="/images/favorite/user.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div>
                    <p className="p whitef mt-5">真實姓名（必填）</p>
                    <input
                      className={`profile-inputtext goldenf ${
                        errors.user_name ? 'hasError' : ''
                      }`}
                      type="text"
                      name="user_name"
                      placeholder="請輸入你的真實姓名"
                      value={userProfile.user_name}
                      onChange={handleFieldChange}
                    />
                  </div>
                  <div className="">
                    <span className="error">{errors.user_name}</span>
                  </div>
                  <div>
                    <p className="p whitef mt-4">暱稱</p>
                    <input
                      className="profile-inputtext p2 goldenf"
                      type="text"
                      placeholder="請輸入你的暱稱"
                      name="nick_name"
                      value={userProfile.nick_name}
                      onChange={handleFieldChange}
                    />
                  </div>
                  <div>
                    <p className="p whitef mt-4">性別&nbsp;(必填)</p>
                    <div className="profile-inputradio mb-3">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="男性"
                        checked={userProfile.gender === '男性'}
                        onChange={handleFieldChange}
                      />
                      <label htmlFor="male">
                        <p className="p whitef">男</p>
                      </label>
                      <input
                        type="radio"
                        className="ms-3"
                        id="female"
                        name="gender"
                        value="女性"
                        checked={userProfile.gender === '女性'}
                        onChange={handleFieldChange}
                      />
                      <label htmlFor="female">
                        <p className="p whitef">女</p>
                      </label>
                    </div>
                  </div>
                  <div className="">
                    <span className="error">{errors.gender}</span>
                  </div>
                  <div>
                    <p className="p whitef mt-4">生日</p>
                    <input
                      className="profile-inputtext p2 goldenf"
                      type="date"
                      placeholder="請輸入你的生日"
                      name="birthday"
                      value={userProfile.birthday}
                      onChange={handleFieldChange}
                      onClick={(e) => e.target.showPicker()} // 使用 onClick 事件來觸發日期選擇器
                      min="1944-01-01" // 最小日期為1944年1月1日
                      max={new Date().toISOString().split('T')[0]} // 最大日期為今天
                    />
                  </div>
                  <p className="p2 goldenf">
                    * 請正確填寫，註冊成功後將無法修改
                  </p>
                  <div>
                    <p className="p whitef mt-4">手機（必填）</p>
                    <input
                      className={`profile-inputtext goldenf ${
                        errors.phone ? 'hasError' : ''
                      }`}
                      type="text"
                      placeholder="請輸入你的手機"
                      // pattern="/^\+?[1-9]\d{1,14}$/"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleFieldChange}
                    />
                  </div>
                  <div className="">
                    <span className="error">{errors.phone}</span>
                  </div>
                  <div>
                    <p className="p whitef mt-4">收貨地址</p>
                    <input
                      className="profile-inputtext p2 goldenf"
                      type="text"
                      placeholder="請輸入你的地址"
                      // pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"
                      name="address"
                      value={userProfile.address}
                      onChange={handleFieldChange}
                    />
                  </div>
                  <div className="">
                    <span className="error">{errors.address}</span>
                  </div>
                  <div>
                    <p className="p whitef mt-4">
                      電子郵件（為登入帳號，不可修改）
                    </p>
                    <input
                      className="profile-inputtext p2 goldenf"
                      type="email"
                      name="email"
                      placeholder="請輸入你的電子郵件"
                      value={userProfile.email}
                    />
                  </div>
                  {/* <span className="error">{errors.email}</span> */}
                  <div className="profile-btns mt-4 ">
                    <button type="submit" className="profile-checked  btn2 p">
                      確認
                    </button>
                    {(auth.userData.google_uid === null ||
                      auth.userData.google_uid === '') && (
                      <div
                        type="button"
                        className="profile-changepassword btn1 p"
                      >
                        <Link
                          href="/member/changeps"
                          className="goldenf text-decoration-none color-inherit"
                        >
                          修改密碼
                        </Link>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
            {/* 土司訊息視窗用 */}
            {/* <Toaster /> */}
          </div>
        </div>
      </main>
    </>
  )
}
