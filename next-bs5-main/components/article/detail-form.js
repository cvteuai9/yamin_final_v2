import { useState, useEffect } from 'react'
import StarLarge from '@/components/star/star-large'
import { IoEyeSharp } from 'react-icons/io5'
import { useAuth } from '@/hooks/my-use-auth'
import {
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaSearch,
} from 'react-icons/fa'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function DetailForm() {
  const router = useRouter()
  const { id } = router.query // 假設文章 ID 是通過路由傳遞的
  const [article, setArticle] = useState([])
  const [views, setViews] = useState(0)
  const [categories, setCategories] = useState([])
  const [topArticles, setTopArticles] = useState([]) // 儲存前五篇熱門文章
  const [newArticles, setNewArticles] = useState([]) // 儲存前五篇最新文章
  const [recommend, setRecommend] = useState([])
  const { auth } = useAuth()
  const [userID, setUserID] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  // console.log(id)
  const getArticle = async (id, userID, isAuth) => {
    // console.log(id);
    let apiUrl = `http://localhost:3005/api/my-articles/${id}`

    const res = await fetch(apiUrl)
    const data = await res.json()
    let articleThis = data.data.article
    let favoriteArticle = []
    if (isAuth) {
      // console.log(userID);
      const favoriteArticleUrl = `http://localhost:3005/api/my-articles/favorites?user_id=${userID}`
      const favoriteArticleRes = await fetch(favoriteArticleUrl)
      favoriteArticle = await favoriteArticleRes.json()
    }
    if (favoriteArticle.includes(articleThis.id)) {
      articleThis.fav = true
    } else {
      articleThis.fav = false
    }
    // console.log(articleThis)
    setArticle(articleThis)
  }
  // console.log(article)
  console.log(auth.userData)
  async function handleFavToggle(article, userID, isAuth) {
    if (isAuth) {
      if (article.fav === false) {
        await fetch(
          `http://localhost:3005/api/my-articles/favorites?user_id=${userID}&article_id=${article.id}`,
          {
            method: 'PUT',
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message === 'Favorite Article Insert successfully') {
              toast.success(<p className="m-0">加入收藏成功!</p>)
            } else {
              toast.error(<p className="m-0">加入收藏失敗!</p>)
            }
          })
          .catch((error) => console.log(error))
      } else {
        await fetch(
          `http://localhost:3005/api/my-articles/favorites?user_id=${userID}&article_id=${article.id}`,
          {
            method: 'DELETE',
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.message === 'Favorite Article DELETE successfully') {
              toast.success(<p className="m-0">移除收藏成功!</p>)
            } else {
              toast.error(<p className="m-0">移除收藏失敗!</p>)
            }
          })
          .catch((error) => console.log(error))
      }
      let tmp = { ...article, fav: !article.fav }
      setArticle(tmp)
    } else {
      // 原本寫的
      // if (confirm('您尚未登入，請登入後再操作!')) {
      //   router.push('/member/login')
      // }
      // Swal的confirm
      Swal.fire({
        title: '無法收藏',
        text: '您尚未登入，請登入後再操作!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '登入',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/member/login')
        }
      })
    }
  }
  const getRecommend = async (id) => {
    // console.log(id);
    let apiUrl = `http://localhost:3005/api/my-articles/${id}/recommendations`

    const res = await fetch(apiUrl)
    const data = await res.json()
    setRecommend(data.data.topMatches)
  }
  // console.log(recommend)
  const getViews = async (id) => {
    let apiUrl = `http://localhost:3005/api/my-articles/${id}/views`

    const res = await fetch(apiUrl)
    const data = await res.json()
    setViews(data.data.views)
  }

  const getCategories = async () => {
    const apiUrl = 'http://localhost:3005/api/my-articles/category'
    const res = await fetch(apiUrl)
    const data = await res.json()
    setCategories(data.data.articles_category)
  }
  const getTopArticles = async () => {
    const apiUrl = 'http://localhost:3005/api/my-articles/top-views' // 獲取熱門文章 API
    const res = await fetch(apiUrl)
    const data = await res.json()
    setTopArticles(data.data.top_views)
  }
  const getNewArticles = async () => {
    const apiUrl = 'http://localhost:3005/api/my-articles/new-articles'
    const res = await fetch(apiUrl)
    const data = await res.json()
    setNewArticles(data.data.new_articles)
  }
  useEffect(() => {
    setUserID(auth.userData.id)
    setIsAuth(auth.isAuth)
  }, [auth])
  useEffect(() => {
    if (router.isReady) {
      getArticle(router.query.articleCode, userID, isAuth)
      getRecommend(router.query.articleCode)
    }
  }, [router.isReady, userID, isAuth])
  // 確保views重整只會增加一次
  useEffect(() => {
    if (router.isReady) {
      getViews(router.query.articleCode)
    }
  }, [router.isReady])

  useEffect(() => {
    getCategories()
    getTopArticles()
    getNewArticles()
  }, [])

  // 推薦好茶圖片
  const TeaImage = ({ imagePath }) => {
    return (
      <div
        className="recom-tea-img"
        style={{ backgroundImage: `url(${imagePath})` }}
      ></div>
    )
  }
  return (
    <>
      <main className="articledetail">
        <div className="container-fluid mt-4">
          {/* <StarLarge /> */}
          <div className="row d-flex">
            {/*-------------------- 左邊主要區 ---------------------*/}
            <div className="col-lg-9 article-left pe-lg-3 mx-0 px-0">
              <div className="article_content py-4 mx-4">
                <div className="article_head bd-b1">
                  <h1 className="section-heading p-3">{article.title}</h1>
                  <div className="mobile">
                    <div className="timeandnum d-flex align-items-center my-4 p-3">
                      {/* 因為會有未加載完全，取不到值而報錯 */}
                      <p className="p2 mb-0 me-4">
                        {article.created_at
                          ? article.created_at.split(' ')[0]
                          : ''}
                      </p>
                      <IoEyeSharp color="#ffffffa0" />
                      <p className="p2 mb-0 me-4 ms-2">{article.views}</p>
                      <FaRegComment color="#ffffffa0" />
                      <p className="p2 mb-0 me-4 ms-2">10</p>
                    </div>
                    <div className="addbookmarks d-flex align-items-center">
                      {article.fav ? (
                        <button
                          className="btn d-flex align-items-center p-3"
                          type="button"
                          onClick={() =>
                            handleFavToggle(article, userID, isAuth)
                          }
                        >
                          <FaBookmark
                            size={16}
                            color="B29564"
                            className="icon"
                          />
                          <p className="ms-2 m-0">已收藏</p>
                        </button>
                      ) : (
                        <button
                          className="btn d-flex align-items-center p-3"
                          type="button"
                          onClick={() =>
                            handleFavToggle(article, userID, isAuth)
                          }
                        >
                          <FaRegBookmark
                            size={16}
                            color="B29564"
                            className="icon"
                          />
                          <p className="ms-2 m-0">加入收藏</p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="article-text bd-b1 p-3 mt-3 mx-4">
                <p>{article.content}</p>
              </div>
              {recommend.length > 0 && (
                <div className="recom-tea mt-3 p-3 bd-b1">
                  <h5 className="p-3">推薦好茶</h5>
                  <div className="recom-tea_group mt-3 mb-5">
                    {recommend.map((v) => (
                      <div className="recom-tea-item p-0" key={v.id}>
                        <Link href={`/product/${v.id}`}>
                          <TeaImage
                            imagePath={`/images/product/list1/products-images/${v.paths}`}
                          />
                          <div className="recom-tea-text p-3">
                            <p className="title">{v.product_name}</p>
                            <div className="price d-flex">
                              <p className="me-3">NT$</p>
                              <p>{v.price}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="comment mt-3 p-3">
                <h5 className="p-3">留言</h5>
                <div className="comment-block mt-3 mb-5">
                  <div className="comment-item d-flex">
                    <div className="d-flex">
                      <div className="com-member-info mt-2">
                        <img
                          src="/images/article/articledetail/member-default.svg"
                          alt=""
                        />
                      </div>
                      <div className="mx-5 mt-2">
                        <p className="mb-3 p-0">阿寶</p>
                        <p className="time m-0 p-0 p2">2024-06-28</p>
                      </div>
                    </div>
                    <div className="com-text p-3">
                      <p>good</p>
                      <p>good</p>
                    </div>
                  </div>
                </div>
                <div className="comment-block mt-3 mb-5">
                  <div className="comment-item d-flex">
                    <div className="d-flex">
                      <div className="com-member-info mt-2">
                        <img
                          src="/images/article/articledetail/lovely.png"
                          alt=""
                        />
                      </div>
                      <div className="mx-5 mt-2">
                        <p className="mb-3 p-0">阿寶</p>
                        <p className="time m-0 p-0 p2">2024-06-28</p>
                      </div>
                    </div>
                    <div className="input-com-text p-3">
                      <textarea
                        type="text"
                        placeholder="發表留言..."
                        defaultValue={''}
                      />
                      <div className="btn-com-text text-end">
                        <button className="cancle m-2">取消</button>
                        <button className="submit m-2">送出</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*----------------- 右邊 -----------------------*/}
            <div className="col-lg-3 article_info ">
              <div className="row mx-0 mt-3">
                <div className="col-12 ">
                  <div className="all_articles_title bgc-right">
                    <div className="article_right_title mx-0">
                      <h5 className="ps-3 py-3 mt-3">所有文章主題</h5>
                    </div>
                    <div className="articles_group mx-0">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          className="btn mb-3"
                          href={`/article/list?category_id=${category.id}`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div className="col-12 mt-5 mx-0">
                  <div className="search_article bgc-right mx-0">
                    <div className="article_right_title">
                      <div className="section-heading">
                        <h5 className="ps-3 py-3 mt-3">文章搜尋</h5>
                      </div>
                    </div>
                    <div className="article_search_block mt-3 ">
                      <button className="icon">
                        <FaSearch size={16} />
                      </button>
                      <input
                        className="ps-3 search"
                        type="text"
                        placeholder="Search in Article"
                      />
                    </div>
                  </div>
                </div> */}
                <div className="col-12 mt-5">
                  <div className="hot_article bgc-right pb-3">
                    <div className="article_right_title">
                      <div className="section-heading">
                        <h5 className="ps-3 py-3 mt-3">熱門文章</h5>
                      </div>
                    </div>
                    <div className="hot_article_group">
                      {topArticles.map((topArticle) => (
                        <div key={topArticle.id} className="d-flex mt-4">
                          <div className="me-4">
                            <img
                              className="mb-4"
                              src="/images/article/articledetail/article_front.svg"
                              alt=""
                            />
                          </div>
                          <div>
                            <a
                              className="mt-3 article_title"
                              href={`/article/${topArticle.id}`}
                            >
                              {topArticle.title}
                            </a>
                            <div className="d-flex timeandnum">
                              <p className="p2 mb-0 me-3 py-2">
                                {topArticle.created_at
                                  ? topArticle.created_at.split(' ')[0]
                                  : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-5">
                  <div className="new_article bgc-right pb-3">
                    <div className="article_right_title">
                      <div className="section-heading">
                        <h5 className="ps-3 py-3 mt-3">最新文章</h5>
                      </div>
                    </div>
                    <div className="new_article_group">
                      {newArticles.map((newArticle) => (
                        <div key={newArticle.id} className="d-flex mt-4">
                          <div className="me-4">
                            <img
                              className="mb-4"
                              src="/images/article/articledetail/article_front.svg"
                              alt=""
                            />
                          </div>
                          <div>
                            <a
                              className="mt-3 article_title"
                              href={`/article/${newArticle.id}`}
                            >
                              {newArticle.title}
                            </a>
                            <div className="d-flex timeandnum">
                              <p className="p2 mb-0 me-3 py-2">
                                {newArticle.created_at
                                  ? newArticle.created_at.split(' ')[0]
                                  : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  )
}
