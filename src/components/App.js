import React from 'react'
import ChatContainer from './containers/ChatContainer'
import WelcomePage from './common/WelcomePage'
import { connect } from 'react-redux'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <ChatContainer />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { user: state.user }
}

export default connect(mapStateToProps)(App);