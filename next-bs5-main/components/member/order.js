// import styles from '@/components/member/ordered.module.css'
import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'
import { useAuth } from '@/hooks/my-use-auth'

export default function Ordered() {
  const { auth } = useAuth()

  if (!auth.isAuth) return <></>

  return (
    <>
      <div className="container-fluid mb-6">
        <div className="d-flex">
          <div className="titlenav">
            <img src="/images/favorite/title.svg" alt="" className="my-3" />
            <img
              src="/images/favorite/group.svg"
              alt=""
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="profile-content">
          <div className="row mt-4 ">
            <div className="col-md-4 profile-content-left">
              <Leftnav fromOrder="fromOrder" />
            </div>
            <div className="col-md-8 profile-content-right">
              <h3 className="goldenf">購買訂單</h3>
              <div className="order-cinput   mt-5">
                <p className=" grayf">購買商品</p>
                <input
                  className="inputtext"
                  type="text"
                  placeholder="您可以透過訂單編號或商品名稱搜尋"
                  style={{ width: 318 }}
                />
                {/* <img src="/images/favorite/date.svg" alt="date-btn" type="button"> */}
                <div type="button" className="order-searchbtn  btn2 m-0 ">
                  <i className="bi bi-search" style={{ color: '#ffffff' }} />
                  <p className=" mb-0">搜尋</p>
                </div>
              </div>
              <div className="order-cinput  mt-5">
                <p className=" grayf">購買商品</p>
                <input
                  className="inputtext"
                  type="text"
                  placeholder="2024-07-01"
                  style={{ width: 100 }}
                />
                <img
                  src="/images/favorite/date.svg"
                  alt="date-btn"
                  type="button"
                />
                <input
                  className="inputtext"
                  type="text"
                  placeholder="2024-07-01"
                  style={{ width: 100 }}
                />
                <img
                  src="/images/favorite/date.svg"
                  alt="date-btn"
                  type="button"
                />
                <p className=" grayf ms-3">品牌種類</p>
                <input
                  className="inputtext"
                  type="text"
                  placeholder="商品 / 課程"
                  style={{ width: 100 }}
                />
              </div>
              <div className="ordered-cinput   mt-5">
                <ul className="ordered-ordernav p whitef">
                  <li>全部</li>
                  <li>待付款</li>
                  <li>待出貨</li>
                  <li>待收貨</li>
                  <li>已完成</li>
                </ul>
              </div>
              <div className="ordered-cards p-0">
                <div className="ordered-pcard mt-3 ms-1 me-3">
                  <div className="ordered-imgbox">
                    <img src="/images/favorite/class.webp" alt="" />
                    <p className=" whitef50 mt-1">預計到貨日期：2024-07-10</p>
                  </div>
                  <div className="ordered-cardtext">
                    <p className="whitef50 mt-3">訂單編號：24022086925247</p>
                    <p className="whitef50">建立日期：2024/02/20 10:12</p>
                    <p className="whitef50">明細：三峽碧螺春</p>
                    <p className="whitef50">
                      狀態： <span>已取消</span>
                    </p>
                    <p className="whitef50">取消原因：重複購買</p>
                    <div className="ordered-bottomtext mt-3">
                      <Link href="/member/order/info" className="btn1 p">
                        訂單細節
                      </Link>

                      <p className="mt-3">訂單金額：2,880元(含運費)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ordered-cards  p-0">
                <div className="ordered-pcard mt-3 ms-1 me-3">
                  <div className="ordered-imgbox">
                    <img src="/images/favorite/class.webp" alt="" />
                    <p className=" whitef50 mt-1">預計到貨日期：2024-07-10</p>
                  </div>
                  <div className="ordered-cardtext">
                    <p className="whitef50 mt-3">訂單編號：24022086925247</p>
                    <p className="whitef50">建立日期：2024/02/20 10:12</p>
                    <p className="whitef50">明細：三峽碧螺春</p>
                    <p className="whitef50">
                      狀態： <span>已取消</span>
                    </p>
                    <p className="whitef50">取消原因：重複購買</p>
                    <div className="ordered-bottomtext mt-3">
                      <Link href="/member/order/info" className="btn1 p">
                        訂單細節
                      </Link>
                      <p className="mt-3">訂單金額：2,880元(含運費)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ordered-cards  p-0">
                <div className="ordered-pcard mt-3 ms-1 me-3">
                  <div className="ordered-imgbox">
                    <img src="/images/favorite/class.webp" alt="" />
                    <p className=" whitef50 mt-1">預計到貨日期：2024-07-10</p>
                  </div>
                  <div className="ordered-cardtext">
                    <p className="whitef50 mt-3">訂單編號：24022086925247</p>
                    <p className="whitef50">建立日期：2024/02/20 10:12</p>
                    <p className="whitef50">明細：三峽碧螺春</p>
                    <p className="whitef50">
                      狀態： <span>已取消</span>
                    </p>
                    <p className="whitef50">取消原因：重複購買</p>
                    <div className="ordered-bottomtext mt-3">
                      <Link href="/member/order/info" className="btn1 p">
                        訂單細節
                      </Link>
                      <p className="mt-3">訂單金額：2,880元(含運費)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ordered-cards  p-0">
                <div className="ordered-pcard mt-3 ms-1 me-3">
                  <div className="ordered-imgbox">
                    <img src="/images/favorite/class.webp" alt="" />
                    <p className=" whitef50 mt-1">預計到貨日期：2024-07-10</p>
                  </div>
                  <div className="ordered-cardtext">
                    <p className="whitef50 mt-3">訂單編號：24022086925247</p>
                    <p className="whitef50">建立日期：2024/02/20 10:12</p>
                    <p className="whitef50">明細：三峽碧螺春</p>
                    <p className="whitef50">
                      狀態： <span>已取消</span>
                    </p>
                    <p className="whitef50">取消原因：重複購買</p>
                    <div className="ordered-bottomtext mt-3">
                      <Link href="/member/order/info" className="btn1 p">
                        訂單細節
                      </Link>
                      <p className="mt-3">訂單金額：2,880元(含運費)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 頁碼 */}
              <div className="pageitem">
                <ul className="ps-0 mt-5">
                  <li className="pt-2 pb-2">
                    <img
                      src="/images/favorite/leftbtn.svg"
                      type="button"
                      alt=""
                    />
                  </li>
                  <li className="p" type="button">
                    1
                  </li>
                  <li className="p" type="button">
                    2
                  </li>
                  <li className="p" type="button">
                    3
                  </li>
                  <li className="p" type="button">
                    4
                  </li>
                  <li className="p" type="button">
                    5
                  </li>
                  <li className="pt-2 pb-2">
                    <img
                      src="/images/favorite/rightbtn.svg"
                      type="button"
                      alt=""
                    />
                  </li>
                </ul>
                <img
                  src="/images/favorite/line.svg"
                  alt=""
                  style={{ width: '20rem' }}
                />
              </div>
            </div>
            {/* 頁碼 */}
          </div>
        </div>
      </div>
    </>
  )
}
