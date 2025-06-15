const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const axios = require('axios')
const { handleWebhook } = require('./webhook');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBdbezVk-zC_KGs_d7vP5ZgSbuNGrxVYhXtZmLNZuA7Yoi9LmXxSCCB-RFdunKNNb_eg/exec';
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route dashboard
app.get('/', (req, res) => {
  res.render('dashboard'); // render views/dashboard.ejs
});
app.post('/save-to-sheet', async (req, res) => {
  try {
    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    res.json({ status: 'success', googleResponse: response.data });
  } catch (err) {
    console.error('Lỗi gửi tới Google Sheet:', err.message);
    res.status(500).json({ error: 'Ghi sheet thất bại' });
  }
});
app.get('/get-chat-history/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const response = await axios.get(`${GOOGLE_SCRIPT_URL}?sheet_id=${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ Google Sheet:', error.message);
    res.status(500).json({ error: 'Lỗi lấy dữ liệu từ Google Sheet' });
  }
});
app.get('/list-users', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL + "?function=listAllUsers"); // gửi GET đến Apps Script
    const users = await response.json(); // mảng các sheetName
    res.json(users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách user:', err.message);
    res.status(500).json({ error: 'Không thể lấy danh sách người dùng' });
  }
});
// Facebook Messenger Webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => handleWebhook(req, res, io));

initSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));
