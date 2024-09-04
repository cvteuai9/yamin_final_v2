/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import option from '@/components/article/option.module.sass'
import StarLarge from '@/components/star/star-large'
import { IoEyeSharp } from 'react-icons/io5'
import { FaRegComment, FaBookmark } from 'react-icons/fa'
import { FaAngleDown } from 'react-icons/fa6'

import { useAuth } from '@/hooks/my-use-auth'
import Leftnav from '@/components/member/left-nav'
import SearchNav from './search-nav'
import Link from 'next/link'
import styles from '@/components/member/fav/favorite.module.scss'
import { func } from 'prop-types'
import { FaProductHunt } from 'react-icons/fa6'
import Swal from 'sweetalert2'
export default function FavoriteP() {
  // !!拿取會員資料
  const { auth } = useAuth()
  const filterArray = ['金額由小到大', '金額由大到小']
  const router = useRouter()
  const [product, setProduct] = useState([])
  const [order, setOrder] = useState('')
  const [page, setPage] = useState(1)
  const [userID, setUserID] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const pageArray = new Array(totalPage).fill(0).map((v, i) => i)
  function handleOption(e) {
    const value = e.target.getAttribute('data-value')
    // console.log(value);
    setOrder(value)
  }
  async function handleFavCancel(id, userID) {
    // console.log(id);
    // const agreeDelete = confirm('您確定要移除此收藏商品?')
    // Swal的confirm
    Swal.fire({
      title: '確定要移除此收藏商品?',
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
          `http://localhost:3005/api/my_products/favorites?user_id=${userID}&product_id=${id}`,
          { method: 'DELETE' }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message) {
              getFavProduct()
            }
          })
          .catch((error) => console.log(error))
      }
    })
    // 原本
    // if (agreeDelete) {
    //   await fetch(
    //     `http://localhost:3005/api/my_products/favorites?user_id=${userID}&product_id=${id}`,
    //     { method: 'DELETE' }
    //   )
    //     .then((res) => res.json())
    //     .then((result) => {
    //       if (result.message) {
    //         getFavProduct()
    //       }
    //     })
    //     .catch((error) => console.log(error))
    // }
  }
  async function getFavProduct() {
    const url = new URL('http://localhost:3005/api/my-favorites')
    let searchParams = new URLSearchParams({
      order: order,
      page: page,
      type: 'product',
      user_id: userID,
    })
    url.search = searchParams
    const res = await fetch(url)
    const favProduct = await res.json()
    setProduct(favProduct.data)
    setTotalCount(favProduct.totalCount)
    setTotalPage(favProduct.totalPage)
  }
  useEffect(() => {
    setUserID(auth.userData.id)
  }, [auth])
  useEffect(() => {
    if (router.isReady) {
      getFavProduct(userID)
    }
    // console.log(product)
    // console.log(totalPage);
  }, [router.isReady, order, page, totalCount, totalPage, userID])
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

          <div className="col-md-3 ">
            <Leftnav fromFavorite="fromFavorite" />
          </div>
          <div className="col-md-9 p-0">
            <div className="favorite-nav">
              <SearchNav favoriteProduct={1} />
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
            {/* 標題 */}
            <div className={`${styles['favoritep-cards']} low mt-5`}>
              {product.length > 0 ? (
                product.map((v, i) => {
                  return (
                    <div className={`${styles['favoritep-pcard']}`} key={i}>
                      <div className={`${styles['favoritep-imgbox']}`}>
                        <Link href={`/product/${v.id}`}>
                          <img
                            src={`/images/product/list1/products-images/${v.paths}`}
                            alt=""
                          />
                        </Link>
                        <button
                          className={`${styles['favoritep-fabtn']}`}
                          type="button"
                          onClick={() => handleFavCancel(v.id, userID)}
                        >
                          <img
                            id="like2"
                            src="/images/favorite/heart-fill.svg"
                            width="20px"
                            alt="移除收藏"
                          />
                        </button>
                      </div>
                      <div className={`${styles['favoritep-cardtext']}`}>
                        <div className="goldenf d-flex flex-column justify-content-between">
                          <p className="fw-bold fs-3 m-0">{v.product_name}</p>
                          <div>
                            <p className="m-0">品牌 : {v.brand_name}</p>
                            <p className="m-0">茶種 : {v.tea_name}</p>
                            <p className="m-0">茶品型態 : {v.style_name}</p>
                            <p className="m-0">重量 : {v.weight}</p>
                          </div>
                          <p className="m-0">NT$ {v.price}</p>
                        </div>
                        <div
                          type="button"
                          className={`${styles['favoritep-cardbtn']}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={16}
                            height={16}
                            style={{ color: '#fff' }}
                            fill="currentColor"
                            className="bi bi-cart3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className={`${styles.noFavorites}`}>
                  <h4 className="fw-bold mb-5">你還沒有收藏的商品喔!</h4>
                  <Link
                    href={`/product/list`}
                    className={`h4 d-flex align-items-center justify-content-center gap-1`}
                  >
                    <FaProductHunt />
                    來去逛逛吧!
                  </Link>
                </div>
              )}
            </div>

            {/* 頁碼 */}
            {product.length > 0 ? (
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
              <div></div>
            )}
          </div>
        </div>
        {/* 頁碼 */}
      </div>
    </>
  )
}
