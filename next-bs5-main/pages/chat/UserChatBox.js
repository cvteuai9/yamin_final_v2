import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/my-use-auth'
import { useUserProfile } from '@/context/UserProfileContext'
export default function UserChatBox() {
  const { userProfile, avatarVersion } = useUserProfile()
  console.log('我拿到了', userProfile.user_image)
  const [ws, setWs] = useState(null)
  const { auth } = useAuth()
  const UserChatBox = useRef(null)
  const [isAuth, setIsAuth] = useState(false)
  const [userID, setUserId] = useState(0)
  const [userName, setUserName] = useState('')
  const [message, setMessage] = useState('')
  const [targetUserId, setTargetUserId] = useState(null)
  const [userImage, setUserImage] = useState('')
  const [testCreate, setTestCreate] = useState([
    { userID: 0, userName: '', userImage: '', messages: [''] },
  ])
  const msgBoxRef = useRef(null)
  const CheckUserBox = useRef(null)
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

          // // 使用示例
          // addOrUpdateTestCreate(users)
          console.log('9988', testCreate)

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

          console.log('4444', result.fromID)
          console.log('4444', testCreate)

          return
        }
        if (result.type === 'disconnected') {
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
  const sendMessage = () => {
    const targetUserId = 62
    // var message = msgInput.value
    let prarms = {
      type: 'message',
      message,
      fromID: userID,
      fromName: userName,
    }
    if (targetUserId === 62) {
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
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }
  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  const OpenClose = () => {
    console.log(CheckUserBox)
    UserChatBox.current.classList.toggle('d-none')
  }
  return userID !== 62 ? (
    <div>
      <div
        ref={CheckUserBox}
        className="liaoChatBoxModal "
        onClick={() => {
          OpenClose()
        }}
      >
        <i class="fa-regular fa-comment liaoChatBoxModalImg"></i>
      </div>
      <div className="liao-chat-container" ref={UserChatBox}>
        <div className="liao-chat-ChatBoxHeader">
          <img src="/images/cart/logo橫向.png" alt="" class="tryBoxImg" />
        </div>
        <div className="liao-chat-box" ref={msgBoxRef}>
          {testCreate
            .filter((user) => user.userID === 62)
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
                      <div className="d-flex h4 justify-content-end align-items-center mb-5 user-font">
                        <div className="OneChatBox">
                          {v.replace('self ', ' ')}
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex h4 justify-content-start mb-3 user-font">
                        <img
                          className="ChatOneUserimg"
                          src={targetUser.userImage}
                        />
                        <div className="OneChatBox">{v}</div>
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
        <div className="liao-chat-input-area " id="liao-chat-form">
          <input
            className="h4 liao-chat-input"
            type="text"
            id="liao-chat-input"
            placeholder="輸入您的訊息..."
            name="msg"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ margin: '0px' }}
          />
          <button
            className="h4 liao-chat-button"
            onClick={sendMessage}
            style={{ marginBottom: '0px' }}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  ) : null
}
