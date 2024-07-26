const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: new Date().toISOString(),
    }
  });

  const Conversation = mongoose.model('Conversation', conversationSchema);

  module.exports = Conversation;
