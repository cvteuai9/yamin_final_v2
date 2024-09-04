import React, { useEffect, useState, useRef } from 'react'
import { useSprings, animated } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import { useDrag } from 'react-use-gesture'
import clamp from 'lodash.clamp'
import axios from 'axios'

const IMAGE_BASE_URL = '/images/yaming/tea_class_picture/' // 圖片基礎路徑

function Viewpager() {
  const [images, setImages] = useState([]) // 用來儲存圖片 URL 和課程名稱
  const [courseTitles, setCourseTitles] = useState([]) // 用來儲存課程名稱
  const [currentTitle, setCurrentTitle] = useState('') // 當前顯示的課程名稱
  const index = useRef(0)
  const [ref, { width }] = useMeasure()
  const [props, api] = useSprings(
    images.length,
    (i) => ({
      x: i * width,
      scale: width === 0 ? 0 : 1,
      display: 'block',
    }),
    [width]
  )

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], distance, cancel, last }) => {
      if (active && distance > width / 2) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          images.length - 1
        )
        cancel()
      }

      if (last) {
        if (index.current < 0) {
          index.current = images.length - 1 // 如果在第一張圖左滑，回到最後一張
        } else if (index.current >= images.length) {
          index.current = 0 // 如果在最後一張圖右滑，回到第一張
        }
        setCurrentTitle(courseTitles[index.current]) // 更新當前課程名稱
      }

      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: 'none' }
        const x = (i - index.current) * width + (active ? mx : 0)
        const scale = active ? 1 - distance / width / 3 : 1
        return { x, scale, display: 'block' }
      })
    }
  )

  useEffect(() => {
    // 從 API 獲取圖片資料和課程名稱
    axios
      .get('http://localhost:3005/api/course')
      .then((response) => {
        // 提取所有課程的 img1, img2, img3 欄位，並生成完整的圖片 URL 和課程名稱
        const imgUrls = []
        const titles = []

        response.data.courses.forEach((course) => {
          imgUrls.push(`${IMAGE_BASE_URL}${course.img1}`)
          imgUrls.push(`${IMAGE_BASE_URL}${course.img2}`)
          imgUrls.push(`${IMAGE_BASE_URL}${course.img3}`)
          titles.push(course.name, course.name, course.name) // 為每張圖片添加課程名稱
        })

        setImages(imgUrls)
        setCourseTitles(titles)
        setCurrentTitle(titles[0]) // 預設顯示第一個課程的名稱
      })
      .catch((error) => {
        console.error('Error fetching images:', error)
      })
  }, [])

  return (
    <div ref={ref} className="shane_test_wrapper">
      <div className="course-title">{currentTitle}</div> {/* 顯示當前課程名稱 */}
      {props.map(({ x, display, scale }, i) => (
        <animated.div
          className="shane_test_page"
          {...bind()}
          key={i}
          style={{ display, x }}
        >
          <animated.div
            style={{ scale, backgroundImage: `url(${images[i]})` }} // 使用從 API 獲取的圖片 URL
          />
        </animated.div>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <div className="shane_test_container">
      <Viewpager />
    </div>
  )
}
