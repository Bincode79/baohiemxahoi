// ========== UTILITY ==========
function randomString(len) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var r = '';
  for (var i = 0; i < (len || 4); i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
}

function showToast(msg, type) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast-notification ' + (type || 'info');
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3000);
}

// ========== LOGIN MODAL ==========
function showLoginModal() {
  document.getElementById('loginModal').removeAttribute('hidden');
  document.getElementById('loginModal').setAttribute('aria-hidden', 'false');
  document.body.classList.add('lm-open');
}
function hideLoginModal() {
  document.getElementById('loginModal').setAttribute('hidden', '');
  document.getElementById('loginModal').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lm-open');
}
document.addEventListener('keydown', function(e) {
  var m = document.getElementById('loginModal');
  if (e.key === 'Escape' && !m.hasAttribute('hidden')) hideLoginModal();
});

function switchLoginTab(type, el) {
  document.querySelectorAll('.lm-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
}

// ========== LOGIN HANDLER ==========
function handleLogin(e) {
  e.preventDefault();
  var u = document.getElementById('loginUsername').value.trim();
  var p = document.getElementById('loginPassword').value.trim();
  if (!u || !p) { showToast('Vui lòng nhập tên đăng nhập và mật khẩu!', 'error'); return; }
  showToast('Đăng nhập thành công!', 'success');
  hideLoginModal();
}

function togglePwd() {
  var p = document.getElementById('loginPassword');
  p.type = p.type === 'password' ? 'text' : 'password';
}

// ========== CAPTCHA ==========
function refreshLoginCaptcha() {
  document.getElementById('loginCaptchaBox').textContent = randomString(4);
}

// ========== STATS ANIMATION ==========
function animateStats() {
  var received = 10585112;
  var processed = 10311515;
  var percent = 93.76;
  animateNumber('statReceived', received);
  animateNumber('statProcessed', processed);
  var pEl = document.getElementById('statPercent');
  if (pEl) {
    var current = 0;
    var step = percent / 40;
    var interval = setInterval(function() {
      current += step;
      if (current >= percent) { current = percent; clearInterval(interval); }
      pEl.textContent = current.toFixed(2) + '%';
    }, 30);
  }
}

function animateNumber(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var current = 0;
  var step = Math.ceil(target / 40);
  var interval = setInterval(function() {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = current.toLocaleString('vi-VN');
  }, 30);
}

// ========== PROVIDER DATA ==========
var ivanProviders = [
  { name: 'V1NBHXH', color: '#7bad0d' },
  { name: 'VNPT-CA', color: '#0372b6' },
  { name: 'ThaisonSoft', color: '#de8010' },
  { name: 'EFY', color: '#8b5cf6' },
  { name: 'TS24 Corp', color: '#7bad0d' },
  { name: 'Vietnam Post', color: '#0372b6' },
  { name: 'Viettel-CA', color: '#de8010' },
  { name: 'BkavCA', color: '#8b5cf6' },
  { name: 'MISA', color: '#7bad0d' },
  { name: 'CyberLotus', color: '#0372b6' },
  { name: 'IBH Insurance', color: '#de8010' },
  { name: 'iCare', color: '#8b5cf6' },
  { name: 'mBHXH', color: '#7bad0d' },
  { name: '1Office', color: '#0372b6' },
];

var caProviders = [
  { name: 'EasyCA', color: '#7bad0d' },
  { name: 'Newtel-CA', color: '#0372b6' },
  { name: 'BkavCA', color: '#de8010' },
  { name: 'Viettel-CA', color: '#8b5cf6' },
  { name: 'SafeCert Corp', color: '#7bad0d' },
  { name: 'FPT', color: '#0372b6' },
  { name: 'SmartSign', color: '#de8010' },
  { name: 'EFY-CA', color: '#8b5cf6' },
  { name: 'MISA', color: '#7bad0d' },
  { name: 'FastCA', color: '#0372b6' },
  { name: 'TrustCA', color: '#de8010' },
  { name: 'I-CA', color: '#8b5cf6' },
  { name: 'Hilo-CA', color: '#7bad0d' },
  { name: 'One-CA', color: '#0372b6' },
  { name: 'ECA', color: '#de8010' },
];

function renderProviders(containerId, providers) {
  var grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  providers.forEach(function(p) {
    var div = document.createElement('div');
    div.className = 'provider-item';
    div.title = p.name;
    var initials = p.name.substring(0, 2).toUpperCase();
    div.innerHTML =
      '<svg width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" fill="none"/><text x="60" y="24" text-anchor="middle" fill="' + p.color + '" font-size="13" font-weight="700" font-family="Inter,sans-serif">' + p.name + '</text></svg>';
    div.addEventListener('click', function() { showToast(p.name, 'info'); });
    grid.appendChild(div);
  });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
  renderProviders('ivanGrid', ivanProviders);
  renderProviders('caGrid', caProviders);
  animateStats();
  refreshLoginCaptcha();

  // data-open-login handler
  document.querySelectorAll('[data-open-login]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      showLoginModal();
    });
  });
  // backdrop + close button
  var modal = document.getElementById('loginModal');
  if (modal) {
    modal.querySelectorAll('[data-close-login]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        hideLoginModal();
      });
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.classList.contains('login-modal__backdrop')) {
        hideLoginModal();
      }
    });
  }
});
