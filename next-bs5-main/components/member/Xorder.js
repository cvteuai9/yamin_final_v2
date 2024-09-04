import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'

export default function Order() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="titlenav">
            <img src="/images/favorite/title.svg" alt="" />
            <img
              src="/images/favorite/group.svg"
              alt=""
              style={{ width: '100%' }}
            />
          </div>
          <div className="col-md-3 ">
            <Leftnav />
          </div>
          <div className="col-md-9 ">
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
            <div className="ordered-cinput mt-5">
              <ul className="ordered-ordernav p whitef">
                <li>全部</li>
                <li>待付款</li>
                <li>待出貨</li>
                <li>待收貨</li>
                <li>已完成</li>
              </ul>
            </div>
            <p className=" grayf d-flex   mt-5">此帳戶當前沒有訂單。</p>
          </div>
        </div>
      </div>
    </>
  )
}
