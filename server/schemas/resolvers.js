const { User, Conversation } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {

  Query: {

    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new AuthenticationError('You must be logged in');
    },

    getConversations: async (_, { senderId }) => {
      return Conversation.find({ sender: senderId })
    },

  },

  Mutation: {

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }
      throw new AuthenticationError('You must be logged in to update your profile');
    },

    removeUser: async (parent, args, context) => {
      if (context.user) {
        try {
          const removedUser = await User.findByIdAndDelete(context.user._id);
          return removedUser;
        } catch (error) {
          throw new Error('Failed to remove user.');
        }
      } else {
        throw new AuthenticationError('You must be logged in to remove a user.');
      }
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    sendMessage: async (_, { senderId,  message }) => {
      const newConversation = new Conversation({
        sender: senderId,
        //recipient: recipientId,
        message
      });
      return newConversation.save();
    },

    saveConversation: async (_, { messages }) => {
      const savedConversations = [];
      for (const msg of messages) {
        const newConversation = new Conversation({
          sender: msg.senderId,
          //recipient: msg.recipientId,
          message: msg.message,
          timestamp: new Date().toISOString()
        });
        savedConversations.push(await newConversation.save());
      }
      return savedConversations;
    },

  },
};

module.exports = resolvers;