const axios = require('axios');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

exports.handleWebhook = async (req, res, io) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const message = webhookEvent.message.text;

        // Gửi đến dashboard qua WebSocket
        io.emit('user-message', { senderId, message });
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};

// Gửi tin nhắn từ admin về Facebook Messenger
exports.sendMessageToUser = async (senderId, message) => {
  try {
    await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      recipient: { id: senderId },
      message: { text: message }
    });
  } catch (error) {
    console.error('Lỗi gửi tin nhắn:', error.response?.data || error.message);
  }
};
