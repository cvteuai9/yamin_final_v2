/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'

export default function PreviewUploadImage({
  avatarImg = '',
  avatarBaseUrl = '',
  defaultImg = 'default.png',
  setSelectedFile,
  selectedFile,
}) {
  // 預覽圖片
  const [preview, setPreview] = useState('')

  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl) //⛳️
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

    if (avatarImg) {
      return avatarBaseUrl + '/' + avatarImg
      // avatarBaseUrl = 'http://localhost:3005/avatar'
    }

    return avatarBaseUrl + '/' + defaultImg
  }

  return (
    <div className="image-upload">
      <label for="file-input">
        <img src={showImg()} alt="" width="200" height="200" />
      </label>
      <input
        id="file-input"
        type="file"
        name="file"
        onChange={handleFileChang}
      />
      <div>
        <p>點按頭像可以選擇新照片</p>
      </div>
      <style jsx>
        {`
          .image-upload > input {
            display: none;
          }
        `}
      </style>
    </div>
  )
}
