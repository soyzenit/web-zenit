/* main.js — Bento index: cursor, clock, Lanyard */

/* ── CURSOR ── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

/* ── CLOCK (hora española) ── */
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

/* ── LANYARD — Discord + Spotify live status ── */
const DISCORD_USER_ID = '880156089818165258';

const statusEl = document.getElementById('lanyard-status');
const spotifyWrap = document.getElementById('spotify-wrap');
const spotifyTrack = document.getElementById('spotify-track');
const spotifyArtist = document.getElementById('spotify-artist');

function renderStatus(data) {
  const statusMap = {
    online: { dot: 'status-online', label: 'en línea' },
    idle: { dot: 'status-idle', label: 'ausente' },
    dnd: { dot: 'status-dnd', label: 'no molestar' },
    offline: { dot: 'status-offline', label: 'desconectada' },
  };
  const s = statusMap[data.discord_status] || statusMap.offline;

  const activity = (data.activities || []).find(a => a.type !== 2 && a.name !== 'Spotify');
  const activityHTML = activity
    ? `<div class="status-activity">${escHtml(activity.name)}${activity.details ? ' · ' + escHtml(activity.details) : ''}</div>`
    : '';

  statusEl.innerHTML = `
    <div class="status-user">
      <div class="status-dot ${s.dot}"></div>
      <div class="status-user-info">
        <div class="status-username">${escHtml(data.discord_user?.username || 'zenit')}</div>
        <div class="status-state">${s.label}</div>
        ${activityHTML}
      </div>
    </div>
  `;

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
  ws.onclose = () => { clearInterval(heartbeat); setTimeout(connectLanyardWS, 5000); };
}

connectLanyardWS();

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}