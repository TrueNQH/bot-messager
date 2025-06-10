const socket = io();

socket.on('user-message', ({ senderId, message }) => {
  const div = document.getElementById('messages');
  div.innerHTML += `<p><strong>${senderId}:</strong> ${message}</p>`;
  document.getElementById('senderId').value = senderId;
});

function sendReply() {
  const senderId = document.getElementById('senderId').value;
  const message = document.getElementById('reply').value;
  socket.emit('admin-reply', { senderId, message });
  document.getElementById('reply').value = '';
}
