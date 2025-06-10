const axios = require('axios');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const getUserInfo = async (senderId) => {
  const url = `https://graph.facebook.com/${senderId}?fields=first_name,last_name,profile_pic,locale,gender&access_token=${PAGE_ACCESS_TOKEN}`;
  const res = await axios.get(url);
  return res.data; // Trả về thông tin user
};

exports.handleWebhook = async (req, res, io) => {
  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const message = webhookEvent.message.text;

        const userInfo = await getUserInfo(senderId); // 👈 Lấy thông tin user

        // Gửi message và info qua socket
        io.emit('user-message', {
          senderId,
          message,
          userInfo, // gửi kèm
        });
      }
    }
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
