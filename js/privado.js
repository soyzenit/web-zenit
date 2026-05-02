/* privado.js — JS para la página privada de amigos */

/* ══════════════════════════════════════════════════════════════
   MENSAJES PRIVADOS PERSONALIZADOS
   ── Edita aquí los mensajitos para cada amigo ──────────────────
   La clave (antes de los dos puntos) es el apodo tal cual lo
   escriban en el formulario — en minúsculas, sin espacios extra.
   ══════════════════════════════════════════════════════════════ */
const MENSAJES_PRIVADOS = {
  'gordinflas': 'Pon aquí tu mensajito para gordinflas. Puede ser tan largo como quieras.',
  'churrita': 'Pon aquí tu mensajito para churrita.',
  'lesbitas': 'Pon aquí tu mensajito para lesbitas.',
  // Para añadir más: 'apodo': 'mensaje', (sin olvidar la coma)
};

/* ── CURSOR ── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
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

/* ── PESTAÑAS DE MOMENTOS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Desactivar todo
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    // Activar el seleccionado
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ── CANCIONES — abrir/cerrar embed de Spotify ── */
document.querySelectorAll('.cancion-play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.cancion-card');
    const embedWrap = card.querySelector('.cancion-embed-wrap');
    const iframe = card.querySelector('.cancion-iframe');
    const isOpen = embedWrap.style.display !== 'none';

    if (isOpen) {
      // Cerrar — paramos el audio limpiando el src
      iframe.src = '';
      embedWrap.style.display = 'none';
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Escuchar`;
    } else {
      // Abrir — ponemos el src real desde el data-src de la card
      const src = card.dataset.src;
      if (src && !src.includes('TRACK_ID_AQUI')) {
        iframe.src = src;
      }
      embedWrap.style.display = 'block';
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pausar`;
    }
  });
});

/* ── GUESTBOOK con mensajito personalizado ── */
const msgForm = document.getElementById('msg-form');
const msgList = document.getElementById('msg-list');
const msgSuccess = document.getElementById('msg-success');
const nameInput = document.getElementById('msg-name');
const msgPersonal = document.getElementById('msg-personal');
const msgPersonalText = document.getElementById('msg-personal-text');

// Mostrar el mensajito cuando el amigo escribe su apodo
if (nameInput) {
  nameInput.addEventListener('input', () => {
    const apodo = nameInput.value.trim().toLowerCase();
    const mensaje = MENSAJES_PRIVADOS[apodo];

    if (mensaje) {
      msgPersonalText.textContent = mensaje;
      msgPersonal.style.display = 'block';
    } else {
      msgPersonal.style.display = 'none';
    }
  });
}

if (msgForm) {
  msgForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const text = document.getElementById('msg-text').value.trim();
    if (!name || !text) return;

    const card = document.createElement('div');
    card.className = 'msg-card';
    card.innerHTML = `
      <div class="msg-who">· ${escapeHtml(name)}</div>
      <div class="msg-text">"${escapeHtml(text)}"</div>
    `;
    msgList.prepend(card);

    msgForm.reset();
    msgPersonal.style.display = 'none';
    msgSuccess.style.display = 'block';
    setTimeout(() => { msgSuccess.style.display = 'none'; }, 3000);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}