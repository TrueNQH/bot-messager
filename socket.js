const { sendMessageToUser } = require('./webhook');
const { sendTypingIndicator } = require('./webhook');
exports.initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Admin dashboard đã kết nối');

    socket.on('admin-reply', async ({ senderId, message }) => {
      await sendMessageToUser(senderId, message);
    });

    socket.on('send-typing', async ({ senderId }) => {
      await sendTypingIndicator(senderId);
    });

    socket.on('disconnect', () => {
      console.log('Dashboard đã ngắt kết nối');
    });
  });
};
exports.initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Admin dashboard đã kết nối');

    socket.on('admin-reply', async ({ senderId, message }) => {
      await sendMessageToUser(senderId, message);
    });

    socket.on('disconnect', () => {
      console.log('Dashboard đã ngắt kết nối');
    });
  });
};
