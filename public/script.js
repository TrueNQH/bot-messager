const socket = io();

socket.on('user-message', ({ senderId, message, userInfo }) => {
  if (!contacts[senderId]) {
    contacts[senderId] = { name: `${userInfo.first_name}`, avatar: userInfo.profile_pic, messages: [], info: userInfo };
    addContactToSidebar(senderId);
  }
  contacts[senderId].messages.push({ from: 'user', text: message });

  if (selectedUserId === senderId) {
    renderMessages(senderId);
    renderUserInfo(userInfo);
  }
});

function sendReply() {
  const senderId = document.getElementById('senderId').value;
  const message = document.getElementById('reply').value;
  socket.emit('admin-reply', { senderId, message });
  document.getElementById('reply').value = '';
}
function renderUserInfo(user) {
  const info = document.getElementById('user-info');
  info.innerHTML = `
    <img src="${user.profile_pic}" alt="avatar" class="img-thumbnail mb-2" width="80">
    <p><strong>Name:</strong> ${user.last_name} ${user.first_name} </p>
    <p><strong>Gender:</strong> ${user.gender}</p>
    <p><strong>Locale:</strong> ${user.locale}</p>
    <p> <a href="https://facebook.com/${senderId}"><strong>Fackbook profile</strong></a></p>
  `;
}
