import React from 'react'
import { Toaster as HotToaster } from 'react-hot-toast'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
const CustomToaster = () => {
  return (
    <HotToaster
      // position="top-right"
      toastOptions={{
        success: {
          icon: '🍵',
          // style: {
          //   fontSize: '24px', // 放大icon的大小
          //   color: 'white', // 文字顏色
          //   padding: '16px', // 內邊距
          //   // fontSize: '16px', // 字體大小
          //   fontFamily: 'B2Hana-Regular',
          //   boxShadow: '0 0 0 4px #003E52, 0 0 0 5px #B29564',
          //   border: '1px solid #B29564',
          //   borderRadius: '0',
          //   backgroundColor: '#004A62',
          // },
          style: {
            fontSize: '24px', // 放大icon的大小
            color: 'white', // 文字顏色
            padding: '16px', // 內邊距
            // fontSize: '16px', // 字體大小
            fontFamily: 'B2Hana-Regular',
            boxShadow: '0 0 0 2px #003E52, 0 0 0 5px #B29564',
            border: '1px solid #003E52',
            borderRadius: '0',
            backgroundColor: '#B29564',
          },
        },
        error: {
          icon: <FaExclamationCircle />,
          style: {
            fontSize: '24px',
            color: 'white',
            padding: '16px',
            fontFamily: 'B2Hana-Regular',
            boxShadow: '0 0 0 2px #B29564, 0 0 0 5px #CA3D43',
            border: '1px solid #B29564',
            borderRadius: '0',
            backgroundColor: '#CA3D43', // 深紅色，用於錯誤訊息
          },
        },
        // 你可以添加更多的樣式配置
        // style: {
        //   background: '#003E52',
        //   color: '#D8B783',
        // },
        // duration: 3000,
      }}
    />
  )
}

export default CustomToaster
