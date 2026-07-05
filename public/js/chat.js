(function () {
  var userName = '';
  var userPhone = '';
  var userIdCard = '';

  function toggleChat() {
    var p = document.getElementById('chatPanel');
    var btn = document.getElementById('chatBtn');
    if (!p) return;
    var hidden = p.classList.toggle('hidden');
    btn.style.display = hidden ? '' : 'none';
    if (!hidden && p.querySelector('.chat-start-form')) {
      p.querySelector('.chat-start-form input')?.focus();
    }
  }

  function closeChat() {
    var p = document.getElementById('chatPanel');
    var btn = document.getElementById('chatBtn');
    if (p) p.classList.add('hidden');
    if (btn) btn.style.display = '';
  }

  function startChat() {
    userName = document.getElementById('chatName')?.value?.trim() || '';
    userPhone = document.getElementById('chatPhone')?.value?.trim() || '';
    userIdCard = document.getElementById('chatIdCard')?.value?.trim() || '';
    if (!userName || !userPhone || !userIdCard) {
      alert('Vui lòng nhập đầy đủ họ tên, số CCCD và số điện thoại');
      return;
    }
    document.getElementById('chatStartForm').style.display = 'none';
    document.getElementById('chatMessages').style.display = 'flex';
    document.getElementById('chatInputArea').style.display = 'flex';
    document.getElementById('chatInput').focus();
    addMessage('admin', 'Chào ' + userName + '! Bạn cần hỗ trợ gì ạ?');
  }

  function sendMessage() {
    var input = document.getElementById('chatInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage('user', text);

    var msg = {
      userName: userName,
      phone: userPhone,
      idCard: userIdCard,
      text: text,
    };

    fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          var msgs = data.conversation.messages;
          var last = msgs[msgs.length - 1];
          if (last.from === 'admin' && last.text !== text) {
            setTimeout(function () {
              addMessage('admin', last.text);
            }, 1500);
          }
        }
      });
  }

  function addMessage(from, text) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = 'chat-msg ' + from;
    var now = new Date();
    var time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    div.innerHTML = text + '<span class="time">' + time + '</span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('chatPanel')) return;

    document.getElementById('chatBtn')?.addEventListener('click', toggleChat);
    document.getElementById('chatClose')?.addEventListener('click', closeChat);
    document.getElementById('chatStartBtn')?.addEventListener('click', startChat);
    document.getElementById('chatSendBtn')?.addEventListener('click', sendMessage);
    document.getElementById('chatInput')?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  });
})();
