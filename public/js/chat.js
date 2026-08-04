(function () {
  var userName = '';
  var userPhone = '';
  var lastMsgId = 0;
  var pollTimer = null;
  var isMobile = function () { return window.matchMedia('(max-width: 480px)').matches; };

  function el(id) { return document.getElementById(id); }

  function toggleChat() {
    var p = el('chatPanel');
    var btn = el('chatBtn');
    if (!p) return;
    var hidden = p.classList.toggle('hidden');
    btn.style.display = hidden ? '' : 'none';
    if (!hidden) {
      var startInput = p.querySelector('.chat-start-form input');
      if (startInput && el('chatStartForm').style.display !== 'none') {
        setTimeout(function () { startInput.focus(); }, 300);
      }
      var msgs = el('chatMessages');
      if (msgs && msgs.style.display !== 'none') msgs.scrollTop = msgs.scrollHeight;
      if (isMobile()) { document.body.style.overflow = 'hidden'; setupViewportHandling(); }
    } else {
      document.body.style.overflow = '';
      teardownViewportHandling();
    }
  }

  function closeChat() {
    var p = el('chatPanel');
    var btn = el('chatBtn');
    if (p) p.classList.add('hidden');
    if (btn) btn.style.display = '';
    document.body.style.overflow = '';
    teardownViewportHandling();
    stopPolling();
  }

  var viewportHandler = null;
  function setupViewportHandling() {
    if (!window.visualViewport || viewportHandler) return;
    viewportHandler = function () {
      var vv = window.visualViewport;
      var panel = el('chatPanel');
      if (!panel) return;
      var offsetTop = panel.getBoundingClientRect().top;
      var newHeight = Math.max(280, vv.height - offsetTop);
      panel.style.height = newHeight + 'px';
      var msgs = el('chatMessages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    };
    window.visualViewport.addEventListener('resize', viewportHandler);
    window.visualViewport.addEventListener('scroll', viewportHandler);
  }
  function teardownViewportHandling() {
    if (window.visualViewport && viewportHandler) {
      window.visualViewport.removeEventListener('resize', viewportHandler);
      window.visualViewport.removeEventListener('scroll', viewportHandler);
      viewportHandler = null;
    }
    var panel = el('chatPanel');
    if (panel) panel.style.height = '';
  }

  function startChat() {
    userName = el('chatName').value.trim() || '';
    userPhone = el('chatPhone').value.trim() || '';
    if (!userName || !userPhone) {
      alert('Vui lòng nhập họ tên và số điện thoại');
      return;
    }
    el('chatStartForm').style.display = 'none';
    el('chatMessages').style.display = 'flex';
    el('chatInputArea').style.display = 'flex';
    var msgs = el('chatMessages');
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function () { el('chatInput').focus(); }, 300);
    showTyping(function () {
      addMessage('admin', 'Chào ' + userName + '! Bạn cần hỗ trợ gì ạ?');
    });
    lastMsgId = 0;
    startPolling();
  }

  // Hiển thị chỉ báo "đang nhập..." trong 1s rồi gọi cb
  function showTyping(cb) {
    var container = el('chatMessages');
    if (!container) { if (cb) cb(); return; }
    var t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(t);
    container.scrollTop = container.scrollHeight;
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
      if (cb) cb();
      var c = el('chatMessages');
      if (c) c.scrollTop = c.scrollHeight;
    }, 1000);
  }

  function renderContent(msg) {
    if (msg.type === 'image') {
      var img = document.createElement('img');
      img.className = 'chat-media';
      img.src = msg.fileUrl;
      img.alt = msg.fileName || 'image';
      return img;
    }
    if (msg.type === 'video') {
      var video = document.createElement('video');
      video.className = 'chat-media';
      video.src = msg.fileUrl;
      video.controls = true;
      return video;
    }
    if (msg.type === 'file') {
      var a = document.createElement('a');
      a.className = 'chat-file';
      a.href = msg.fileUrl;
      a.target = '_blank';
      a.download = msg.fileName || '';
      a.innerHTML = '<i class="bi bi-paperclip"></i> ' + (msg.fileName || 'Tệp đính kèm');
      return a;
    }
    var span = document.createElement('span');
    span.textContent = msg.text || '';
    return span;
  }

  function addMessage(from, msg) {
    var container = el('chatMessages');
    if (!container) return;
    if (typeof msg === 'string') msg = { text: msg, type: 'text' };
    var div = document.createElement('div');
    div.className = 'chat-msg ' + from;
    var content = renderContent(msg);
    if (content) div.appendChild(content);
    var now = new Date();
    var time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    var t = document.createElement('span');
    t.className = 'time';
    t.textContent = time;
    div.appendChild(t);
    container.appendChild(div);
    requestAnimationFrame(function () {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }

  function loadConversation() {
    fetch('/api/chat/conversation')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.conversation) return;
        var msgs = data.conversation.messages || [];
        for (var i = 0; i < msgs.length; i++) {
          var m = msgs[i];
          if (m.id > lastMsgId) {
            addMessage(m.from, m);
            lastMsgId = m.id;
          }
        }
      })
      .catch(function () {});
  }

  function startPolling() {
    stopPolling();
    loadConversation();
    pollTimer = setInterval(loadConversation, 4000);
  }

  function stopPolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  function sendMessage() {
    var input = el('chatInput');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage('user', { text: text, type: 'text' });
    keepInputVisible();

    fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: userName, phone: userPhone, text: text }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          var msgs = data.conversation.messages || [];
          for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].id > lastMsgId) lastMsgId = msgs[i].id;
          }
        }
      })
      .catch(function () {});
  }

  function sendFile(file) {
    if (!file) return;
    var fd = new FormData();
    fd.append('userName', userName);
    fd.append('phone', userPhone);
    fd.append('file', file);
    addMessage('user', { type: guessType(file), fileUrl: URL.createObjectURL(file), fileName: file.name });
    keepInputVisible();

    fetch('/api/chat/upload', { method: 'POST', body: fd })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          var msgs = data.conversation.messages || [];
          for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].id > lastMsgId) lastMsgId = msgs[i].id;
          }
        } else {
          alert(data.error || 'Gửi tệp thất bại');
        }
      })
      .catch(function () { alert('Lỗi gửi tệp'); });
  }

  function guessType(file) {
    if (file.type.indexOf('image/') === 0) return 'image';
    if (file.type.indexOf('video/') === 0) return 'video';
    return 'file';
  }

  function keepInputVisible() {
    if (!isMobile()) return;
    setTimeout(function () {
      var area = el('chatInputArea');
      if (area) area.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, 300);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('chatPanel')) return;
    el('chatBtn').addEventListener('click', toggleChat);
    el('chatClose').addEventListener('click', closeChat);
    el('chatStartBtn').addEventListener('click', startChat);
    el('chatSendBtn').addEventListener('click', sendMessage);
    el('chatInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMessage(); });
    el('chatInput').addEventListener('focus', keepInputVisible);
    var attachBtn = el('chatAttachBtn');
    var chatFile = el('chatFile');
    if (attachBtn && chatFile) {
      attachBtn.addEventListener('click', function () { chatFile.click(); });
      chatFile.addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        if (f) sendFile(f);
        e.target.value = '';
      });
    }
    window.addEventListener('resize', function () {
      if (isMobile() && el('chatPanel') && !el('chatPanel').classList.contains('hidden')) {
        el('chatPanel').style.height = '';
        var msgs = el('chatMessages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }
    });
  });
})();
