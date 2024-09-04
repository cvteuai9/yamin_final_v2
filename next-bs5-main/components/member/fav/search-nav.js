import React from 'react'
import Link from 'next/link'
import styles from '@/components/member/fav/favorite.module.scss'

export default function SearchNav({
  favoriteProduct = 0,
  favoriteCourse = 0,
  favoriteArticle = 0,
}) {
  return (
    <>
      <div className="searchnavs">
        {favoriteProduct === 0 ? (
          <div className={`searchnav`}>
            <Link href="/member/fav/favorite-p" className="goldenf p">
              商品
            </Link>
          </div>
        ) : (
          <div className={`searchnav ${styles.favoriteProduct}`}>
            <Link href="/member/fav/favorite-p" className="goldenf p">
              商品
            </Link>
          </div>
        )}
        {favoriteCourse === 0 ? (
          <div className="ms-3 searchnav">
            <Link href="/member/fav/favorite-c" className="goldenf p">
              課程
            </Link>
          </div>
        ) : (
          <div className={`ms-3 searchnav ${styles.favoriteCourse}`}>
            <Link href="/member/fav/favorite-c" className="goldenf p">
              課程
            </Link>
          </div>
        )}
        {favoriteArticle === 0 ? (
          <div className="ms-3 searchnav">
            <Link href="/member/fav/favorite-a" className="goldenf p ">
              文章
            </Link>
          </div>
        ) : (
          <div className={`ms-3 searchnav ${styles.favoriteArticle}`}>
            <Link href="/member/fav/favorite-a" className="goldenf p">
              文章
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
