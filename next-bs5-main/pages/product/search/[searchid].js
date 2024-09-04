import React, { useState, useEffect, use } from 'react'
import { useLoader } from '@/hooks/use-loader'
import { useRouter } from 'next/router'
import styles from '@/styles/product.module.scss'
import Link from 'next/link'
import { func } from 'prop-types'
import { YaminUseCart } from '@/hooks/yamin-use-cart'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/my-use-auth'

export default function SearchID() {
  const router = useRouter()
  const { addItem = () => {} } = YaminUseCart()

  const notify = (productName) => {
    toast.success(
      <>
        <p>
          {productName + '已成功加入購物車!'}
          <br />
          <Link href="/cart/cartOne">前往購物車</Link>
        </p>
      </>
    )
  }

  const { showLoader, hideLoader, loading, delay } = useLoader() // 頁面載入等候畫面
  // !!拿取會員資料
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  // 設定搜尋條件初始值
  const [searchID, setSearchID] = useState('')
  //宣告 filter array(用來顯示篩選條件checkbox選項)
  const priceArray = ['$500 以下', '$500 ~ $1000', '$1000 以上']
  const [teaArray, setTeaArray] = useState([])
  const [brandArray, setBrandArray] = useState([])
  const [pcArray, setPcArray] = useState([])
  const [styleArray, setStyleArray] = useState([])
  const [product, setProduct] = useState([])
  // 一頁顯示幾筆資料，初始值為12
  const [perpage, setPerpage] = useState(12)
  // order 商品列表排序模式，初始值為1(價格由多到少)
  const [order, setOrder] = useState(1)
  // page 商品列表商品顯示數量上限值，初始值為1(第一種:12筆)
  const [page, setPage] = useState(1)
  // totalPage 後臺計算好的總頁數
  const [totalPage, setTotalPage] = useState(1)
  // 篩選條件
  const [tea, setTea] = useState([]) // 茶種
  const [brand, setBrand] = useState([]) // 品牌
  const [pc, setPackage] = useState([]) // 包材
  const [style, setStyle] = useState([]) // 茶品型態
  const [price, setPrice] = useState([]) // 價錢

  // totalData 為所有符合條件的商品數，用來顯示總共有幾筆符合的商品數量
  const [totalData, setTotalData] = useState(0)
  // 創建一個URL物件，才可以在下面使用url.search
  const url = new URL(`http://localhost:3005/api/my_products`)
  // 宣告一個products 空陣列，用來儲存從後台發送過來的資料
  let products = []
  // 利用totalPage(總頁數)長度，來創建一個充滿0的陣列，方便底下創造分頁按鈕
  const pageArray = new Array(totalPage).fill(0).map((v, index) => index)

  // 使用fetch送請求至後端
  async function getProducts(url, userID, isAuth) {
    try {
      products = await fetch(url.href)
        .then((res) => res.json())
        .then((result) => {
          return result
        })
        .catch((error) => {
          console.log(error)
        })
      let favoriteProduct = []
      if (isAuth) {
        favoriteProduct = await fetch(
          `http://localhost:3005/api/my_products/favorites?user_id=${userID}`
        )
          .then((res) => res.json())
          .then((result) => result)
          .catch((error) => {
            console.log(error)
          })
      }

      const tmpData = products.product.data
      let nextData = tmpData.map((v, i) => {
        if (favoriteProduct.includes(v.id)) return { ...v, fav: !v.fav }
        else return v
      })
      // console.log(nextData)
      setProduct(nextData) // 設定商品資訊
      setTotalPage(products.product.totalPage) // 設定總頁數
      setTeaArray(products.product.teaFilter) // 設定「茶種」篩選選擇器陣列
      setBrandArray(products.product.brandFilter) // 設定「品牌」篩選選擇器陣列
      setPcArray(products.product.packageFilter) // 設定「包材」篩選選擇器陣列
      setStyleArray(products.product.styleFilter) // 設定「茶品型態」篩選選擇器陣列
      setTotalData(products.product.totalData) // 設定「符合條件的總商品數」
    } catch (error) {
      console.log(error)
    }
  }
  // 處理收藏狀態的函式
  async function handleFavToggle(id, userID, isAuth) {
    if (isAuth) {
      const nextProduct = product.map((v, i) => {
        if (v.id === id) {
          if (v.fav === false) {
            fetch(
              `http://localhost:3005/api/my_products/favorites?user_id=${userID}&product_id=${id}`,
              { method: 'PUT' }
            )
              .then((res) => res.json())
              .then((result) => console.log(result))
              .catch((error) => console.log(error))
          } else {
            fetch(
              `http://localhost:3005/api/my_products/favorites?user_id=${userID}&product_id=${id}`,
              { method: 'DELETE' }
            )
              .then((res) => res.json())
              .then((result) => console.log(result))
              .catch((error) => console.log(error))
          }
          return { ...v, fav: !v.fav }
        } else {
          return v
        }
      })
      setProduct(nextProduct)
    } else {
      // 如果沒有登入，則導向至登入頁面
      if (confirm('您尚未登入，請登入後再操作!')) {
        router.push('/member/login')
      }
    }
  }
  // 處理filter改變時的函式
  // 如果沒有找到目前的value => 代表從 未勾選 -> 已勾選，反之，代表取消勾選
  function handleFilterChange(e) {
    // 從觸發的filter的e.target 物件中拿出 name、value屬性
    const { name, value } = e.target
    // 設定一個stateMap用來儲存所有filter目前的狀態和改變狀態的set函式
    const stateMap = {
      price: [price, setPrice],
      tea: [tea, setTea],
      brand: [brand, setBrand],
      package: [pc, setPackage],
      style: [style, setStyle],
    }
    // 利用name從stateMap取出對應的 狀態和函式
    const [state, setState] = stateMap[name]
    // 如果目前的filter陣列中不包含此value，則使用setState加入該value
    if (!state.includes(value)) {
      setState([...state, value])
    } else {
      // 如果目前的filter陣列中包含此value，則使用setState設定除了該value的陣列(等同於把該value移除)
      setState(state.filter((v) => v !== value))
    }
    // 每次filter有更動時都會將頁數導回第一頁
    setPage(1)
  }
  useEffect(() => {
    // 第一次進入頁面才會有loading畫面
    showLoader()
  }, [])
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  // 當count、order值改變時，設定新網址參數並重新抓取資料
  useEffect(() => {
    if (router.isReady) {
      setSearchID(router.query.searchid)
      let searchParams = new URLSearchParams({
        order: order,
        perpage: perpage,
        page: page,
        price: price,
        tea: tea,
        brand: brand,
        package: pc,
        style: style,
        searchID: router.query.searchid,
      })
      url.search = searchParams
      // console.log(url.href)
      getProducts(url, userID, isAuth)
    }
    // 下面的註解可以省略eslint檢查下下一行(監聽的部分)
    // eslint-disable-next-line
  }, [router.isReady, perpage, order, page, price, tea, brand, pc, style, router.query.searchid, userID, isAuth])

  return (
    <>
      {/* main-content---START--- */}
      <div className={`${styles['main-content']} container-fluid`}>
        {/* title */}
        <div
          className={`${styles['title']} d-flex justify-content-center mb-5`}
        >
          <img src="/images/product/list1/dash.svg" alt="" />
          <div className="text-center">
            <img src="/images/product/list1/decoration-top.svg" alt="" />
            <div>
              <h1 className="m-0">商品</h1>
              <h5 className="m-0">Store</h5>
            </div>
            <img src="/images/product/list1/decoration-bottom.svg" alt="" />
          </div>
          <img src="/images/product/list1/dash.svg" alt="" />
        </div>
        {/* product-list */}
        <div className={`${styles.main} row justify-content-between`}>
          {/* left(篩選區) */}
          <div
            className={`${styles['aside-left']} col-12 col-sm-3 col-md-5 col-lg-3 d-flex flex-column gap-md-3 gap-lg-5 mb-3 mb-md-0`}
          >
            <img
              className="d-none d-md-block"
              src="/images/product/list1/Union.svg"
              alt=""
            />
            <div className={`${styles['filter-group']}`}>
              {/* 價格區間 */}
              <div className={`${styles['price-filter']} gap-3 mb-3`}>
                <input
                  type="checkbox"
                  className="d-none"
                  id={`${styles.priceFilter}`}
                />
                <label
                  className="py-3 d-flex justify-content-between"
                  htmlFor={`${styles.priceFilter}`}
                >
                  <h5 className="m-0 fw-bold">價格區間</h5>
                  <img src="/images/product/list1/Down-Arrow.svg" alt="" />
                </label>
                <div className={`${styles.priceCheckbox} ${styles.scrollBar}`}>
                  {priceArray.map((name, index) => {
                    return (
                      <div className="pt-3 d-flex" key={index}>
                        <input
                          type="checkbox"
                          className={`${styles.checkbox}`}
                          id={`price${index}`}
                          name={`price`}
                          value={index + 1}
                          onChange={(e) => handleFilterChange(e)}
                        />
                        <label
                          htmlFor={`price${index}`}
                          className="ps-0 ps-lg-3 h5 m-0"
                        >
                          {name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* 茶種 */}
              <div className={`${styles['tea-filter']} gap-3 mb-3`}>
                <input
                  type="checkbox"
                  className="d-none"
                  id={`${styles.teaFilter}`}
                />
                <label
                  className="py-3 d-flex justify-content-between"
                  htmlFor={`${styles.teaFilter}`}
                >
                  <h5 className="m-0 fw-bold">茶種</h5>
                  <img src="/images/product/list1/Down-Arrow.svg" alt="" />
                </label>
                <div className={`${styles.teaCheckbox} ${styles.scrollBar}`}>
                  {teaArray.map((v, i) => {
                    return (
                      <div className="pt-3 d-flex" key={v.id}>
                        <input
                          type="checkbox"
                          className={`${styles.checkbox}`}
                          name="tea"
                          value={v.id}
                          id={`tea${v.id}`}
                          onChange={(e) => handleFilterChange(e)}
                        />
                        <label
                          htmlFor={`tea${v.id}`}
                          className="ps-0 ps-lg-3 h5 m-0"
                        >
                          {v.tea_name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* 品牌 */}
              <div className={`${styles['brand-filter']} gap-3 mb-3`}>
                <input
                  type="checkbox"
                  className="d-none"
                  id={`${styles.brandFilter}`}
                />
                <label
                  className="py-3 d-flex justify-content-between"
                  htmlFor={`${styles.brandFilter}`}
                >
                  <h5 className="m-0 fw-bold">品牌</h5>
                  <img src="/images/product/list1/Down-Arrow.svg" alt="" />
                </label>
                <div className={`${styles.brandCheckbox} ${styles.scrollBar}`}>
                  {brandArray.map((v, i) => {
                    return (
                      <div className="pt-3 d-flex" key={v.id}>
                        <input
                          type="checkbox"
                          className={`${styles.checkbox}`}
                          name="brand"
                          value={v.id}
                          id={`brand${v.id}`}
                          onChange={(e) => handleFilterChange(e)}
                        />
                        <label
                          htmlFor={`brand${v.id}`}
                          className="ps-0 ps-lg-3 h5 m-0"
                        >
                          {v.brand_name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* 包材 */}
              <div className={`${styles['package-filter']} gap-3 mb-3`}>
                <input
                  type="checkbox"
                  className="d-none"
                  id={`${styles.packageFilter}`}
                />
                <label
                  className="py-3 d-flex justify-content-between"
                  htmlFor={`${styles.packageFilter}`}
                >
                  <h5 className="m-0 fw-bold">包材</h5>
                  <img src="/images/product/list1/Down-Arrow.svg" alt="" />
                </label>
                <div
                  className={`${styles.packageCheckbox} ${styles.scrollBar}`}
                >
                  {pcArray.map((v, i) => {
                    return (
                      <div className="pt-3 d-flex" key={v.id}>
                        <input
                          type="checkbox"
                          className={`${styles.checkbox}`}
                          name="package"
                          value={v.id}
                          id={`package${v.id}`}
                          onChange={(e) => handleFilterChange(e)}
                        />
                        <label
                          htmlFor={`package${v.id}`}
                          className="ps-0 ps-lg-3 h5 m-0"
                        >
                          {v.package_name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* 茶品型態 */}
              <div className={`${styles['style-filter']} gap-3 mb-3`}>
                <input
                  type="checkbox"
                  className="d-none"
                  id={`${styles.styleFilter}`}
                />
                <label
                  className="py-3 d-flex justify-content-between"
                  htmlFor={`${styles.styleFilter}`}
                >
                  <h5 className="m-0 fw-bold">茶品型態</h5>
                  <img src="/images/product/list1/Down-Arrow.svg" alt="" />
                </label>
                <div className={`${styles.styleCheckbox} ${styles.scrollBar}`}>
                  {styleArray.map((v, i) => {
                    return (
                      <div className="pt-3 d-flex" key={v.id}>
                        <input
                          type="checkbox"
                          className={`${styles.checkbox}`}
                          name="style"
                          value={v.id}
                          id={`style${v.id}`}
                          onChange={(e) => handleFilterChange(e)}
                        />
                        <label
                          htmlFor={`style${v.id}`}
                          className="ps-0 ps-lg-3 h5 m-0"
                        >
                          {v.style_name}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <img
              className="d-none d-md-block"
              src="/images/product/list1/Union.svg"
              alt=""
            />
          </div>
          {/* right(商品列表) */}
          <div
            className={`${styles.right} col-12 col-sm-9 col-md-7 col-lg-9 pe-0 d-flex flex-column`}
          >
            {/* 排序等按鈕 */}
            <div className="d-flex justify-content-between">
              {/* 麵包屑、產品數量 */}
              <div
                className={`d-flex flex-column gap-3 ${styles.crumb} ${styles['product-total-count']} justify-content-end`}
              >
                <h4 className="m-0">
                  搜尋 &quot;<span className="fw-bold">{searchID}</span>&quot;{' '}
                </h4>
                <h4 className="m-0">共 {totalData} 筆</h4>
              </div>
              {/* 排序 */}
              <div
                className={`${styles['product-order-group']} d-flex justify-content-between align-items-end gap-3`}
              >
                <div
                  className={`${styles.perpage} d-flex justify-content-between align-items-center`}
                >
                  <select
                    name="perpage"
                    id="perpage"
                    className="p-sm-1 p-md-2"
                    onChange={(e) => {
                      setPerpage(e.target.value)
                      // 每次換頁面顯示筆數會回到第一頁
                      setPage(1)
                    }}
                    defaultValue={12}
                  >
                    <option value={12}>每頁顯示12筆</option>
                    <option value={20}>每頁顯示20筆</option>
                  </select>
                </div>
                <div
                  className={`${styles['product-order']} d-flex justify-content-between align-items-center`}
                >
                  <select
                    name="product-order"
                    id="product-order"
                    className="p-sm-1 p-md-2"
                    onChange={(e) => {
                      setOrder(e.target.value)
                    }}
                    defaultValue={1}
                  >
                    <option value={1}>價格由高到低</option>
                    <option value={2}>價格由低到高</option>
                  </select>
                </div>
              </div>
            </div>
            {/* 商品卡列表 */}
            <div className={`${styles['product-card-group']}`}>
              {product.length > 0 ? (
                product.map((v, i) => {
                  return (
                    <div
                      className={`${styles['product-card']} pb-3 d-flex flex-column`}
                      key={v.id}
                    >
                      <div className={`${styles['card-image']} pb-3`}>
                        <Link href={`/product/${v.id}`}>
                          <img
                            className="object-fit-cover"
                            src={`/images/product/list1/products-images/${v.paths}`}
                            alt=""
                          />
                        </Link>
                      </div>
                      <div
                        className={`${styles['card-body']} px-3 d-flex flex-column justify-content-between`}
                      >
                        <div className={`${styles['product-name']}`}>
                          <p>
                            <Link href={`/product/${v.id}`}>
                              {v.product_name}
                            </Link>
                          </p>
                        </div>
                        <div
                          className={`${styles['card-bottom']} d-flex justify-content-between align-items-center`}
                        >
                          <div
                            className={`${styles['product-icon']} d-flex gap-3`}
                          >
                            <button
                              className="btn p-0"
                              onClick={() =>
                                handleFavToggle(v.id, userID, isAuth)
                              }
                            >
                              {v.fav === false ? (
                                <img
                                  src="/images/product/list1/heart.svg"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src="/images/product/list1/heart-fill.svg"
                                  alt=""
                                />
                              )}
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                const item = { ...v, qty: 1 }
                                console.log(item)
                                notify(v.product_name)
                                addItem(item)
                              }}
                            >
                              <img
                                src="/images/product/list1/shooping-cart.svg"
                                alt=""
                              />
                            </button>
                          </div>
                          <div>
                            <p className="m-0">
                              NT$ <span>{v.price}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <h3>Oops! 沒有符合條件的商品</h3>
              )}
            </div>
            {/* 分頁按鈕 */}
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
      </div>
      {/* main-content---END--- */}
      <Toaster />
    </>
  )
}
