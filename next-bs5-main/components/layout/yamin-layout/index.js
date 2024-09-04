// import MyNavbar from './my-navbar-nouse'
import MyFooter from './my-footer'
import MyHeader from './my-head'
import { useLoader } from '@/hooks/use-loader'
import styles from '@/components/layout/yamin-layout/yaminLayout.module.scss'

export default function YaminLayout({ children }) {
  const { loader } = useLoader()

  return (
    <>
      <MyHeader className="mt-5">
        <meta name="viewport" content="width=device-width" />
      </MyHeader>
      <main className={`${styles['yamin-main']} flex-shrink-0`}>
        <div className="container-fluid" style={{ maxWidth: 1440 }}>
          {children}
        </div>
        {/* 全域的載入動畫指示器 */}
        {loader()}
      </main>
      <MyFooter />
    </>
  )
}
