import React from 'react'
import { Col, Alert, Panel, Image } from 'react-bootstrap'

export default (props) => {
  return (
    <div>
      {(props.user === 'bot' || props.user === props.uid || props.uid === props.to) &&
        <div
          className="row"
          style={{
            marginRight: '0px',
            marginLeft: '0px',
            border: '5px solid white',
            borderRightColor: 'transparent',
            borderTopColor: 'transparent',
            boxShadow: '1px 1px 2px rgba(black, 0.2)'
          }}>
          <div>
            <div
              style={{
                float: `${(props.user === props.uid) ? 'right' : 'left'}`,
                background: '#ededed',
                padding: '10px',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                maxWidth: '100%'
              }}>
              {props.message}
            </div>
          </div>
        </div>
      }
    </div>
  )
}
