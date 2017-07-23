import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import TextCard from './TextCard';
import ButtonCard from './ButtonCard';

export default (props) => {
  return (
    <div>
      {props.messages && props.messages.map((message) => {
        if (!message.content) {
          message = { type: 'text', content: 'Selamat datang', user: 'bot' }
        }
        if (message.type === 'text') {
          return <TextCard uid={props.uid} user={message.user} message={message.content} />;
        } else if (message.type === 'template') {
          return <ButtonCard uid={props.uid} user={message.user} items={message.items} />;
        }
      })}
    </div>
  );
};
