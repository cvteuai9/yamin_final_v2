import Leftnav from '@/components/member/left-nav'
import Link from 'next/link'
export default function Orderedinfo() {
  return (
    <>
       <div className="container-fluid mb-6">
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
            <h3 className="goldenf">訂單明細</h3>
            <div className="orderinfo-cards p-0 ">
              <div className="orderinfo-pcard mt-3 ms-1 me-3 ">
                <div className="orderinfo-info  ">
                  <div className="orderinfo-cardtext  ">
                    <p className="whitef50 mt-3">訂單編號：24022086925247</p>
                    <p className="whitef50">
                      狀態： <span>已取消</span>
                    </p>
                    <p className="whitef50">取消原因：重複購買</p>
                    <p className="whitef50">建立日期：2024/02/20 10:12</p>
                    <p className="whitef50">訂單內容</p>
                    <div className="orderinfo  ">
                      <img src="/images/favorite/class.webp" alt="" />
                      <p>三峽碧螺春</p>
                      <p>【 40g–精裝盒 】</p>
                      <p>x2</p>
                      <p>NT$ 1,300元</p>
                      <p
                        className="btn1 d-flex align-self-center"
                        type="button"
                      >
                        <Link
                          href="/member/order/review"
                          className=" d-flex align-self-center"
                        >
                          前往評論
                        </Link>
                      </p>
                    </div>
                    <div className="orderinfo  ">
                      <img src="/images/favorite/class.webp" alt="" />
                      <p>三峽碧螺春</p>
                      <p>【 40g–精裝盒 】</p>
                      <p>x2</p>
                      <p>NT$ 1,300元</p>

                      <p
                        className="btn1 d-flex align-self-center"
                        type="button"
                      >
                        <Link
                          href="/member/order/review"
                          className=" d-flex align-self-center"
                        >
                          前往評論
                        </Link>
                      </p>
                    </div>
                    <div className="orderinfo-bottomtext  ">
                      <p className="mt-3 d-flex justify-content-end">
                        小計：&nbsp;NT$ 2,600元
                      </p>
                      <p className="d-flex justify-content-end">
                        運費：&nbsp;NT$ 280元
                      </p>
                    </div>

                    <p className="goldenf mt-3 d-flex justify-content-end">
                      訂單金額：&nbsp;2,880元(含運費)
                    </p>
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
            {/* 頁碼 */}
          </div>
        </div>
      </div>
    </>
  )
}
