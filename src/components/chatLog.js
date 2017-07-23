import React from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import ChatDetail from './chatDetail'

export default (props) => {
  const messages = props.messages.map((message) => {
    console.log('replay from bot message =>', message);
    if (!message.content) {
      message = { content: 'Selamat datang', user: 'bot' }
    }

    return <ChatDetail uid={props.uid} user={message.user} message={message.content} />
  })

  return (
    <div>
      {messages}
    </div>
  )
}


