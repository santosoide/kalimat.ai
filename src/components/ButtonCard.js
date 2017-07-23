import React from 'react';
import { Col, Alert, Panel, Image } from 'react-bootstrap';

export default (props) => {
  return (
    <div>
      {(props.user === 'bot' || props.user === props.uid || props.uid === props.to) &&
        <div
          className="row"
          style={{
            marginRight: '0px',
            marginLeft: '0px'
          }}>
          <div>
            <div>
              <div className="btn-group">
                <button type="button" className="btn btn-default">Yes</button>
                <button type="button" className="btn btn-default">No</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};
