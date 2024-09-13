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
  const [testCreate, setTestCreate] = useState([])

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
          userId: { userID, userName, userImage, messages: [] },
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
          console.log('查看2', result.otherNames.userID)
          const fromName = result.fromName
          setClientList(
            result.otherNames || []
            // fromName: result.fromName,
          )
          const userID = result.otherNames
          // console.log(result.otherNames.find((v)=>v.userID ===))
          const username = result.otherNames.userName
          // const addOrUpdateTestCreate = (userID, username) => {
          //   console.log('這行有跑嗎', username, userID)
          //   // 檢查 userID 是否存在於 testCreate 中
          //   const existingUser = testCreate.find((item) =>
          //     userID.find((user) => {
          //       user.userID === item.userID
          //     })
          //   )

          //   if (!existingUser) {
          //     // 如果 userID 不存在，新增條目
          //     const newTestCreate = [
          //       ...testCreate,
          //       { userID, username, messages: [] },
          //     ]
          //     console.log('先檢查再set', newTestCreate)
          //     setTestCreate(newTestCreate)
          //   }
          //   // 如果 userID 已存在，則不進行任何操作
          // }

          // // 使用示例
          // addOrUpdateTestCreate(userID, username)
          console.log('9988', testCreate)
          setGetName(result.otherNames === userName ? result.otherNames : null)
          // getuserName
          console.log('othernames', result.otherNames)
        }
        if (result.type === 'message') {
          if (result.fromID === userID || result.targetUserId === userID) {
            setTestCreate((prevMessages) => {
              const userMessages = prevMessages[result.fromID] || {
                userID: result.fromID,
                messages: [],
              }
              return {
                ...prevMessages,
                [result.fromID]: {
                  ...userMessages,
                  messages: [
                    ...userMessages.messages,
                    { fromName: result.fromName, text: result.message },
                  ],
                },
              }
            })
          }
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
    let params = {
      type: 'message',
      message,
      fromID: userID,
      fromName: userName,
    }
    if (targetUserId) {
      params.targetUserId = targetUserId
    }
    ws.send(JSON.stringify(params))
    setMessage('')

    if (targetUserId) {
      setTestCreate((prevMessages) => {
        const userMessages = prevMessages[targetUserId] || {
          userID: targetUserId,
          messages: [],
        }
        return {
          ...prevMessages,
          [targetUserId]: {
            ...userMessages,
            messages: [
              ...userMessages.messages,
              { fromName: userName, text: message },
            ],
          },
        }
      })
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
  const handleUserClick = (client, clientId) => {
    setTargetUserId((prevId) => (prevId === clientId ? null : clientId))
    // setTargetUserId(clientId)
    console.log('檢查點擊的會員', clientId)
    console.log('從這試試看', client)
    const addOrUpdateTestCreate = (userID, username) => {
      console.log('這行有跑嗎', username, userID)
      // 檢查 userID 是否存在於 testCreate 中
      const existingUser = testCreate.find((item) => item.userID === userID)

      if (!existingUser) {
        // 如果 userID 不存在，新增條目
        const newTestCreate = [
          ...testCreate,
          { userID, username, messages: [] },
        ]
        console.log('先檢查再set', newTestCreate)
        setTestCreate(newTestCreate)
      }
      // 如果 userID 已存在，則不進行任何操作
    }

    // 使用示例
    addOrUpdateTestCreate(client.userID, client.userName)
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
                onClick={() => handleUserClick(client, client.userID)}
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
            {targetUserId &&
              testCreate[targetUserId] &&
              testCreate[targetUserId].messages.map((msg, i) => (
                <div
                  key={i}
                  className={`d-flex ${
                    msg.fromName === userName
                      ? 'justify-content-end'
                      : 'align-items-center'
                  } mb-1 user-font`}
                >
                  {msg.fromName !== userName && (
                    <img
                      className="userimg"
                      src={`http://localhost:3005/avatar/${targetUserId}.png`}
                    />
                  )}
                  <span>{msg.text}</span>
                </div>
              ))}
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
