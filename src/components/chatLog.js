import React from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import ChatDetail from './chatDetail'
const styles = {
  msg_container_base: {
    ':-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
      'background-color': '#F5F5F5'
    },
    ':-webkit-scrollbar': {
      'width': '12px',
      'background-color': '#F5F5F5'
    },
    '-webkit-scrollbar-thumb': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,.3)',
      'background-color': '#555'
    }
  },
  chat_window: {
    'bottom': 0,
    'position': 'fixed',
    'float': 'right',
    'margin-left': '10px'
  }
};
export default (props) => {
  const messages = props.messages.map((message) => {
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


