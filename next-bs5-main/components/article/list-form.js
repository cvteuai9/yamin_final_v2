/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import styles from '@/components/article/list.module.scss'
import option from '@/components/article/option.module.sass'
import StarLarge from '@/components/star/star-large'
import { IoEyeSharp } from 'react-icons/io5'
import { FaRegComment, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { FaAngleDown } from 'react-icons/fa6'
import Link from 'next/link'
import StarPage from '@/components/star/star-page'
import { useAuth } from '@/hooks/my-use-auth'
import next from 'next'

export default function ListForm() {
  const router = useRouter()
  const { category_id, page = 1, sort = 'date_desc' } = router.query
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [sortOrder, setSortOrder] = useState(router.query.sort || 'date_desc')
  const [totalPages, setTotalPages] = useState(1)
  const ARTICLES_PER_PAGE = 12; // 每頁顯示的文章數量
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)


  // 使用 useCallback 優化函數
  const getArticles = useCallback(async (categoryId, currentSortOrder, userID, isAuth) => {
    try {
      const currentPage = router.query.page || '1'
      const apiUrl = `http://localhost:3005/api/my-articles/filter?category_id=${categoryId || 1}&page=${currentPage}&limit=${ARTICLES_PER_PAGE}&sort=${currentSortOrder}`
      const res = await fetch(apiUrl)
      const data = await res.json()

      let favoriteArticles = []
      if (isAuth) {
        const favRes = await fetch(
          `http://localhost:3005/api/my-articles/favorites?user_id=${userID}`
        )
        favoriteArticles = await favRes.json()
      }
      const nextData = data.data.articles.map((article) => ({
        ...article,
        fav: favoriteArticles.includes(article.id)
      }))
      setArticles(nextData)
      setTotalPages(Math.ceil(data.data.totalCount / ARTICLES_PER_PAGE))
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    }
  }, [router.query.page])
  // console.log(articles);
  // 處理我的最愛
  async function handleFavToggle(id, userID, isAuth) {
    if (isAuth) {
      const nextArticle = articles.map((v, i) => {
        if (v.id === id) {
          if (v.fav === false) {
            fetch(
              `http://localhost:3005/api/my-articles/favorites?user_id=${userID}&article_id=${id}`,
              {
                method: 'PUT',
              }
            )
          } else {
            fetch(
              `http://localhost:3005/api/my-articles/favorites?user_id=${userID}&article_id=${id}`,
              {
                method: 'DELETE',
              }
            )
          }
          return { ...v, fav: !v.fav }
        } else {
          return v
        }
      })
      setArticles(nextArticle)
    } else {
      // 如果沒有登入，則導向至登入頁面
      if (confirm('您尚未登入，請登入後再操作!')) {
        router.push('/member/login')
      }
    }
  }
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])

  const getCategories = useCallback(async () => {
    try {
      const apiUrl = 'http://localhost:3005/api/my-articles/category'
      const res = await fetch(apiUrl)
      const data = await res.json()
      setCategories(data.data.articles_category)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  const handleCategoryClick = useCallback(async (event, category) => {
    event.preventDefault()
    const { name, id } = category
    if (id === selectedCategoryId) return;
    setArticles([])//讓圖片的路徑不會報錯
    setSelectedCategory(name)
    setSelectedCategoryId(id)

    localStorage.setItem('lastVisitedCategoryId', id.toString());
    await router.push({
      pathname: router.pathname,
      query: { category_id: id, sort: sortOrder },
    }, undefined, { shallow: true })
    await getArticles(id, sortOrder)
  }, [selectedCategoryId, sortOrder, router, getArticles])


  const getImagePathPrefix = useCallback((categoryName) => {
    const pathMap = {
      '茶知識': '/images/article/articlelist/teaknow/',
      '茶創新': '/images/article/articlelist/teanew/',
      '茶故事': '/images/article/articlelist/teastory/',
      '茶生活應用': '/images/article/articlelist/tealife/'
    }
    return pathMap[categoryName] || '/images/article/articlelist/articledefault.jpg'
  }, [])

  const handleSortChange = useCallback(async (event) => {
    event.preventDefault()
    const value = event.target.dataset.value
    if (sortOrder !== value) {
      setSortOrder(value)
      await router.push({
        pathname: router.pathname,
        query: { ...router.query, sort: value, page: 1 },
      }, undefined, { shallow: true })
      await getArticles(selectedCategoryId, value)
    }
  }, [sortOrder, selectedCategoryId, router, getArticles])

  useEffect(() => {
    const initializeCategory = async () => {
      let initialCategoryId = router.query.category_id || localStorage.getItem('lastVisitedCategoryId') || '1'
      let initialSortOrder = router.query.sort || 'date_desc'
      let initialPage = router.query.page || '1'

      if (!router.isReady) return;

      if (router.query.category_id !== initialCategoryId ||
        router.query.sort !== initialSortOrder ||
        router.query.page !== initialPage) {
        await router.push({
          pathname: router.pathname,
          query: {
            category_id: initialCategoryId,
            sort: initialSortOrder,
            page: initialPage
          },
        }, undefined, { shallow: true })
      }

      setSelectedCategoryId(parseInt(initialCategoryId))
      setSortOrder(initialSortOrder)
    }

    initializeCategory()
    getCategories()
  }, [router.isReady, router.query, router, getCategories])

  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId) {
      const category = categories.find(cat => cat.id === selectedCategoryId) || categories[0]
      setSelectedCategory(category.name)
      getArticles(category.id, sortOrder, userID, isAuth)
    }
  }, [selectedCategoryId, categories, sortOrder, getArticles, userID, isAuth])

  // 分頁處理函數
  const handlePageChange = useCallback(async (newPage) => {
    await router.push({
      pathname: router.pathname,
      query: { category_id: selectedCategoryId, page: newPage, sort: sortOrder },
    }, undefined, { shallow: true })
    await getArticles(selectedCategoryId, sortOrder)
  }, [selectedCategoryId, sortOrder, router, getArticles])



  return (
    <main className={styles['article-list']}>
      <div className="container-fluid">
        {/* <div className={styles.headerImg}>
          <img src="/images/article/articlelist/article-header.webp" alt="" />
        </div> */}
        <div className={styles['typetitle_group']}>
          {categories.map((category) => (
            <a
              key={category.id}
              className={styles['btn']}
              href="#"
              onClick={(event) => handleCategoryClick(event, category)}
            >
              {category.name}
            </a>
          ))}
        </div>
        <StarLarge />
        <div className="d-flex justify-content-between align-items-center mt-5 px-4">
          <h4>{selectedCategory}</h4>
          <div className="d-flex justify-content-end">
            <div className={`d-flex align-items-center justify-content-between ${option['articlechoose']}`}>
              <input type="checkbox" name="a1-1" id="a1-1" />
              <label htmlFor="a1-1" className="d-flex flex-column">
                <p className="mb-0 align-items-center">
                  文章排序
                  <FaAngleDown className={option['icon']} />
                </p>
                <ul className="ul1">
                  <li><a href="#" data-value="date_desc" onClick={handleSortChange}>發布日期:由新到舊</a></li>
                  <li><a href="#" data-value="date_asc" onClick={handleSortChange}>發布日期:由舊到新 </a></li>
                  <li><a href="#" data-value="views_desc" onClick={handleSortChange}>觀看次數:由高到低</a></li>
                  <li><a href="#" data-value="views_asc" onClick={handleSortChange}>觀看次數:由低到高 </a></li>
                </ul>
              </label>
            </div>
          </div>
        </div>
        <div className={`row row-cols-1 row-cols-md-2 row-cols-lg-3 my-4 g-5 mx-0 ${styles['articlelist']}`}>
          {articles.map((article) => (
            <div className="col" key={article.id}>
              <div className={styles['articlecard']}>
                <Link href={`/article/${article.id}`} className={styles['articleLink']}>
                  <img
                    className={styles['articlecard-img']}
                    src={`${getImagePathPrefix(selectedCategory)}${article.article_images.replace(/"/g, '')}`}
                    alt=""
                    onError={(e) => { e.target.src = '/images/article/articlelist/articledefault.jpg'; }}
                  />
                </Link>

                <div className={`${styles['articlec-body']} m-3`}>
                  <div className={`${styles['timeandnum']} m-3`}>
                    <p className="p2 mb-0 me-3">{article.created_at.split(' ')[0]}</p>
                    <IoEyeSharp className={`${styles['icon']}`} color="#ffffffa0" />
                    <p className="p2 mb-0 me-3 ms-2">{article.views}</p>
                    {/* <FaRegComment color="#ffffffa0" />
                    <p className="p2 mb-0 me-3 ms-2">10</p> */}
                    <button className='btn p-0 m-0 d-flex align-items-center' onClick={() =>
                      handleFavToggle(article.id, userID, isAuth)
                    }>
                      {article.fav === false ? (<FaRegBookmark color="#ffffffa0" className={`${styles['icon']}`} />) : (<FaBookmark color='#b29564' className={`${styles['icon']}`} />)}

                    </button>
                  </div>
                  <Link href={`/article/${article.id}`} className={styles['articleLink']}>
                    <h5 className={`${styles['arttitle']} m-3`}>{article.title}</h5>
                    <p className={`${styles['arttext']} m-3`}>{article.content}</p>
                    <div className="d-flex">
                      <p className={`${styles['arttext']} m-3 p2`}>閱讀更多</p>
                      <img
                        src="/images/article/articlelist/rightarrow.svg"
                        alt="Right Arrow"
                        className={styles['arrow-animation']}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 分頁 */}
        <div className={`${styles['articlepagearea']}`}>
          <div className={`${styles['articlepage']}`}>
            <img
              src="/images/article/articlelist/articlepage-leftarrow.svg"
              alt="Previous Page"
              onClick={() => handlePageChange(Math.max(1, parseInt(page) - 1))}
              style={{ cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            />
            <div className={`${styles['articlepagenume']}`}>
              {
                Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={pageNumber === parseInt(page) ? styles['active'] : ''}
                    >
                      {pageNumber}
                    </button>
                  );
                })
              }
            </div>
            <img
              src="/images/article/articlelist/articlepage-rightarrow.svg"
              alt="Next Page"
              onClick={() => handlePageChange(Math.min(totalPages, parseInt(page) + 1))}
              style={{ cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            />
          </div>
          <StarPage />
        </div>
      </div>
    </main>
  )
}