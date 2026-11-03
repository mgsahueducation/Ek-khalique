/* ============ Theme Toggle ============ */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
});

/* ============ Image Upload (Part 1 only) ============ */
const fileInput = document.getElementById('fileInput');
const profilePic = document.getElementById('profilePic');
const placeholder = document.getElementById('placeholder');

if (fileInput && profilePic) {
  // Restore saved image from localStorage
  const savedImg = localStorage.getItem('profileImage');
  if (savedImg) {
    profilePic.src = savedImg;
    profilePic.classList.add('loaded');
    placeholder.style.display = 'none';
  }

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        profilePic.src = event.target.result;
        profilePic.classList.add('loaded');
        placeholder.style.display = 'none';
        try {
          localStorage.setItem('profileImage', event.target.result);
        } catch (err) { /* image too large */ }
      };
      reader.readAsDataURL(file);
    }
  });

  if (placeholder) {
    placeholder.addEventListener('click', () => fileInput.click());
  }
}

/* ============ 3D Tilt Effect ============ */
const card = document.getElementById('tiltCard');
if (card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
  });
}
