import React, { useEffect, useState, useRef } from 'react'
import Leftnav from '@/components/member/left-nav'
import { useAuth } from '@/hooks/my-use-auth'
import { useUserProfile } from '@/context/UserProfileContext'
import { isArray } from 'lodash'

export default function Chat() {
  // webSocket開始
  const { userProfile, avatarVersion } = useUserProfile()
  console.log('我拿到了', userProfile.user_image)
  const [ws, setWs] = useState(null)
  const { auth } = useAuth()
  const [userID, setUserId] = useState(0)
  const [userName, setUserName] = useState('')
  const [getName, setGetName] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  //   const [userId] = useState(new Date().getTime().toString());
  const [message, setMessage] = useState('')
  const [clientList, setClientList] = useState([])
  const [targetUserId, setTargetUserId] = useState(null)
  const [testGet, setTestGet] = useState([])
  const [userImage, setUserImage] = useState('')
  const msgBoxRef = useRef(null)
  const getuserName = useRef(null)
  // const socket = new WebSocket('ws://localhost:8080')
  // setWs(socket)
  //   let  clientList

  useEffect(() => {
    setUserId(auth.userData.id)
    setUserName(auth.userData.user_name)
    setUserImage(`http://localhost:3005/avatar/${auth.userData.id}.png`)
    setIsAuth(auth.isAuth)
    if (userID) {
      const socket = new WebSocket('ws://localhost:8080')
      setWs(socket)

      socket.addEventListener('open', () => {
        console.log('Connected to the WebSocket')
        const params = {
          type: 'register',
          userId: { userID, userName, userImage },
          userName: userName,
        }
        socket.send(JSON.stringify(params))
      })

      socket.addEventListener('message', (event) => {
        const result = JSON.parse(event.data)
        console.log('gogo', result)
        if (result.userId && result.userId.userID) {
          console.log('馬上看', result.userId.userID)
        }
        if (result.type === 'registered') {
          const boom = result.otherClients[0]
          console.log('查看', result.otherNames)
          const fromName = result.fromName
          setClientList(
            result.otherNames || []
            // fromName: result.fromName,
          )
          setGetName(result.otherNames === userName ? result.otherNames : null)
          // getuserName
          console.log('othernames', result.otherNames)
          // const newMessagee = result.otherNames.map((client) => {
          //   return (
          //     <div
          //       ref={getuserName}
          //       key={client} // 使用唯一的 client ID 作为 key
          //       className={`btn user ${
          //         targetUserId === client ? 'btn-danger' : ''
          //       }`}
          //       onClick={() => handleUserClick(client)}
          //     >
          //       <img src="cat.png" alt="貓貓" />
          //       <div className="user-info">
          //         <p className="username">{client.fromName}</p>
          //         <p className="status">{client}</p>
          //       </div>
          //       <span className="time">12:57</span>
          //     </div>
          //   )
          // })
          // console.log('2224', clientList.clientLlist)
          // setTestGet(newMessagee)
          // // getuserName.current.innerHTML += newMessagee
          // console.log('1234', testGet)
          // // console.log('123', testGet)
          // return
        }
        if (result.type === 'message') {
          console.log('接收到的訊息', result, result.message, result.fromName)
          const fromID = result.fromID === userID ? '我自己' : result.fromID
          const fromName = result.fromName === userName ? null : result.fromName
          const toFix = result.private
            ? "<span class='px-2'>對你悄悄說</span>"
            : "<span class='px-2'>說</span>"
          const icon = `<span class='badge bg-primary d-flex align-items-center'>${fromID}</span>`
          const msg = `<span class="chatBox">${result.message}</span>`

          // const newMessage = `<div class='d-flex align-items-center mb-1 user-font'><img class="userimg" src="http://localhost:3005/avatar/${fromID}.png"/>${fromName}:${msg}</div>`
          const newMessage =
            result.fromName === userName
              ? `<div class='d-flex justify-content-end align-items-center mb-1 user-font'>${msg}</div>`
              : `<div class='d-flex align-items-center mb-1 user-font'><img class="userimg" src="http://localhost:3005/avatar/${fromID}.png"/>${fromName}${msg}</div>`
          msgBoxRef.current.innerHTML += newMessage
          scrollToBottom()

          return
        }
        if (result.type === 'disconnected') {
          setClientList(result.otherClients)
          if (result.disconnectedID) {
            const disconnectMessage = `<div>${userID}已離開聊天室</div>`
            msgBoxRef.current.innerHTML += disconnectMessage
          }
          return
        }
      })
      return () => {
        socket.close()
      }
    }
  }, [auth, userID, userName, userImage])
  useEffect(() => {}, [testGet, clientList])
  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  const sendMessage = () => {
    // var message = msgInput.value
    let prarms = {
      type: 'message',
      message,
      fromID: userID,
      fromName: userName,
    }
    if (targetUserId) {
      prarms.targetUserId = targetUserId
    }
    ws.send(JSON.stringify(prarms))
    setMessage('')
    if (targetUserId) {
      console.log('這行到底幹嘛的')
      let icon1 = `<span class="badge bg-primary d-flex align-itmes-center pt-1 me-1">我自己</span>`
      let icon2 = `<span class="badge bg-primary d-flex align-itmes-center pt-1 ms-1">${targetUserId}</span>`
      let toFix = `<span class="px-2">悄悄說</span>`
      let msg = `<span">${message}</span>`
      let newMessage = `<div class="d-flex justify-content-end align-itmes-center mb-1 user-font" >
      <img src="" />
      ${msg}
      </div>`
      msgBoxRef.current.innerHTML += newMessage
    }
  }

  // function setClientList() {
  //   console.log('查看遺下', clientList)
  //   clientDOM = ''
  //   clientList.forEach((client) => {
  //     if (client !== userId) {
  //       // let dom =`<div class="user-info>
  //       // <p class="username">${client}</p>
  //       // <p class="status">今天有優惠</p>
  //       // </div>`;
  //       let dom = `
  //           <div idn="${client}" class=" btn user">
  //               <img src="cat.png" alt="貓貓">
  //               <div class="user-info">
  //                   <p class="username">${client}</p>
  //                   <p class="status">${client}</p>
  //               </div>
  //               <span class="time">12:57</span>
  //           </div>`
  //       clientDOM += dom
  //     }
  //   })
  //   userInput.innerHTML = clientDOM

  //   let users = userInput.querySelectorAll('.user')
  //   users.forEach((user) => {
  //     user.addEventListener('click', (e) => {
  //       let target = e.currentTarget
  //       let idn = e.currentTarget.getAttribute('idn')
  //       if (targetUserId && targetUserId !== idn) {
  //         return false
  //       }
  //       if (target.classList.contains('btn-danger')) {
  //         target.classList.remove('btn-danger')
  //         targetUserId = undefined
  //       } else {
  //         target.classList.add('btn-danger')
  //         targetUserId = idn
  //       }
  //     })
  //   })
  // }
  const handleUserClick = (clientId) => {
    setTargetUserId((prevId) => (prevId === clientId ? null : clientId))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }
  const scrollToBottom = () => {
    msgBoxRef.current.scrollTop =
      msgBoxRef.current.scrollHeight - msgBoxRef.current.clientHeight
  }
  // websocket結束
  return (
    <>
      <div className="chat-container">
        <aside className="user-list">
          {/* <div className="user">
            <img src="cat.png" alt="貓貓" />
            <div className="user-info">
              <p className="username">貓貓</p>
              <p className="status">今天有優惠</p>
            </div>
            <span className="time">12:57</span>
          </div> */}
          {/* {('現在需要的', console.log(clientList.clientLlist.userId))} */}
          {/* {testGet} */}
          {console.log(clientList)}
          {clientList.map((client) => {
            console.log('123', client.userID)
            return Number(client.userID) !== userID ? (
              <div
                ref={getuserName}
                key={client.userID} // 使用唯一的 client ID 作为 key
                className={`btn user ${
                  targetUserId === client.userID ? 'btn-danger' : ''
                }`}
                onClick={() => handleUserClick(client.userID)}
              >
                <img src={client.userImage} alt="" />
                <div className="user-info">
                  <p className="username">{client.userName}</p>
                  <p className="status">{client.userID}</p>
                </div>
                <span className="time">12:57</span>
              </div>
            ) : null
          })}

          {/* 其他用戶訊息可以複製上面的範例 */}
        </aside>
        <section className="chat-section">
          <header className="chat-header">
            <img src="/images/cart/logo橫向.png" alt="" className="tryBoxImg" />
          </header>
          <div ref={msgBoxRef} className="message-box">
            {/* 聊天訊息會顯示在這裡 */}
          </div>
          <div className="chat-input">
            <input
              type="text"
              name="msg"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button className="btnSend" onClick={sendMessage}>
              發送
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
