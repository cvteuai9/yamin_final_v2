/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { useUserProfile } from '@/context/UserProfileContext'
import { useAuth, initUserData } from '@/hooks/my-use-auth'

export default function MyPreviewUploadImage({
  avatarImg = '',
  avatarBaseUrl = '',
  defaultImg = 'user.svg',
  setSelectedFile,
  selectedFile,
  showText = false, // 新增這個 prop 來控制是否顯示文字部分
}) {
  // 預覽圖片
  const [preview, setPreview] = useState('')
  const { userProfile, avatarVersion } = useUserProfile()
  const { auth } = useAuth()
  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl) //⛳️
    console.log(objectUrl)
    // URL.createObjectURL 是一個瀏覽器 API，用來創建一個指向本地文件的臨時 URL。這個 URL 可以被用於在網頁中顯示或預覽該文件，而不需要將文件上傳到伺服器。

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChang = (e) => {
    const file = e.target.files[0]

    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const showImg = () => {
    if (selectedFile) {
      return preview //⛳️
    }

    if (userProfile && userProfile.user_image && auth.isAuth) {
      console.log(userProfile);
      return `${avatarBaseUrl}/${userProfile.user_image}?v=${avatarVersion}`
    }

    return `${avatarBaseUrl}/${defaultImg}`
  }

  return (
    <div>
      <div className="d-flex">
        {showText && (
          <div className="profile-picleft mt-5">
            <p className="p whitef">更換頭貼</p>
            <p className="p2 goldenf mt-6 pc-text">
              從電腦中選取圖檔：最佳大小為 600 x 600 px
            </p>
            {/* <button>選擇照片</button> */}
            <div className="image-upload">
              <button className="p btn-profile low mt-5">
                <label for="file-input" className="profile-label">
                  選擇照片
                </label>
              </button>

              <input
                id="file-input"
                type="file"
                name="file"
                onChange={handleFileChang}
              />
            </div>
          </div>
        )}
        {showText && (
          <div className="profile-picright mt-5">
            <img src={showImg()} alt="" width={146} height={146} />
          </div>
        )}
        {!showText && (
          <div className="profile-picright">
            <img
              key={avatarVersion}
              src={showImg()}
              alt=""
              width={50}
              height={50}
              className="header-personimg"
            />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .image-upload > input {
            display: none;
          }
        `}
      </style>
    </div>
    // {/* <div className="image-upload">
    //   <label for="file-input">
    //     <img
    //       src={showImg()}
    //       alt=""
    //     />
    //   </label>
    //   <input
    //     id="file-input"
    //     type="file"
    //     name="file"
    //     onChange={handleFileChang}
    //   />
    //   <style jsx>
    //     {`
    //       .image-upload > input {
    //         display: none;
    //       }
    //     `}
    //   </style>
    // </div> */}
  )
}
