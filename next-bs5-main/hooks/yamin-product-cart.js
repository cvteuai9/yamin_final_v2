// 目的1: 將context provide(提供者)中的共享狀態集中統一管理
// 目的2: 包裝useContext，提供一個對應適合的名稱為useAuth，方便消費者(consumers)呼叫使用

import { createContext, useState, useContext, useEffect } from 'react'

// 1.建立context與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
const YaminProductCartContext = createContext(null)

// 2. 建立CartProvider元件
// 夾在中間裡的 就叫做props.childrens
// 例如這樣<MyCom>中間就是props.childrens</MyCom>
export default function YaminProductCartProvider({ children }) {
  const [didMount, setDidMount] = useState(false)

  const [ProductcartItems, ProductsetCartItems] = useState([])

  // 處理遞增
  const handleIncrease = (productId) => {
    const nextCartItems = ProductcartItems.map((v) => {
      if (v.id === productId) return { ...v, qty: v.qty + 1 }
      else return v
    })

    ProductsetCartItems(nextCartItems)
  }

  // 處理遞減
  const handleDecrease = (productId) => {
    const nextCartItems = ProductcartItems.map((v) => {
      if (v.id === productId) return { ...v, qty: v.qty - 1 }
      else return v
    })

    ProductsetCartItems(nextCartItems)
  }

  // 處理刪除
  const handleRemove = (productId) => {
    const nextCartItems = ProductcartItems.filter((v) => {
      return v.id !== productId
    })

    ProductsetCartItems(nextCartItems)
  }

  const handleAdd = (product) => {
    // 先判斷此商品是否已經在購物車中
    const foundIndex = ProductcartItems.findIndex((v) => v.id === product.id)

    if (foundIndex > -1) {
      handleIncrease(product.id)
    } else {
      const newCartItem = { ...product, qty: 1 }
      const nextCartItems = [newCartItem, ...ProductcartItems]
      ProductsetCartItems(nextCartItems)
    }
  }

  const calcTotalQty = () => {
    let total = 0

    for (let i = 0; i < ProductcartItems; i++) {
      total += ProductcartItems[i].qty

      return total
    }
  }

  const calcTotalPrice = () => {
    let total = 0

    for (let i = 0; i < ProductcartItems; i++) {
      total += ProductcartItems[i].qty * ProductcartItems[i].price

      return total
    }
  }

  const totalQty = ProductcartItems.reduce((acc, v) => acc + v.qty, 0)
  const totalPrice = ProductcartItems.reduce(
    (acc, v) => acc + v.qty * v.price,
    0
  )

  // 初次渲染的時間點，從localStorage讀出資料設定到狀態中
  useEffect(() => {
    setDidMount(true)
    // 保護語法，避免掉ssr重複渲染的情況
    if (typeof window !== 'undefined') {
      ProductsetCartItems(JSON.parse(localStorage.getItem('Productcart')) || [])
    }
  }, [])
  //  購物車資料有更動(新增、刪除、修改)時，寫入localStorage
  useEffect(() => {
    if (didMount) {
      localStorage.setItem('ProductCart', JSON.stringify(ProductcartItems))
    }
    console.log(`save ${ProductcartItems.length} to localStorage`)
  }, [ProductcartItems, didMount])

  return (
    <YaminProductCartContext.Provider
      value={{
        ProductcartItems,
        totalPrice,
        totalQty,
        handleAdd,
        handleDecrease,
        handleIncrease,
        handleRemove,
      }}
    >
      {children}
    </YaminProductCartContext.Provider>
  )
}

//  3. 建立一個包裝useContext的useAuth
export const YaminUseProductCart = () => useContext(YaminProductCartContext)
