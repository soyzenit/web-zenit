/* privado.js — JS para la página privada de amigos */

/* ── CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

/* ── NAV SCROLL ── */
const nav = document.querySelector('.priv-nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.07 + 's';
  observer.observe(el);
});

/* ── GUESTBOOK ── */
const msgForm = document.getElementById('msg-form');
const msgList = document.getElementById('msg-list');
const msgSuccess = document.getElementById('msg-success');

// Demo messages already in HTML; new ones added dynamically
if (msgForm) {
  msgForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('msg-name').value.trim();
    const text = document.getElementById('msg-text').value.trim();
    if (!name || !text) return;

    const card = document.createElement('div');
    card.className = 'msg-card';
    card.innerHTML = `
      <div class="msg-who">${escapeHtml(name)}</div>
      <div class="msg-text">"${escapeHtml(text)}"</div>
    `;
    msgList.prepend(card);

    msgForm.reset();
    msgSuccess.style.display = 'block';
    setTimeout(() => { msgSuccess.style.display = 'none'; }, 3000);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
