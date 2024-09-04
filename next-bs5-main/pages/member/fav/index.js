import React, { useEffect } from 'react'
import FavoriteP from '@/components/member/fav/favorite-p'
import { useRouter } from 'next/router'

export default function Favorite() {
  const router = useRouter()
  useEffect(() => {
    router.push('/member/fav/favorite-p')
  })
  return <></>
}
