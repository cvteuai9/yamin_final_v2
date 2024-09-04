import { useState, useEffect, useRef } from 'react'
import styles from '@/components/article/category.module.scss'
import StarLarge from '@/components/star/star-large'
import Link from 'next/link'

export default function CategoryForm() {
  const sectionsRef = useRef(null)

  useEffect(() => {
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll(
        `.${styles['category-section']}`
      )
      console.log('Sections found:', sections)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const scribe = entry.target.querySelector(
              `.${styles['category-scribe']}`
            )
            console.log('Scribe found:', scribe)
            if (entry.isIntersecting) {
              scribe.classList.add(`${styles['visible']}`)
            } else {
              scribe.classList.remove(`${styles['visible']}`)
            }
          })
        },
        {
          threshold: 0.5,
        }
      )

      sections.forEach((section) => {
        observer.observe(section)
      })

      // Clean up observer on component unmount
      return () => {
        sections.forEach((section) => observer.unobserve(section))
      }
    }
  }, [styles])

  return (
    <main className={`${styles['article-category']}`} ref={sectionsRef}>
      <div className="container-fluid">
        <div className="d-flex justify-content-center">
          <img
            className={`${styles['main-title']}`}
            src="/images/main-title/article.svg"
            alt=""
          />
        </div>
        <StarLarge />
        <div className="row px-xl-4">
          <div className={`${styles['grid-item']} col-md-6 col-12`}>
            <h3>茶知識</h3>
            <div className={`${styles['category-section']}`}>
              <img src="/images/article/articlecategory/teaknow.jpg" alt="" />
              <div className={`${styles['category-scribe']}`}>
                <h5>關於茶葉的知識</h5>
                <p>
                  這裡持續蓄積茶葉相關知識與解答，以步步實踐「簡單生活，喝茶簡單」品牌願景。
                </p>
                <Link href="/article/list?category_id=1">
                  <button>探索</button>
                </Link>
              </div>
            </div>
          </div>
          <div className={`${styles['grid-item']} col-md-6 col-12`}>
            <h3>茶創新</h3>
            <div className={`${styles['category-section']}`}>
              <img src="/images/article/articlecategory/teanew.jpg" alt="" />
              <div className={`${styles['category-scribe']}`}>
                <h5>文明不斷的演進，茶葉也不斷的進步</h5>
                <p>這裡談論茶葉的創新技術與茶葉的進步。</p>
                <Link href="/article/list?category_id=2">
                  <button>探索</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row px-xl-4">
          <div className={`${styles['grid-item']} col-md-6 col-12`}>
            <h3>茶故事</h3>
            <div className={`${styles['category-section']}`}>
              <img src="/images/article/articlecategory/teastory.jpg" alt="" />
              <div className={`${styles['category-scribe']}`}>
                <h5>每杯茶，都有他的故事</h5>
                <p>
                  茶在愛茶人的心裡，早已不僅僅是茶，它更像是百態人生，譜寫出不同人的不同狀態。
                </p>
                <Link href="/article/list?category_id=3">
                  <button>探索</button>
                </Link>
              </div>
            </div>
          </div>
          <div className={`${styles['grid-item']} col-md-6 col-12`}>
            <h3>茶生活應用</h3>
            <div className={`${styles['category-section']}`}>
              <img src="/images/article/articlecategory/tealife.jpg" alt="" />
              <div className={`${styles['category-scribe']}`}>
                <h5>應用茶，品味人生旅程</h5>
                <p>《將茶應用於生活，心靈靜美滿足，生活多采多姿。</p>
                <Link href="/article/list?category_id=4">
                  <button>探索</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
