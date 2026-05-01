/**
 * friends.js — Login via Supabase Auth
 * Las contraseñas NUNCA tocan el cliente.
 */

const SUPABASE_URL = 'https://favytgdyxhwkzhywscsp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdnl0Z2R5eGh3a3poeXdzY3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjI5NTksImV4cCI6MjA5MzIzODk1OX0.h-iBGUxU8oOIy9YlzQwx3y5WHAnbp2C-PXUt4w1Mk2w';

document.addEventListener('DOMContentLoaded', () => {
  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const form = document.getElementById('friends-form');
  const userInput = document.getElementById('friends-user');
  const passInput = document.getElementById('friends-pass');
  const errorEl = document.getElementById('friends-error');
  const btn = document.getElementById('friends-btn');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorEl.style.display = 'none';

    const email = userInput.value.trim();
    const password = passInput.value;

    if (!email || !password) {
      showError('Rellena todos los campos.');
      return;
    }

    btn.textContent = 'Verificando...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    const { data, error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
      showError('Credenciales incorrectas. Pídeselas a Zenit.');
      shake(passInput);
      passInput.value = '';
      btn.textContent = 'Entrar';
      btn.style.opacity = '1';
      btn.disabled = false;
      return;
    }

    btn.textContent = 'Entrando...';
    setTimeout(() => { window.location.href = 'privado.html'; }, 600);
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function shake(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }
});