import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as messageActions from '../../actions/messagesActions';
import * as roomActions from '../../actions/roomActions';
import * as userActions from '../../actions/userActions';
import { bindActionCreators } from 'redux';
import ChatList from '../ChatList';
import { Grid, Row, Glyphicon, InputGroup, PageHeader, Col, Button, FormGroup, FormControl } from 'react-bootstrap';

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.user = Math.round((Math.random() * 1000000));
    this.state = {
      input: '',
      hidebox: false,
      messages: props.messages,
      connected: false
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this._handleMessageEvent = this._handleMessageEvent.bind(this);
    this._init = this._init.bind(this);
    this.onUnload = this.onUnload.bind(this);
    this._scrollBottom = this._scrollBottom.bind(this);
    this._hideBox = this._hideBox.bind(this);
  }

  componentWillMount() {
    this._init();
  }

  componentDidMount() {
    this._handleMessageEvent();
    window.addEventListener('beforeunload', this.onUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  onUnload() {
    socket.emit('unsubscribe', { user: this.user });
  }

  handleOnChange(ev) {
    this.setState({ input: ev.target.value });
  }

  handleOnSubmit(ev) {
    ev.preventDefault();
    if (this.state.input) {
      this.setState({ hidebox: false });
      socket.emit('chat message', { message: this.state.input, room: this.props.room.title, user: this.user, type: 'text', items: [] });
      this._scrollBottom();
      this.setState({ input: '' });
    }
  }

  _handleMessageEvent() {
    socket.on('chat message', (inboundMessage) => {
      this.props.createMessage({ room: this.props.room, newMessage: { user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message, type: JSON.parse(inboundMessage).type, items: JSON.parse(inboundMessage).items } });
      console.log('received message', inboundMessage);
      this._scrollBottom();
      this.setState({ hidebox: false });
    });
  }

  _scrollBottom() {
    setTimeout(() => {
      const messages = document.getElementById('messages');
      messages.scrollTop = messages.scrollHeight;
    }, 200);
    this.setState({ hidebox: false });
  }

  _hideBox() {
    this._scrollBottom();
    this.setState({ hidebox: !this.state.hidebox });
    console.log('hidebox =>', this.state.hidebox);
  }

  _init() {
    console.log('init', this.props.user);
    if (!(this.state.connected)) {
      this.props.fetchRoom();
      socket.emit('subscribe', { room: this.props.room.title, user: this.user });
      this.setState({ connected: true, user: this.user });
    }
  }

  render() {
    console.log(this.props.messages);
    return (
      <div>
        <div className="container"
          style={{
            height: '400px',
            position: 'fixed',
            bottom: 0
          }}>
          <div className="row"
            style={{
              marginLeft: '0px',
              marginRight: '0px',
              bottom: 0,
              position: 'fixed',
              float: 'right'
            }}>
            <div className="col-lg-4 col-md-6 col-xs-12">
              <div className="panel panel-default" style={{
                borderRadius: '5px 5px 0 0'
              }}>
                {!this.state.hidebox &&
                  <div className="panel-heading">
                    <h3 className="panel-title">
                      <span style={{ cursor: 'hand' }} className="glyphicon glyphicon-minus pull-right" onClick={this._hideBox}></span>
                      Chat</h3>
                  </div>
                }
                {this.state.hidebox &&
                  <div className="panel-heading">
                    <h3 className="panel-title">
                      <span style={{ cursor: 'hand' }} className="glyphicon glyphicon-chevron-up pull-right" onClick={this._hideBox}></span>
                      Chat</h3>
                  </div>
                }
                {!this.state.hidebox &&
                  <div id="messages" className="panel-body" style={{
                    margin: '0',
                    padding: '0 10px 10px',
                    maxHeight: '300px',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                  }}>
                    {this.props.messages &&
                      <ChatList uid={this.user} messages={this.props.messages} ref={(ref) => this.ref} />
                    }
                  </div>
                }
                <div className="panel-footer">
                  <form>
                    <FormGroup>
                      <InputGroup>
                        <FormControl onChange={this.handleOnChange} value={this.state.input} />
                        <InputGroup.Button>
                          <Button bsStyle="primary" type="submit" onClick={this.handleOnSubmit}> Send </Button>
                        </InputGroup.Button>
                      </InputGroup>
                    </FormGroup>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    messages: state.activeRoom.messages,
    room: state.activeRoom,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createMessage: messageActions.saveMessage,
    fetchRoom: roomActions.fetchRoomData,
    newUser: (user) => {
      dispatch(userActions.newUser(user));
    }
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
