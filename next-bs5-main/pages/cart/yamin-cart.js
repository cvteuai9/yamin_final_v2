// // import { useState } from 'react'
// import List1 from './list1'
// import CardOne from './cartOne'
// import { YaminUseCart } from '@/hooks/yamin-use-cart'

// export default function yaminCart() {
//   const { totalPrice, totalQty } = YaminUseCart()
//   // const [cartItems, setCartItems] = useState([])
// test
//   // // 處理遞增
//   // const handleIncrease = (productId) => {
//   //   const nextCartItems = cartItems.map((v) => {
//   //     if (v.id === productId) return { ...v, qty: v.qty + 1 }
//   //     else return v
//   //   })

//   //   setCartItems(nextCartItems)
//   // }

//   // // 處理遞減
//   // const handleDecrease = (productId) => {
//   //   const nextCartItems = cartItems.map((v) => {
//   //     if (v.id === productId) return { ...v, qty: v.qty - 1 }
//   //     else return v
//   //   })

//   //   setCartItems(nextCartItems)
//   // }

//   // // 處理刪除
//   // const handleRemove = (productId) => {
//   //   const nextCartItems = cartItems.filter((v) => {
//   //     return v.id !== productId
//   //   })

//   //   setCartItems(nextCartItems)
//   // }

//   // const handleAdd = (product) => {
//   //   // 先判斷此商品是否已經在購物車中
//   //   const foundIndex = cartItems.findIndex((v) => v.id === product.id)

//   //   if (foundIndex > -1) {
//   //     handleIncrease(product.id)
//   //   } else {
//   //     const newCartItem = { ...product, qty: 1 }
//   //     const nextCartItems = [newCartItem, ...cartItems]
//   //     setCartItems(nextCartItems)
//   //   }
//   // }

//   // const calcTotalQty = () => {
//   //   let total = 0

//   //   for (let i = 0; i < cartItems; i++) {
//   //     total += cartItems[i].qty

//   //     return total
//   //   }
//   // }

//   // const calcTotalPrice = () => {
//   //   let total = 0

//   //   for (let i = 0; i < cartItems; i++) {
//   //     total += cartItems[i].qty * cartItems[i].price

//   //     return total
//   //   }
//   // }

//   // const totalQty = cartItems.reduce((acc, v) => acc + v.qty, 0)
//   // const totalPrice = cartItems.reduce((acc, v) => acc + v.qty * v.price, 0)

//   return (
//     <>
//       <List1></List1>
//       <CardOne></CardOne>
//     </>
//   )
// }
