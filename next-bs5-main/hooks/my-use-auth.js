import React, { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/services/axios-instance'
import { checkAuth, getFavs } from '@/services/my-user'

const AuthContext = createContext({ auth: {}, setUser: {} })

// 初始化會員狀態(登出時也要用)
// 只需要必要的資料即可，沒有要多個頁面或元件用的資料不需要加在這裡
// !!注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
export const initUserData = {
  id: 0,
  user_name: '',
  google_uid: '',
  // line_uid: '',
  // name: '',
  email: '',
  user_image: '',
}

export const AuthProvider = ({ children }) => {
  const router = useRouter()

  const [auth, setAuth] = useState({
    isAuth: false,
    userData: initUserData,
  })
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  // 得到我的最愛
  // const handleGetFavorites = async () => {
  //   const res = await getFavs()
  //   //console.log(res.data)
  //   if (res.data.status === 'success') {
  //     setFavorites(res.data.data.favorites)
  //   }
  // }

  // useEffect(() => {
  //   if (auth.isAuth) {
  //     // 成功登入後要執行一次向伺服器取得我的最愛清單
  //     handleGetFavorites()
  //   } else {
  //     // 登出時要設回空陣列
  //     setFavorites([])
  //   }
  // }, [auth])

  // 登入頁路由
  const loginRoute = '/member/login'
  // 隱私頁面路由，未登入時會，檢查後跳轉至登入頁
  const protectedRoutes = [
    '/product/cart',
    '/member/profile',
    '/member/changeps',
    '/member/order',
    '/member/order/info',
    '/member/coupon',
    '/member/order/review',
    '/member/fav/favorite-p',
    '/member/fav/favorite-a',
    '/member/fav/favorite-c',
    '/cart/cartOne',
    '/cart/cartTwoTest',
    '/cart/cartThree',
    '/order',
  ]
  useEffect(() => {
    // 加上protectedRoutes.includes(router.pathname)防止在不用保護的網頁檢查登入狀態而報錯
    if (!hasCheckedAuth && router.isReady) {
      handleCheckAuth()
      setHasCheckedAuth(true)
    }
  }, [router.isReady])

  // 我的最愛清單使用
  const [favorites, setFavorites] = useState([])
  const [userIntention, setUserIntention] = useState(null)

  useEffect(() => {
    // 當原有想訪問的頁面，儲存到storedIntention然後移除userIntention，不會隨著重新整理而消失
    const storedIntention = localStorage.getItem('userIntention')
    if (storedIntention) {
      setUserIntention(storedIntention)
      localStorage.removeItem('userIntention')
    }
  }, [])

  const [loading, setLoading] = useState(true)
  // 檢查會員認証用
  // 每次重新到網站中，或重新整理，都會執行這個函式，用於向伺服器查詢取回原本登入會員的資料
  // 因為1.	JWT 記憶體儲存：
  // • 當使用者登入成功後，伺服器會產生一個 JWT，並將它儲存在瀏覽器的 httpOnly cookie 中。這個 JWT 會包含一些使用者的基本資訊（如 user_id）。
  const handleCheckAuth = async () => {
    try {
      const res = await checkAuth()
      if (res.data.status === 'success') {
        const dbUser = res.data.data.user
        const userData = { ...initUserData }
        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }
        setAuth({ isAuth: true, userData })
      } else {
        console.warn(res.data)
        if (protectedRoutes.includes(router.pathname)) {
          router.push(loginRoute)
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error)
      // 這裡的錯誤處理防止報錯
      if (protectedRoutes.includes(router.pathname)) {
        router.push(loginRoute)
      }
    } finally {
      setLoading(false) // 認證檢查完成後停止加載狀態
    }
  }

  useEffect(() => {
    // 等到登入驗證流程完成後，才會跑下列程式
    if (!loading) {
      if (typeof window !== 'undefined') {
        console.log('Checking auth and pathname:', auth.isAuth, router.pathname)
        if (!auth.isAuth && protectedRoutes.includes(router.pathname)) {
          console.log('Not authenticated, redirecting to login...')
          localStorage.setItem('userIntention', router.pathname)
          router.push(loginRoute)
        } else if (
          auth.isAuth &&
          (router.pathname === '/member/register' ||
            router.pathname === '/member/login')
        ) {
          console.log('Authenticated, redirecting to intention or profile...')
          const storedIntention = localStorage.getItem('userIntention')
          if (storedIntention) {
            router.push(storedIntention)
            localStorage.removeItem('userIntention')
          } else {
            router.push('/member/profile')
          }
        }
      }
    }
  }, [loading, router.isReady, router.pathname, auth])
  
  

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        favorites,
        setFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
