/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
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

/* ── NAV ── */
const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ── PARTICLES ── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -Math.random() * 0.4 - 0.1;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.r = Math.random() * 1.5 + 0.5;
    this.life = 0; this.maxLife = Math.random() * 300 + 150;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    const progress = this.life / this.maxLife;
    const a = this.alpha * (progress < 0.1 ? progress * 10 : progress > 0.9 ? (1-progress)*10 : 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(168,85,247,${a})`;
    ctx.fill();
  }
}
for (let i = 0; i < 80; i++) { const p = new Particle(); p.life = Math.random() * p.maxLife; particles.push(p); }
function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168,85,247,${(1-dist/100)*0.08})`;
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

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  observer.observe(el);
});

/* ── HOUR BLOCKS ── */
const blocks = document.getElementById('hour-blocks');
if (blocks) {
  const activeHours = [18,19,20,21,22,23,0,1,14,15,16,17];
  const peakHours = [20,21,22];
  for (let h = 0; h < 24; h++) {
    const b = document.createElement('div');
    b.className = 'hour-block' + (peakHours.includes(h) ? ' peak' : activeHours.includes(h) ? ' on' : '');
    b.title = `${h}:00`;
    blocks.appendChild(b);
  }
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    this.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  });
}

/* ── SMOOTH SECTION GLOW on scroll ── */
function updateSectionGlow() {
  document.querySelectorAll('section').forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
      s.style.setProperty('--section-progress', Math.min(1, Math.max(0, 1 - Math.abs(rect.top) / window.innerHeight)));
    }
  });
}
window.addEventListener('scroll', updateSectionGlow, { passive: true });
