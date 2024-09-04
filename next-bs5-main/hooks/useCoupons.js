// // ---08-29julia test Hook
// import { useState, useEffect, useCallback } from 'react'

// export function useCoupons() {
//   const [coupons, setCoupons] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [unusedCouponCount, setUnusedCouponCount] = useState(0)

//   const fetchCoupons = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       setError(null)
//       const response = await fetch(`http://localhost:3005/api/coupons`, {
//         credentials: 'include',
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log('Fetched coupons:', data)
//       setCoupons(data)
//       const unusedCount = data.filter(
//         (coupon) => coupon.user_status === 'unused'
//       ).length
//       setUnusedCouponCount(unusedCount)
//     } catch (error) {
//       console.error('獲取優惠券時出錯:', error)
//       setError(error.message || '獲取優惠券時出錯')
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchCoupons()
//   }, [fetchCoupons])

//   const submitCoupon = async (couponCode) => {
//     try {
//       const response = await fetch('http://localhost:3005/api/coupons', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ couponCode }),
//       })
//       const data = await response.json()

//       if (!response.ok) {
//         switch (data.error) {
//           case 'COUPON_NOT_FOUND':
//             throw new Error('代碼不存在')
//           case 'COUPON_ALREADY_CLAIMED':
//             throw new Error('優惠券已領取')
//           case 'COUPON_EXPIRED':
//             throw new Error('優惠券已失效')
//           case 'ERROR_INPUT':
//             throw new Error('請重新輸入')
//           default:
//             throw new Error('未知的錯誤')
//         }
//       }
//       await fetchCoupons()
//     } catch (error) {
//       console.error('提交優惠券時出錯:', error)
//       setError(error.message || '提交優惠券時出錯')
//     }
//   }

//   return {
//     coupons,
//     isLoading,
//     error,
//     unusedCouponCount,
//     fetchCoupons,
//     submitCoupon,
//   }
// }
