import useFirebase from '@/hooks/use-firebase'
import { useAuth } from '@/hooks/use-auth'
import GoogleLogo from '@/components/icons/google-logo'

export default function Glogin() {
  const { loginGoogle } = useFirebase()
  const { auth, setAuth } = useAuth()

  // 處理google登入後，要向伺服器進行登入動作
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log(providerData)
  }

  return (
    <div>
      <p>會員狀態:{auth.isAuth ? '已登入' : '未登入'}</p>
      <button onClick={() => loginGoogle(callbackGoogleLoginPopup)}>
        <GoogleLogo /> Google登入
      </button>
    </div>
  )
}