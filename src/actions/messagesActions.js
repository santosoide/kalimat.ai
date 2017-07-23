import messageApi from '../api/messageApi';

export function saveMessage(data) {
  let payload;

  console.log('payload =>', data);

  payload = {
    room: data.room,
    newMessage: {
      user: data.newMessage.user,
      content: data.newMessage.message,
      type: data.newMessage.type,
      items: data.newMessage.items
    }
  };

  return { type: 'NEW_MESSAGE', payload };
}

export function createMessage(data) {
  return (dispatch) => {
    return messageApi.newMessage(data).then((response) => {
      dispatch(saveMessage({ room: data.room, message: response.data, type: 'text', items: [] }));
      return response;
    });
  };
}
