// 在新文件中，例如 UserProfileContext.js
import React, { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from '@/hooks/my-use-auth'
import { getUserById, updateProfileAvatar } from '@/services/my-user'
// import { v4 as uuidv4 } from 'uuid'

const UserProfileContext = createContext()

export const UserProfileProvider = ({ children }) => {
  const { auth } = useAuth()
  const [userProfile, setUserProfile] = useState({})
  const [avatarVersion, setAvatarVersion] = useState(Date.now())

  const updateUserProfile = async (newProfile) => {
    setUserProfile(newProfile)
    setAvatarVersion(Date.now())
  }

  const updateAvatar = async (formData) => {
    const res = await updateProfileAvatar(formData)
    if (res.data.status === 'success') {
      setAvatarVersion(Date.now())
      setUserProfile((prev) => ({
        ...prev,
        user_image: res.data.data.user_image,
      }))
      return true
    }
    return false
  }

  useEffect(() => {
    if (auth.isAuth) {
      getUserById(auth.userData.id).then((res) => {
        if (res.data.status === 'success') {
          setUserProfile(res.data.data.user)
        }
      })
    }
  }, [auth])

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        avatarVersion,
        updateAvatar,
        setUserProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = () => useContext(UserProfileContext)
