/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import option from '@/components/article/option.module.sass'
import StarLarge from '@/components/star/star-large'
import { IoEyeSharp } from 'react-icons/io5'
import { FaRegComment, FaBookmark } from 'react-icons/fa'
import { FaAngleDown } from 'react-icons/fa6'
import { FaProductHunt } from 'react-icons/fa6'

import Leftnav from '@/components/member/left-nav'
import SearchNav from './search-nav'
import Link from 'next/link'
import styles from '@/components/member/fav/favorite.module.scss'
import { useAuth } from '@/hooks/my-use-auth'
import Swal from 'sweetalert2'
import { func } from 'prop-types'

export default function FavoriteA() {
  const router = useRouter()
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  const [article, setArticle] = useState([])
  const [order, setOrder] = useState(0)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const pageArray = new Array(totalPage).fill(0).map((v, i) => i)

  function handleOption(e) {
    const value = e.target.getAttribute('data-value')
    // console.log(value)
    setOrder(value)
  }
  async function handleFavDelete(id, userID) {
    // 原本的
    // const agreeDelete = confirm('確認要移除此收藏文章?')
    // if (agreeDelete) {
    //   await fetch(
    //     `http://localhost:3005/api/my-articles/favorites?user_id=${userID}&article_id=${id}`,
    //     { method: 'DELETE' }
    //   )
    //     .then((res) => res.json())
    //     .then((result) => {
    //       if (result.message) {
    //         getFavArticle(page, order, userID)
    //       }
    //     })
    //     .catch((error) => console.log(error))
    // }
    // Swal
    Swal.fire({
      title: '確定要移除此收藏課程?',
      text: '是否要取消收藏',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://localhost:3005/api/my-articles/favorites?user_id=${userID}&article_id=${id}`,
          { method: 'DELETE' }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message) {
              getFavArticle(page, order, userID)
            }
          })
          .catch((error) => console.log(error))
      }
    })
  }
  async function getFavArticle(page, order, userID) {
    // console.log(order);
    const url = new URL('http://localhost:3005/api/my-favorites')
    let searchParams = new URLSearchParams({
      order: order,
      page: page,
      type: 'article',
      user_id: userID,
    })
    url.search = searchParams
    const res = await fetch(url)
    const favArticle = await res.json()
    // console.log(favArticle);
    setArticle(favArticle.data)
    setTotalCount(favArticle.totalCount)
    setTotalPage(favArticle.totalPage)
  }
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])

  useEffect(() => {
    if (router.isReady) {
      getFavArticle(page, order, userID)
    }
  }, [router.isReady, order, page, totalCount, totalPage, userID, isAuth])
  return (
    <>
      {/* 標題 & 篩選 */}
      <div className="container-fluid">
        <div className="row">
          <div className="titlenav mb-6">
            <img src="/images/favorite/title.svg" alt="" />
            <img
              src="/images/favorite/group.svg"
              alt=""
              style={{ width: '100%' }}
            />
          </div>
          <div className="col-md-3">
            <Leftnav fromFavorite="fromFavorite" />
          </div>
          <div className="col-md-9 p-0">
            <div className="favorite-nav">
              <SearchNav favoriteArticle={1} />
              <hr />
              <div className="searchitem" type="button">
                <div className="d-flex justify-content-end align-items-center ">
                  {/* <h4>{selectedCategory}</h4> */}
                  <div
                    className="d-flex justify-content-between"
                    style={{ width: 100 }}
                  >
                    <div
                      className={`d-flex align-items-center justify-content-between ${option['articlechoose']}`}
                    >
                      <input type="checkbox" name="a1-1" id="a1-1" />
                      <label htmlFor="a1-1" className="d-flex flex-column">
                        <p className="mb-0 align-items-center">
                          排序
                          <FaAngleDown className={option['icon']} />
                        </p>
                        <ul className="ul1">
                          <li>
                            <a
                              href="#"
                              data-value={3}
                              className="p-0"
                              onClick={(e) => {
                                e.preventDefault()
                                handleOption(e)
                              }}
                            >
                              類別升冪
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              data-value={4}
                              className="p-0"
                              onClick={(e) => {
                                e.preventDefault()
                                handleOption(e)
                              }}
                            >
                              類別降冪
                            </a>
                          </li>
                        </ul>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.favoriteArticleGroup} mt-5`}>
              {article.length > 0 ? (
                article.map((v, i) => {
                  return (
                    <div className={`${styles['favoritea-cards']}`} key={v.id}>
                      <div className={`${styles['favoritea-pcard']}`}>
                        <div className={`${styles['favoritea-imgbox']}`}>
                          <Link href={`/article/${v.id}`}>
                            <img
                              src={`/images/article/articlelist/teaall/${v.article_images}`}
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className={`${styles['favoritea-cardtext']}`}>
                          <div
                            className={`${styles['favoritea-cardlefttext']}`}
                          >
                            <p className="whitef p2">{v.title}</p>
                            <div
                              className={`${styles.articleContent} p2 whitef50`}
                            >
                              {v.content}
                            </div>
                            <div
                              className={`${styles['favoritea-bottomtext']}`}
                            >
                              <p className="p2 whitef">
                                上架時間：{v.created_at}
                              </p>
                              <p className="p2 whitef ms-5">
                                類別：{v.category_name}
                              </p>
                              <br />
                            </div>
                            <button
                              className={`${styles['favoritea-markbtn']} btn`}
                              type="button"
                              onClick={() => handleFavDelete(v.id, userID)}
                            >
                              <i
                                className="fa-solid fa-bookmark fa-2xl"
                                style={{ color: '#b29564' }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className={`${styles.noFavorites}`}>
                  <h4 className="fw-bold mb-5">你還沒有收藏的文章喔!</h4>
                  <Link
                    href={`/article`}
                    className={`h4 d-flex align-items-center justify-content-center gap-1`}
                  >
                    <FaProductHunt />
                    來去逛逛吧!
                  </Link>
                </div>
              )}
            </div>
            {/* 文章 */}
            {/* 頁碼 */}
            {article.length > 0 ? (
              <div className={`${styles['page-choose']} text-center mt-5`}>
                <div className="d-flex gap-3 justify-content-center pb-3">
                  {/* 上一頁 */}
                  <button
                    type="button"
                    className={`btn`}
                    onClick={(e) => {
                      const preNum = page - 1 !== 0 ? page - 1 : 1
                      setPage(preNum)
                    }}
                  >
                    <img
                      src="/images/product/list1/page-left-arrow.svg"
                      alt=""
                    />
                  </button>
                  <div className="d-flex gap-3 align-items-center justify-content-center px-3">
                    {pageArray.map((v, index) => {
                      {
                        /* 如果分頁等於分頁數字按鈕，加上current樣式 */
                      }
                      if (page === index + 1) {
                        return (
                          <div
                            className={`${styles['page-number']} ${styles.current}`}
                            key={index}
                          >
                            <button
                              type="button"
                              className={`btn m-0`}
                              onClick={(e) => {
                                setPage(Number(e.target.innerText))
                              }}
                            >
                              {v + 1}
                            </button>
                          </div>
                        )
                      } else {
                        if (index + 1 - page >= 3 || index + 1 - page <= -3) {
                          return (
                            <div
                              className={`${styles['page-number']} d-none`}
                              key={index}
                            >
                              <button
                                type="button"
                                className={`btn m-0`}
                                onClick={(e) => {
                                  setPage(Number(e.target.innerText))
                                }}
                              >
                                {v + 1}
                              </button>
                            </div>
                          )
                        } else {
                          return (
                            <div
                              className={`${styles['page-number']}`}
                              key={index}
                            >
                              <button
                                type="button"
                                className={`btn m-0`}
                                onClick={(e) => {
                                  setPage(Number(e.target.innerText))
                                }}
                              >
                                {v + 1}
                              </button>
                            </div>
                          )
                        }
                      }
                    })}
                  </div>
                  {/* 下一頁 */}
                  <button
                    type="button"
                    className={`btn`}
                    onClick={(e) => {
                      const nextNum =
                        page + 1 <= totalPage ? page + 1 : totalPage
                      setPage(nextNum)
                    }}
                  >
                    <img
                      src="/images/product/list1/page-right-arrow.svg"
                      alt=""
                    />
                  </button>
                </div>
                <img
                  src="/images/product/list1/page-choose-bottom-line.svg"
                  alt=""
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* 頁碼 */}
        </div>
      </div>
    </>
  )
}
