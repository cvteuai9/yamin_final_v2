import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PacmanLoader from 'react-spinners/PacmanLoader'

// 載入動畫樣式用
// https://www.npmjs.com/package/react-spinners
const override = {
  display: 'block',
  margin: '0 auto',
  // borderColor: 'red',
}

export default function Detail() {
  // 第1步: 宣告路由器
  // router.query 物件值，裡面會包含productCode屬性值
  // router.isReady 布林值，初次渲染會是false，next會經過"水合化作用"(相當於SSR)後，再渲染一次，讓isReady改變為true，代表水合化完成，此時才能得到query值
  const router = useRouter()

  // 商品用物件狀態
  const [product, setProduct] = useState({
    id: 0,
    picture: '',
    stock: 0,
    name: '',
    price: 0,
    tags: '',
  })

  // 載入指示動畫用布林狀態
  // 預設值為true，代表一開始進入此頁面就要呈現載入動畫(或是作載入動作)
  const [isLoading, setIsLoading] = useState(true)

  // 向伺服器fetch獲取資料
  const getProduct = async (id) => {
    const apiURL = `https://my-json-server.typicode.com/eyesofkids/json-fake-data/products/${id}`

    const res = await fetch(apiURL)
    const data = await res.json()

    console.log(data)

    // 設定到狀態中 ==> 觸發re-render(進入update階段)
    setProduct(data)

    // 關閉載入動畫，設定一段時間後再關閉載入動畫
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // 第2步: 用useEffect監聽router.isReady變動，當改變為true時代表query有productCode可以使用了
  useEffect(() => {
    if (router.isReady) {
      //這裡可以確保得到router.query
      console.log(router.query)

      // 向伺服器要求獲取資料
      getProduct(router.query.productCode)
    }
    // 以下為省略eslint檢查一行
    // eslint-disable-next-line
  }, [router.isReady])

  const loader = (
    <PacmanLoader
      color="#ff6600"
      loading={isLoading}
      cssOverride={override}
      size={30}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )

  const display = (
    <>
      <h1>商品詳細頁</h1>
      <hr />
      <p>
        <Link href="/cs-0731/product-qs/list">連至 列表頁</Link>
      </p>
      <h2>{product.name}</h2>
      <p>NT$ {product.price}</p>
      <p>庫存 {product.stock}</p>
    </>
  )

  return <>{isLoading ? loader : display}</>
}
