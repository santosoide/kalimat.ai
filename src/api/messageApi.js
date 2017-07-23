import axios from 'axios'

class MessageApi {
  static newMessage(message) {
    let parsed = JSON.parse(message.newMessage.message)
    return axios.post('/messages', parsed)
  }

  static fetchRoom(user) {
    return axios.get(`/messages?user=${user}`)
  }

  static createRoom(roomData) {
    return axios.post('/rooms', roomData)
  }

  static fetchRoomList() {
    return axios.get('/rooms')
  }
}

export default MessageApi
