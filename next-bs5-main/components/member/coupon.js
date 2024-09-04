import React, { useState, useEffect } from 'react'
import Leftnav from './left-nav'
import { FaAngleDown } from 'react-icons/fa6'
import option from '@/components/article/option.module.sass'
import { Modal, Button } from 'react-bootstrap'
import { Gift } from 'lucide-react'
import Link from 'next/link'
// import e from 'express'

// 狀態映射對象
const statusMapping = {
  unused: '可使用',
  used: '已使用',
  expired: '已過期',
}

// ========== 修改: 移除獨立的 FloatingCouponImage 組件 ==========

export default function Coupon() {
  const [coupons, setCoupons] = useState([])
  const [annivCoupons, setAnnivCoupons] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [couponCode, setCouponCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredCoupons, setFilteredCoupons] = useState([])
  const [selectedLabel, setSelectedLabel] = useState('全部')
  const [unusedCouponCount, setUnusedCouponCount] = useState(0)
  const [showModal, setShowModal] = useState(false)

  // ========== 新增: 浮動優惠券相關狀態 ==========
  const [isOpen, setIsOpen] = useState(false)
  const [floatingCoupon, setFloatingCoupon] = useState(null)

  const handleShowModal = () => setShowModal(true)
  const handleCloseModal = () => {
    // setIsOpen(false);
    //  updateCouponsAfterClaim()
    setShowModal(false)
    setIsOpen(false)
    updateCouponsAfterClaim()
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleShowModal()
    }
  }

  // ========== 新增: 處理浮動優惠券點擊 ==========

  const handleAnnivCouponClick = async () => {
    // 領取全館優惠券
    await fetchAnnivCoupons()
    // 顯示全館優惠券資料
    setFloatingCoupon(
      // name: '',
      // code: '',
      // discount: '',
      annivCoupons.data
    )

    setIsOpen(true)
  }
  // ========新增: 處理浮動按鈕重新獲取所有優惠券 ==========

  const updateCouponsAfterClaim = () => {
    const newCoupons = [...coupons, ...annivCoupons]
    setCoupons(newCoupons)
    setFilteredCoupons(newCoupons)
    fetchCoupons() // 重新獲取所有優惠券
  }

  // ========== 新增: 處理浮動優惠券鍵盤事件 ==========
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleAnnivCouponClick()
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:3005/api/coupons`, {
        credentials: 'include', // 確保包含 cookies
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Fetched coupons:', data)
      setCoupons(data)
      setFilteredCoupons(data)
      //unused可使用張數
      const unusedCount = data.filter(
        (coupon) => coupon.user_status === 'unused'
      ).length
      setUnusedCouponCount(unusedCount)
    } catch (error) {
      console.error('獲取優惠券時出錯:', error)
      setError(error.message || '獲取優惠券時出錯')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnnivCoupons = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(
        `http://localhost:3005/api/coupons/claim-anniv-coupons`,
        {
          credentials: 'include', // 確保包含 cookies
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        switch (error) {
          case 'COUPON_NOT_FOUND':
            throw new Error('代碼不存在')
          case 'COUPON_ALREADY_CLAIMED':
            throw new Error('優惠券已領取')
          case 'COUPON_EXPIRED':
            throw new Error('優惠券已失效')
          case 'ERROR_INPUT':
            throw new Error('請重新輸入')
          default:
            throw new Error('未知的錯誤')
        }
      }

      const data = await response.json()

      console.log('Anniv coupons:', data.data)
      setFloatingCoupon(data.data)
      setAnnivCoupons(data.data)
      // setIsOpen(true)
    } catch (error) {
      console.error('獲取全館優惠券時出錯:', error)
      setAnnivCoupons('')
      setError(error.message || '獲取全館優惠券時出錯')
    } finally {
      setIsLoading(false)
    }
  }
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    const label =
      tab === 'all'
        ? '全部'
        : tab === 'unused'
        ? '可使用'
        : tab === 'used'
        ? '已使用'
        : tab === 'expired'
        ? '已過期'
        : ''
    setSelectedLabel(label)
    if (tab === 'all') {
      setFilteredCoupons(coupons)
    } else {
      const filtered = coupons.filter((coupon) => coupon.user_status === tab)
      setFilteredCoupons(filtered)
    }
  }

  const handleCouponSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 確保包含 cookies
        body: JSON.stringify({ couponCode }),
        // body: JSON.stringify({ isGlobalCoupon: true }), // 添加特殊參數  08-27添加
      })
      const data = await response.json()

      if (!response.ok) {
        switch (data.error) {
          case 'COUPON_NOT_FOUND':
            throw new Error('代碼不存在')
          case 'COUPON_ALREADY_CLAIMED':
            throw new Error('優惠券已領取')
          case 'COUPON_EXPIRED':
            throw new Error('優惠券已失效')
          case 'ERROR_INPUT':
            throw new Error('請重新輸入')
          default:
            throw new Error('未知的錯誤')
        }
      }
      fetchCoupons()
      setCouponCode('')
    } catch (error) {
      console.error('提交優惠券時出錯:', error)
      setError(error.message || '提交優惠券時出錯')
    }
  }

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
          <div className="row mt-4">
            <div className="col-md-4 profile-content-left">
              <Leftnav fromCupon="fromCupon" />
            </div>
            <div className="col-md-8 profile-content-right">
              <h3 className="goldenf">優惠券</h3>
              <p className="grayf">注意事項：</p>
              <p className="grayf">
                單筆訂單限使用一張，且已成立訂單不能以未使用優惠券為由取消訂單。
              </p>
              <p className="grayf">
                ＊優惠券詳細規範及抵用辦法，請參考「
                {/*  優惠券使用說明視窗 */}
                <span
                  className="goldenf"
                  onClick={handleShowModal}
                  onKeyPress={handleKeyPress}
                  role="button"
                  tabIndex={0}
                >
                  優惠券使用說明
                </span>
                」。
              </p>
              <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>優惠券使用說明</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <h5>優惠券使用說明:</h5> */}
                  <ul className="p2">
                    <li>每張優惠券只能使用一次。</li>
                    <li>優惠券不能與其他優惠同時使用。</li>
                    {/* <li>優惠券有效期為發放日起 30 天內。</li>
                  <li>優惠券僅適用於指定商品或商品類別。</li> */}
                    <li>使用優惠券的訂單金額需達到最低消費金額。</li>
                    <li>如有任何疑問,請聯繫客服。</li>
                  </ul>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                  <Button
                    variant="secondary"
                    onClick={() => handleCloseModal()}
                    className="p2"
                  >
                    了解
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* ... */}
              {/*  優惠券使用說明視窗 */}
              <p className="grayf"> 雅茗保留活動修改、變更及終止之權利。 </p>
              <div className="coupon-cinput">
                <p className="grayf m-0">優惠券歸戶</p>
                <input
                  className="coupon-inputtext p2 my-0"
                  type="text"
                  placeholder="活動序號或通關密語"
                  style={{ width: 250 }}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="btn2 p checked" onClick={handleCouponSubmit}>
                  確認
                </button>

                {isLoading && (
                  <p className="grayf ms-3 m-0 d-flex text-align-center">
                    加載中...
                  </p>
                )}
                {error && (
                  <p className="grayf ms-3 m-0 d-flex text-align-center">
                    錯誤: {error}
                  </p>
                )}
              </div>
              {unusedCouponCount > 0 && (
                <p className="goldenf">
                  目前有 {unusedCouponCount} 張優惠券可使用
                </p>
              )}
              {isLoading ? (
                <p>加載中...</p>
              ) : (
                <div className="tabchooes mt-3">
                  <table className="coupon-cptable mt-3">
                    <thead>
                      <tr className="p">
                        <th className="coupon-cpth p">優惠券項目</th>
                        <th className="coupon-cpth p">優惠券代碼</th>
                        <th className="coupon-cpth coupon-cpth1 p">內容</th>
                        <th className="coupon-cpth p">到期日</th>
                        <th className="coupon-cpth p">優惠券狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoupons.length > 0 ? (
                        filteredCoupons.map((coupon) => (
                          <tr
                            key={coupon.id}
                            style={{
                              transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                'rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                'transparent'
                            }}
                          >
                            <td
                              className="coupon-cptd p"
                              style={{ width: 116 }}
                            >
                              {coupon.name}
                            </td>
                            <td className="coupon-cptd p">{coupon.code}</td>
                            <td
                              className="coupon-p-14 p"
                              style={{ width: 300 }}
                            >
                              {coupon.info}
                            </td>
                            <td className="coupon-cptd p">
                              {new Date(coupon.end_time).toLocaleDateString()}
                            </td>
                            <td className="coupon-cptd p">
                              {statusMapping[coupon.user_status] ||
                                coupon.user_status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="">
                          <td
                            colSpan="5"
                            className="text-center p pt-3 goldenf"
                          >
                            {activeTab === 'all'
                              ? '沒有任何優惠券'
                              : `沒有${statusMapping[activeTab] || ''}優惠券`}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/*  優惠券下拉式選單 */}

                  <div
                    className="d-flex justify-content-end choosebtn text-nowrap align-items-center "
                    style={{ width: 150 }}
                  >
                    <div
                      className={`d-flex align-items-center justify-content-between ${option['articlechoose']}`}
                    >
                      <input type="checkbox" name="a1-1" id="a1-1" />
                      <label
                        htmlFor="a1-1"
                        className="d-flex flex-column p-0"
                        style={{ width: 150 }}
                      >
                        <p className="m-0 ps-3 align-items-center">
                          篩選 ：{selectedLabel}
                          <FaAngleDown className={`${option.icon} ms-3`} />
                        </p>

                        <ul className="p2 grayf" style={{ width: 150 }}>
                          {['all', ...Object.keys(statusMapping)].map((tab) => (
                            <li
                              key={tab}
                              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                              role="button"
                              tabIndex={0}
                              className="d-flex align-items-center justify-content-center p"
                              onClick={() => handleTabChange(tab)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleTabChange(tab)
                                }
                              }}
                              style={{
                                cursor: 'pointer',
                                fontWeight:
                                  activeTab === tab ? 'bold' : 'normal',
                              }}
                            >
                              {tab === 'all' ? '全部' : statusMapping[tab]}
                            </li>
                          ))}
                        </ul>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="coupon-btns">
                {/* <button className="btn2 p changepassword">開始購物</button> */}
                <Link
                  href="http://localhost:3000/product/list"
                  className={`btn2 p changepassword`}
                >
                  開始購物
                </Link>
              </div>
            </div>
          </div>
          {/*  優惠券領取視窗 */}
          {/* ========== 修改: 更新浮動優惠券按鈕和模態框 ========== */}
          <div className="floating-coupon-container ">
            <button
              className="floating-coupon-button p whitef bttn "
              onClick={handleAnnivCouponClick}
              onKeyDown={handleKeyDown}
              aria-label="週年優惠領取"
              disabled={isLoading}
            >
              <Gift size={26} color="white" className="mb-2" />

              {isLoading ? '處理中...' : '週年優惠領取'}
            </button>
            <Modal show={isOpen} onHide={handleCloseModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  {error ? '領取失敗' : '恭喜您獲得優惠券！'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="coupon-info">
                  {annivCoupons && annivCoupons.length > 0 ? (
                    <div>
                      <table>
                        <tbody>
                          {annivCoupons.map((coupon, index) => (
                            <tr key={index} className="p2">
                              {/* <td>優惠券名稱: {coupon.name}</td> */}
                              <td>優惠碼: {coupon.code}</td>
                              {/* <td>折扣: {coupon.discount}</td> */}
                              <td className="ps-3">
                                使用方式: {coupon.info}。
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <hr />
                      <p className="p2 d-flex justify-content-end">
                        成功嶺取，活動優惠券共{annivCoupons.length}張！
                      </p>
                    </div>
                  ) : (
                    <p>已領取過優惠券！</p>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer style={{ borderTop: 'none' }}>
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="p2"
                >
                  確定
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}
