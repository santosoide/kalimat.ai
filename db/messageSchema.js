import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  user: String,
  type: String,
  items: {
    item: String,
    text: String
  },
  content: String,
  room: String
});

export default mongoose.model('Message', messageSchema);
