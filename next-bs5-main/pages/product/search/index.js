import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Search() {
  const router = useRouter()
  useEffect(() => {
    router.push('/product/list')
  })
  return null
}
