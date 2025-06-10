const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { handleWebhook } = require('./webhook');
const { initSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route dashboard
app.get('/', (req, res) => {
  res.render('dashboard'); // render views/dashboard.ejs
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
