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

import Link from 'next/link'
import SearchNav from './search-nav'
import Leftnav from '@/components/member/left-nav'
import styles from '@/components/member/fav/favorite.module.scss'
import { useAuth } from '@/hooks/my-use-auth'
import Swal from 'sweetalert2'
export default function FavoriteC() {
  const filterArray = ['金額由小到大', '金額由大到小']
  const router = useRouter()
  const [course, setCourse] = useState([])
  const [order, setOrder] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const pageArray = new Array(totalPage).fill(0).map((v, i) => i)
  // !!取得使用者資訊
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  function handleOption(e) {
    const value = e.target.getAttribute('data-value')
    // console.log(value);
    setOrder(value)
  }
  async function handleFavCancel(id, userID) {
    // console.log(id);
    // 原本的
    // const agreeDelete = confirm('您確定要移除此收藏商品?')
    // if (agreeDelete) {
    //   await fetch(
    //     `http://localhost:3005/api/course/favorites?user_id=${userID}&course_id=${id}`,
    //     { method: 'DELETE' }
    //   )
    //     .then((res) => res.json())
    //     .then((result) => {
    //       if (result.message) {
    //         getFavCourse(order, page, userID)
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
          `http://localhost:3005/api/course/favorites?user_id=${userID}&course_id=${id}`,
          { method: 'DELETE' }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message) {
              getFavCourse(order, page, userID)
            }
          })
          .catch((error) => console.log(error))
      }
    })
  }
  async function getFavCourse(order, page, userID) {
    const url = new URL('http://localhost:3005/api/my-favorites')
    let searchParams = new URLSearchParams({
      order: order,
      page: page,
      type: 'course',
      user_id: userID,
    })
    url.search = searchParams
    const res = await fetch(url)
    const favCourse = await res.json()
    // console.log(favCourse);
    setCourse(favCourse.data)
    setTotalCount(favCourse.totalCount)
    setTotalPage(favCourse.totalPage)
  }
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  useEffect(() => {
    if (router.isReady) {
      getFavCourse(order, page, userID)
    }
  }, [router.isReady, order, page, totalCount, totalPage, userID, isAuth])
  return (
    <>
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
                <SearchNav favoriteCourse={1} />
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
                            {filterArray.map((v, i) => {
                              return (
                                <li key={i}>
                                  <a
                                    href="#"
                                    data-value={`${i + 1}`}
                                    className="p-0"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleOption(e)
                                    }}
                                  >
                                    {v}
                                  </a>
                                </li>
                              )
                            })}
                          </ul>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.favoriteCourseGroup} mt-5`}>
                {course.length > 0 ? (
                  course.map((v, i) => {
                    return (
                      <div
                        className={`${styles['favoritec-cards']}`}
                        key={v.id}
                      >
                        <div className={`${styles['favoritec-pcard']}`}>
                          <div className={`${styles['favoritec-imgbox']}`}>
                            <Link href={`http://localhost:3000/course/${v.id}`}>
                              <img
                                src={`/images/yaming/tea_class_picture/${v.img1}`}
                                alt=""
                              />
                            </Link>
                            <button
                              className={`${styles['favoritec-fabtn']} btn`}
                              type="button"
                              onClick={() => handleFavCancel(v.id, userID)}
                            >
                              <img
                                id="like2"
                                src="/images/favorite/heart-fill.svg"
                                alt="移除收藏"
                              />
                            </button>
                          </div>
                          <div className={`${styles['favoritec-cardtext']}`}>
                            <div
                              className={`${styles['favoritec-cardlefttext']}`}
                            >
                              <h5 className="whitef">{v.course_name}</h5>
                              <div
                                className={`${styles.courseDescription} p2 whitef50`}
                              >
                                <p>{v.description}</p>
                              </div>
                              <div
                                className={`${styles['favoritec-bottomtext']}`}
                              >
                                <p className="p2 classdate">
                                  {v.start_time} ~ {v.end_time}
                                </p>
                                <br />
                                <p className="p2 classdate ms-3">
                                  人數限制 {v.limit_people} 人：已經報名{' '}
                                  {v.current_number} 人
                                </p>
                              </div>
                            </div>
                            <div
                              className={`${styles['favoritec-cardrighttext']} mt-3`}
                            >
                              <div>
                                <i
                                  className="fa-solid fa-location-dot fa-lg"
                                  style={{ color: '#ffffff' }}
                                />
                                <p className="mb-0 ms-3 p2 whitef">
                                  {v.location}
                                </p>
                              </div>
                              <div>
                                <p className="whitef p2">NT$ {v.price}</p>
                              </div>
                              <div className="btns">
                                <div
                                  className="btn1 d-flex justify-content-center align-items-center p2"
                                  type="button"
                                >
                                  加入購物車
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className={`${styles.noFavorites}`}>
                    <h4 className="fw-bold mb-5">你還沒有收藏的課程喔!</h4>
                    <Link
                      href={`/course/courselist`}
                      className={`h4 d-flex align-items-center justify-content-center gap-1`}
                    >
                      <FaProductHunt />
                      來去逛逛吧!
                    </Link>
                  </div>
                )}
              </div>
              {/* 頁碼 */}
              {course.length > 0 ? (
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
          </div>
          {/* 頁碼 */}
        </div>
      </>
    </>
  )
}
