/* main.js — Index personal de Zenit
   cursor · partículas · reloj · bloques de hora · Lanyard */

/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

/* ══════════════════════════════════════════
   PARTÍCULAS (hero canvas)
══════════════════════════════════════════ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -Math.random() * 0.4 - 0.1;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.r = Math.random() * 1.5 + 0.5;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 150;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    const p = this.life / this.maxLife;
    const a = this.alpha * (p < 0.1 ? p * 10 : p > 0.9 ? (1 - p) * 10 : 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168,85,247,${a})`;
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < 90; i++) {
  const p = new Particle();
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // líneas entre partículas cercanas
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / 100) * 0.07})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animParticles);
}
animParticles();

/* ══════════════════════════════════════════
   RELOJ (hora española)
══════════════════════════════════════════ */
function updateClock() {
  const now = new Date();
  const opts = { timeZone: 'Europe/Madrid' };
  const time = now.toLocaleTimeString('es-ES', { ...opts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('es-ES', { ...opts, weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('clock-time').textContent = time;
  document.getElementById('clock-date').textContent = date;
}
updateClock();
setInterval(updateClock, 1000);

/* ══════════════════════════════════════════
   BLOQUES DE HORA
══════════════════════════════════════════ */
const blocksEl = document.getElementById('hour-blocks');
const activeHours = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1];
const peakHours = [20, 21, 22, 23];

for (let h = 0; h < 24; h++) {
  const b = document.createElement('div');
  b.className = 'hour-block'
    + (peakHours.includes(h) ? ' peak'
      : activeHours.includes(h) ? ' on'
        : '');
  b.title = `${String(h).padStart(2, '0')}:00`;
  blocksEl.appendChild(b);
}

/* ══════════════════════════════════════════
   LANYARD — Discord + Spotify en vivo
══════════════════════════════════════════ */
const DISCORD_USER_ID = '880156089818165258';

const statusEl = document.getElementById('lanyard-status');
const spotifyWrap = document.getElementById('spotify-wrap');
const spotifyTrack = document.getElementById('spotify-track');
const spotifyArtist = document.getElementById('spotify-artist');

// hero elements
const heroDot = document.getElementById('hero-dot');
const heroStatusText = document.getElementById('hero-status-text');

const STATUS_MAP = {
  online: { dot: 'status-online', label: 'en línea', heroClass: 'online', heroLabel: 'en línea en Discord' },
  idle: { dot: 'status-idle', label: 'ausente', heroClass: 'idle', heroLabel: 'ausente en Discord' },
  dnd: { dot: 'status-dnd', label: 'no molestar', heroClass: 'dnd', heroLabel: 'no molestar' },
  offline: { dot: 'status-offline', label: 'desconectada', heroClass: 'offline', heroLabel: 'desconectada' },
};

function renderStatus(data) {
  const s = STATUS_MAP[data.discord_status] || STATUS_MAP.offline;

  /* — hero eyebrow — */
  heroDot.className = 'hero-dot ' + s.heroClass;
  heroStatusText.textContent = s.heroLabel;

  /* — bento status card — */
  const activity = (data.activities || []).find(a => a.type !== 2 && a.name !== 'Spotify');
  const activityHTML = activity
    ? `<div class="status-activity">${esc(activity.name)}${activity.details ? ' · ' + esc(activity.details) : ''}</div>`
    : '';

  statusEl.innerHTML = `
    <div class="status-user">
      <div class="status-dot ${s.dot}"></div>
      <div class="status-user-info">
        <div class="status-username">${esc(data.discord_user?.username || 'zenit')}</div>
        <div class="status-state">${s.label}</div>
        ${activityHTML}
      </div>
    </div>
  `;

  /* — spotify strip — */
  if (data.spotify && data.listening_to_spotify) {
    spotifyTrack.textContent = data.spotify.song || '—';
    spotifyArtist.textContent = data.spotify.artist || '—';
    spotifyWrap.style.display = 'block';
  } else {
    spotifyWrap.style.display = 'none';
  }
}

function connectLanyardWS() {
  const ws = new WebSocket('wss://api.lanyard.rest/socket');
  let heartbeat;

  ws.onopen = () => {
    ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
  };

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.op === 1) {
      heartbeat = setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
    }
    if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
      renderStatus(msg.d);
    }
  };

  ws.onclose = () => {
    clearInterval(heartbeat);
    setTimeout(connectLanyardWS, 5000);
  };
}

connectLanyardWS();

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}