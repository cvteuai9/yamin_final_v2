import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { checkAuth, login, glogout, getUserById } from '@/services/my-user'
import { useRouter } from 'next/router'

export const useAuth = () => {
  const { setLoading, setUser, token, setToken } = useContext(AuthContext)
  const router = useRouter()

  // 提供給其他程式使用
  const login = async (email, password) => {
    try {
      const url = 'http://localhost:3005/api/my-auth/login'
      const formData = new FormData()
      // formData.append('id', id)
      formData.append('email', email)
      formData.append('password', password)

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const result = await response.json()

      if (result.status === 'success') {
        setToken(result.token)
        localStorage.setItem('nextNeToken', result.token)
        return result.user_name // 返回 user_name
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      alert(error.message)
      return null
    }
  }
  const logout = async () => {

    const currentPath = router.pathname;
    localStorage.setItem('logoutRedirectPath', currentPath);
    if (token) {
      let newToken, error
      const url = 'http://localhost:3005/api/my-auth/logout'
      newToken = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === 'success') {
            return result.token
          } else {
            throw new Error(result.message)
          }
        })
        .catch((err) => {
          error = err
          return undefined
        })
      if (error) {
        alert(error.message)
        return
      }
      if (newToken) {
        setToken(newToken)
        localStorage.setItem('nextNeToken', newToken)
      }
    }
    else {
      const res = await glogout()

      console.log(res.data)

      // 成功登出個回復初始會員狀態
      if (res.data.status === 'success') {
        setUser(null)
        setLoading(false)
      } else {
        alert(`登出失敗`)
      }
    }

  }

  // 這樣可以用解構賦值
  return { login, logout }
}

export const initUserData = {
  id: 0,
  user_name: '',
  google_uid: '',
  email: '',
}
