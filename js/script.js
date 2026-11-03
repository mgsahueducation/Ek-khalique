/* ============ Theme Toggle ============ */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeToggle) {
  themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
  });
}

/* ============ 3D Tilt — Stronger ============ */
const card = document.getElementById('tiltCard');

if (card) {
  const MAX_TILT = 18;               // ← stronger than before (was 6)
  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  let animating = false;
  let hovering = false;

  function animateTilt() {
    // Spring easing toward target
    currentRX += (targetRX - currentRX) * 0.12;
    currentRY += (targetRY - currentRY) * 0.12;

    // Apply via CSS custom properties
    card.style.setProperty('--rx', currentRX.toFixed(2) + 'deg');
    card.style.setProperty('--ry', currentRY.toFixed(2) + 'deg');

    // Dynamic shadow opposite to tilt
    const shadowX = -(currentRY * 1.6);
    const shadowY = (currentRX * 1.6) + 30;
    const blur = 60 + Math.abs(currentRX) * 2 + Math.abs(currentRY) * 2;
    const goldGlow = 40 + Math.abs(currentRX) * 2 + Math.abs(currentRY) * 2;

    card.style.boxShadow = `
      ${shadowX}px ${shadowY}px ${blur}px rgba(0,0,0,0.75),
      0 0 ${goldGlow}px rgba(212,175,55,${0.15 + Math.abs(currentRX) * 0.01}),
      inset 0 1px 0 rgba(255,255,255,0.08)
    `;

    // Continue animating if still different OR hovering
    if (Math.abs(targetRX - currentRX) > 0.05 ||
        Math.abs(targetRY - currentRY) > 0.05 ||
        hovering) {
      requestAnimationFrame(animateTilt);
    } else {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      animating = false;
    }
  }

  function startAnimation() {
    if (!animating) {
      animating = true;
      requestAnimationFrame(animateTilt);
    }
  }

  card.addEventListener('mouseenter', () => {
    hovering = true;
    card.classList.add('is-tilting');
    startAnimation();
  });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt toward cursor
    targetRX = ((y - centerY) / centerY) * -MAX_TILT;
    targetRY = ((x - centerX) / centerX) * MAX_TILT;

    // Cursor-following golden glow
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', pctX + '%');
    card.style.setProperty('--mouse-y', pctY + '%');

    startAnimation();
  });

  card.addEventListener('mouseleave', () => {
    hovering = false;
    card.classList.remove('is-tilting');
    targetRX = 0;
    targetRY = 0;
    startAnimation();
  });

  /* ============ Touch support (mobile) ============ */
  card.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRX = ((y - centerY) / centerY) * -MAX_TILT;
    targetRY = ((x - centerX) / centerX) * MAX_TILT;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', pctX + '%');
    card.style.setProperty('--mouse-y', pctY + '%');

    card.classList.add('is-tilting');
    hovering = true;
    startAnimation();
  }, { passive: true });

  card.addEventListener('touchend', () => {
    hovering = false;
    card.classList.remove('is-tilting');
    targetRX = 0;
    targetRY = 0;
    startAnimation();
  });
}
