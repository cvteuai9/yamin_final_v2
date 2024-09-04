import React, { useState } from 'react'

const App = () => {
  // 圖片列表
  const images = [
    'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Image+1',
    'https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Image+2',
    'https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Image+3',
    'https://via.placeholder.com/400x300/FFFF00/FFFFFF?text=Image+4',
    'https://via.placeholder.com/400x300/FF00FF/FFFFFF?text=Image+5',
  ]

  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // 用於儲存當前選中的圖片索引

  return (
    <div style={styles.container}>
      {/* 左側選項區域 */}
      <div style={styles.leftPane}>
        {images.map((_, index) => (
          <button
            key={index}
            style={styles.optionButton}
            onClick={() => setSelectedImageIndex(index)}
          >
            選項 {index + 1}
          </button>
        ))}
      </div>

      {/* 右側圖片顯示區域 */}
      <div style={styles.rightPane}>
        <img
          src={images[selectedImageIndex]}
          alt={`選項 ${selectedImageIndex + 1} 的圖片`}
          style={styles.image}
        />
      </div>
    </div>
  )
}

// 一些簡單的內聯樣式
const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
  },
  leftPane: {
    width: '30%', // 左側區域寬度
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  optionButton: {
    width: '100%',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontSize: '18px',
  },
  rightPane: {
    width: '70%', // 右側區域寬度
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    maxWidth: '90%',
    maxHeight: '90%',
  },
}

export default App
