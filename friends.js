/**
 * friends.js — Base de datos de acceso para amigos
 * Esta página es privada. No indexar.
 */

const FRIENDS_DB = {
  gordinflas:   { password: 'lesbitasmaricon',         redirect: 'privado.html' },
  dabpito:      { password: 'me gustafollartrans',     redirect: 'privado.html' },
  churrita:     { password: 'mihermanitopequeño',      redirect: 'privado.html' },
  mujerdemivida:{ password: 'teamocariño',             redirect: 'privado.html' },
  lesbitas:     { password: 'uwupapurevamoscordoba',   redirect: 'privado.html' },
};

function initFriendsLogin() {
  const form     = document.getElementById('friends-form');
  const userInput = document.getElementById('friends-user');
  const passInput = document.getElementById('friends-pass');
  const errorEl  = document.getElementById('friends-error');
  const btn      = document.getElementById('friends-btn');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorEl.style.display = 'none';

    const user = userInput.value.trim().toLowerCase();
    const pass = passInput.value;

    if (!FRIENDS_DB[user]) {
      showError('Usuario no encontrado.');
      shake(userInput);
      return;
    }

    if (FRIENDS_DB[user].password !== pass) {
      showError('Contraseña incorrecta.');
      shake(passInput);
      passInput.value = '';
      return;
    }

    // Acceso correcto
    btn.textContent = 'Entrando...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      window.location.href = FRIENDS_DB[user].redirect;
    }, 600);
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function shake(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }
}

document.addEventListener('DOMContentLoaded', initFriendsLogin);
