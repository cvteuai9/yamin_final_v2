import React, { useEffect, useState, useRef } from 'react'
import Leftnav from '@/components/member/left-nav'
import { useAuth } from '@/hooks/my-use-auth'
import { useUserProfile } from '@/context/UserProfileContext'
import { isArray, startsWith } from 'lodash'
import { CLOSING } from 'ws'

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
  const [target, setTarget] = useState('')
  const [testCreate, setTestCreate] = useState([
    { userID: 0, userName: '', userImage: '', messages: [''] },
  ])
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
          const users = result.otherNames
          const username = result.otherNames.userName
          const existingUser = testCreate.find(
            (user) => user.userID === result.newUserID
          )
          console.log('12121', existingUser)
          if (!existingUser) {
            const newTestCreate = [
              ...testCreate,
              // existingUser,
              { userID: result.newUserID, messages: [] },
            ]
            setTestCreate(result.otherNames)
          }
          // const addOrUpdateTestCreate = (users) => {
          //   console.log('result.newUserID', result.newUserID)
          //   // 檢查 userID 是否存在於 testCreate 中
          //   const existingUser = testCreate.find(
          //     (user) => user.userID === result.newUserID
          //   )
          //   console.log('測試測試', existingUser)

          //   if (!existingUser) {
          //     console.log('0909', existingUser)
          //     // 如果 userID 不存在，新增條目
          //     const newTestCreate = [
          //       ...testCreate,
          //       // existingUser,
          //       { userID: result.newUserID, messages: [] },
          //     ]
          //     setTestCreate(newTestCreate)
          //     console.log('4545', newTestCreate)
          //   }
          //   // 如果 userID 已存在，則不進行任何操作
          // }

          // // 使用示例
          // addOrUpdateTestCreate(users)
          console.log('9988', testCreate)
          setGetName(result.otherNames === userName ? result.otherNames : null)
          // getuserName
          console.log('othernames', result.otherNames)
        }
        if (result.type === 'message') {
          console.log(
            '接收到的訊息',
            result,
            result.message,
            result.fromName,
            '分隔',
            result.private,
            '分隔2',
            testCreate
          )
          setTestCreate((prevMessages) => {
            return prevMessages.map((user) =>
              user.userID === result.fromID
                ? {
                    ...user,
                    messages: [...user.messages, result.message],
                  }
                : user
            )
          })
          const fromID = result.fromID === userID ? '我自己' : result.fromID
          const fromName = result.fromName === userName ? null : result.fromName
          const toFix = result.private
            ? "<span class='px-2'>對你悄悄說</span>"
            : "<span class='px-2'>說</span>"
          const icon = `<span class='badge bg-primary d-flex align-items-center'>${fromID}</span>`
          const msg = `<span class="chatBox">${result.message}</span>`

          // const newMessage = `<div class='d-flex align-items-center mb-1 user-font'><img class="userimg" src="http://localhost:3005/avatar/${fromID}.png"/>${fromName}:${msg}</div>`
          // const newMessage =
          //   result.fromName === userName
          //     ? `<div class='d-flex justify-content-end align-items-center mb-1 user-font'>${msg}</div>`
          //     : `<div class='d-flex align-items-center mb-1 user-font'><img class="userimg" src="http://localhost:3005/avatar/${fromID}.png"/>${fromName}${msg}</div>`
          // msgBoxRef.current.innerHTML += newMessage
          scrollToBottom()
          console.log('4444', result.fromID)
          console.log('4444', testCreate)

          return
        }
        if (result.type === 'disconnected') {
          setClientList(result.otherClients)
          if (result.disconnectedID) {
            // const disconnectMessage = `<div>${userID}已離開聊天室</div>`
            // msgBoxRef.current.innerHTML += disconnectMessage
          }
          return
        }
      })
      return () => {
        socket.close()
      }
    }
  }, [auth, userID, userName, userImage])
  useEffect(() => {}, [testGet, clientList, targetUserId])
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
      const selfMessage = 'self ' + message
      setTestCreate((prevMessages) => {
        return prevMessages.map((user) =>
          user.userID === targetUserId
            ? {
                ...user,
                messages: [...user.messages, selfMessage],
              }
            : user
        )
      })
    }
    ws.send(JSON.stringify(prarms))
    setMessage('')
    if (targetUserId) {
      console.log('這行到底幹嘛的')
      // let icon1 = `<span class="badge bg-primary d-flex align-itmes-center pt-1 me-1">我自己</span>`
      // let icon2 = `<span class="badge bg-primary d-flex align-itmes-center pt-1 ms-1">${targetUserId}</span>`
      // let toFix = `<span class="px-2">悄悄說</span>`
      // let msg = `<span">${message}</span>`
      // let newMessage = `<div class="d-flex justify-content-end align-itmes-center mb-1 user-font" >
      // <img src="" />
      // ${msg}
      // </div>`
      // msgBoxRef.current.innerHTML += newMessage
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
    // setTargetUserId(clientId)
    console.log('檢查點擊的會員', clientId)
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
          {testCreate.map((client) => {
            console.log('123', client.userID)
            return Number(client.userID) !== userID ? (
              <div
                ref={getuserName}
                key={client.userID} // 使用唯一的 client ID 作为 key
                className={`btn user ${
                  targetUserId === client.userID ? 'btn-danger' : ''
                }`}
                onClick={() => {
                  console.log('1212', testCreate)
                  handleUserClick(client.userID)
                }}
              >
                <img src={client.userImage} alt="" />
                <div className="user-info">
                  <p className="username mb-3">{client.userName}</p>
                  <p className="status">
                    {/* {client.messages[client.messages.length - 1].includes(
                      'self '
                    ) ? (
                      <div>123</div>
                    ) : (
                      <div>456</div>
                    )} */}
                    {/* {client.messages[client.messages.length - 1]} */}
                    {client &&
                    client.messages.length > 0 &&
                    client.messages[client.messages.length - 1] &&
                    client.messages[client.messages.length - 1].includes(
                      'self '
                    )
                      ? client.messages[client.messages.length - 1].replace(
                          'self ',
                          ' '
                        )
                      : client.messages[client.messages.length - 1]}
                  </p>
                </div>
              </div>
            ) : null
          })}

          {/* 其他用戶訊息可以複製上面的範例 */}
        </aside>
        <section className="chat-section">
          <header className="chat-header">
            <img src="/images/cart/logo橫向.png" alt="" className="tryBoxImg" />
          </header>
          <div className="message-box" ref={msgBoxRef}>
            {testCreate
              .filter((user) => user.userID === targetUserId)
              .map((targetUser, i) => (
                <div key={targetUser.userID}>
                  {targetUser.messages.map((v, i) => {
                    console.log('ttttt', testCreate)
                    console.log('輸入的內容', v)
                    const isUser = v.startsWith('self ')
                    {
                      /* const PutUserImg = `http://localhost:3005/avatar/${targetUser.userImages}.png` */
                    }
                    console.log('ttt123123t', isUser)
                    const testUser =
                      isUser === true ? (
                        <div className="d-flex h2 justify-content-end align-items-center mb-5 user-font">
                          <div className="chatBoxMe">
                            {v.replace('self ', ' ')}
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex h2 justify-content-start mb-3 user-font">
                          <img
                            className="ChatUserimg"
                            src={targetUser.userImage}
                          />
                          <div className="chatBox">{v}</div>
                        </div>
                      )
                    return testUser

                    {
                      /* return <h1 key={i}>{v}測試</h1> */
                    }
                  })}
                </div>
              ))}
          </div>
          {/* 聊天訊息會顯示在這裡 */}
          <div className="h3 chat-input">
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
