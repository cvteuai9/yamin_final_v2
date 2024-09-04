// 目的1: 將context provide(提供者)中的共享狀態集中統一管理
// 目的2: 包裝useContext，提供一個對應適合的名稱為useAuth，方便消費者(consumers)呼叫使用

import { createContext, useState, useContext, useEffect } from 'react'
import {
  init,
  initState,
  addOne,
  findOneById,
  updateOne,
  removeOne,
  incrementOne,
  decrementOne,
  generateCartState,
} from './yamin-cart-reducer'
import YaminCartStorage from './yamin-cart-LocalStorage'
import useLocalStorage from './use-localstorage'
import { remove } from 'lodash'
// 1.建立context與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
const YaminCartContext = createContext(null)

// 2. 建立CartProvider元件
// 夾在中間裡的 就叫做props.childrens
// 例如這樣<MyCom>中間就是props.childrens</MyCom>
export const YaminCartProvider = ({
  children,
  initialCartItems = [],
  localStorageKey = 'cart',
}) => {
  let items = initialCartItems
  if (!items.length) {
    try {
      // 修正nextjs中window is undefined的問題
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(localStorageKey)
        // 剖析存儲的json，如果沒有則返回初始值
        items = item ? JSON.parse(item) : []
      }
    } catch (error) {
      items = []
      console.log(error)
    }
  }
  // 初始化 cartItems, cartState
  const [selectedValue, setSelectedValue] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [selectOrderId, setSelectOrderId] = useState([])
  const [selectCourseId, setSelectCourseId] = useState([])
  const [cartItems, setCartItems] = useState(items)
  const [cartState, setCartState] = useState(init(initialCartItems))

  // 初始化 setValue(localStoage), setValue用於存入localStorage中
  const [storedValue, setValue] = YaminCartStorage(localStorageKey, items)

  // 當 cartItems 更動時 -> 更動 localStorage 中的值 -> 更動 cartState
  useEffect(() => {
    // 使用字串比較
    if (JSON.stringify(cartItems) !== storedValue) {
      setValue(cartItems)
    }
    // 有更動時，重新設定cartState
    setCartState(generateCartState(cartState, cartItems))

    // eslint-disable-next-line
  }, [cartItems])

  /**
   * 加入新項目，重覆項目 quantity: quantity + 1
   */
  const addItem = (item) => {
    setCartItems(addOne(cartItems, item))
  }
  /**
   * 給定一id值，將這商品移出陣列中
   */
  const removeItem = (id) => {
    setCartItems(removeOne(cartItems, id))
  }
  /**
   * 給定一item物件，更新其中的屬性值(依照id為準)
   */
  const updateItem = (item) => {
    setCartItems(updateOne(cartItems, item))
  }
  /**
   * 給定一id與quantity，更新某個項目的數量
   */
  const updateItemQty = (id, qty) => {
    const item = findOneById(cartItems, id)
    // 如果沒有id，則不更新
    if (!item.id) return
    // 更新項目
    const updateItem = { ...item, qty }
    setCartItems(updateOne(cartItems, updateItem))
  }
  /**
   * 清空整個購物車
   */
  const clearCart = () => {
    setCartItems([])
  }
  /**
   * 給定一id值，回傳是否存在於購物車中
   */
  const isInCart = (id) => {
    return cartItems.some((item) => item.id === id)
  }
  /**
   * 給定一id值，有尋找到商品時，設定quantity: quantity + 1
   */
  const increment = (id) => {
    setCartItems(incrementOne(cartItems, id))
  }
  /**
   * 給定一id值，有尋找到商品時，設定quantity: quantity - 1，但 quantity 最小值為1
   */
  const decrement = (id) => {
    setCartItems(decrementOne(cartItems, id))
  }
  return (
    <YaminCartContext.Provider
      value={{
        cart: cartState,
        items: cartState.items, //items與cartState.items差了一個subtoal屬性
        addItem,
        removeItem,
        updateItem,
        updateItemQty,
        clearCart,
        isInCart,
        increment,
        decrement,
        selectedValue,
        setSelectedValue,
        selectedId,
        setSelectedId,
        selectOrderId,
        setSelectOrderId,
        selectCourseId,
        setSelectCourseId,
      }}
    >
      {children}
    </YaminCartContext.Provider>
  )
}

//  3. 建立一個包裝useContext的useAuth
export const YaminUseCart = () => useContext(YaminCartContext)
