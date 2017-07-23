import React, { Component, PropsType } from 'react';
import { Col, Alert, Panel, Image } from 'react-bootstrap';

class ButtonCard extends Component {
  constructor(props) {
    super()
  }

  componentDidMount() {
    this._handleClickYes = this._handleClickYes.bind(this);
    this._handleClickNo = this._handleClickNo.bind(this);
  }

  _handleClickYes() {
    socket.emit('button click', { message: 'good', room: 'kalimat.ai', user: this.props.user, type: 'text', items: [] });
  }

  _handleClickNo() {
    socket.emit('button click', { message: 'no', room: 'kalimat.ai', user: this.props.user, type: 'text', items: [] });
  }

  render() {
    const { user, uid, to } = this.props;
    return (
      <div>
        {(user === 'bot' || user === uid || uid === to) &&
          <div
            className="row"
            style={{
              marginRight: '0px',
              marginLeft: '0px'
            }}>
            <div>
              <div>
                <div className="btn-group">
                  <button type="button" onClick={this._handleClickYes} className="btn btn-default">Yes</button>
                  <button type="button" onClick={this._handleClickNo} className="btn btn-default">No</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default ButtonCard;
