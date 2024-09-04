import axiosInstance, { fetcher } from './axios-instance'
import useSWR from 'swr'

/**
 * 檢查會員狀態使用
 */
export const checkAuth = async () => {
  return await axiosInstance.get('/my-auth/check')
}
/**
 * Google Login(Firebase)登入用，providerData為登入後得到的資料
 */
export const googleLogin = async (providerData = {}) => {
  return await axiosInstance.post('/my-google-login', providerData)
}

export const login = async (loginData = {}) => {
  return await axiosInstance.post('/my-auth/login', loginData)
}
/**
 * 登出用
 */
export const logout = async () => {
  return await axiosInstance.post('/my-auth/logout', {})
}
/**
 * 載入會員id的資料用，需要登入後才能使用。此API路由會檢查JWT中的id是否符合本會員，不符合會失敗。
 */
export const getUserById = async (id = 0) => {
  return await axiosInstance.get(`/my-users/${id}`)
}
/**
 * 忘記密碼/OTP 要求一次性密碼
 */
export const requestOtpToken = async (email = '') => {
  return await axiosInstance.post('/reset-password/otp', { email })
}
/**
 * 忘記密碼/OTP 重設密碼
 */
export const resetPassword = async (email = '', password = '', token = '') => {
  return await axiosInstance.post('/reset-password/reset', {
    email,
    token,
    password,
  })
}
/**
 * 註冊用
 */
export const register = async (user = {}) => {
  return await axiosInstance.post('/my-users', user)
}
/**
 * 修改會員一般資料用(排除password, username, email)
 */
export const updateProfile = async (id = 0, user = {}) => {
  return await axiosInstance.put(`/my-users/${id}/profile`, user)
}
/**
 * 修改會員頭像用，需要用FormData
 */
export const updateProfileAvatar = async (formData) => {
  return await axiosInstance.post(`/my-users/upload-avatar`, formData)
}
/**
 * 修改會員密碼專用, password = { originPassword, newPassword }
 */
export const updatePassword = async (id = 0, password = {}) => {
  return await axiosInstance.put(`/my-users/${id}/password`, password)
}
/**
 * 獲得會員有加在我的最愛的商品id，回傳為id陣列
 */
export const getFavs = async () => {
  return await axiosInstance.get('/favorites')
}
/**
 * 新增商品id在該會員的我的最愛清單中的
 */
export const addFav = async (pid) => {
  return await axiosInstance.put(`/favorites/${pid}`)
}
/**
 * 移除商品id在該會員的我的最愛清單中的
 */
export const removeFav = async (pid) => {
  return await axiosInstance.delete(`/favorites/${pid}`)
}

export const useUser = (id) => {
  const { data, error, isLoading } = useSWR(`/users/${id}`, fetcher)

  return {
    data,
    isLoading,
    isError: error,
  }
}

// 解析accessToken用的函式
export const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}
