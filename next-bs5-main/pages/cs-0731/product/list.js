import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function List() {
  // 注意1: 初始值至少要空陣列，初次render是用初始值
  // 注意2: 應用執行過程中，一定要保持狀態資料類型都是陣列
  const [products, setProducts] = useState([])

  // 向伺服器fetch獲取資料
  const getProducts = async () => {
    const apiURL =
      'https://my-json-server.typicode.com/eyesofkids/json-fake-data/products'

    const res = await fetch(apiURL)
    const data = await res.json()

    console.log(data)

    // 設定到狀態中 ==> 觸發re-render(進入update階段)
    setProducts(data)
  }

  // 樣式2 didMount
  // 首次render之後(after)執行一次，之後不會再執行
  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <h1>商品列表頁</h1>
      <ul>
        {products.map((v, i) => {
          return (
            <li key={v.id}>
              <Link href={`/cs-0731/product/${v.id}`}>{v.name}</Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
