const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -6% 0px' });
reveals.forEach((el) => observer.observe(el));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (e) => {
  if (!glow) return;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
}, { passive: true });

const tilt = document.querySelector('[data-tilt]');
if (tilt && window.matchMedia('(pointer:fine)').matches) {
  tilt.addEventListener('pointermove', (e) => {
    const rect = tilt.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const shell = tilt.querySelector('.visual-shell');
    if (shell) shell.style.transform = `rotateY(${-3 + x * 3.2}deg) rotateX(${1 - y * 2.4}deg) translateY(${-y * 2}px)`;
  });
  tilt.addEventListener('pointerleave', () => {
    const shell = tilt.querySelector('.visual-shell');
    if (shell) shell.style.transform = 'rotateY(-3deg) rotateX(1deg)';
  });
}

for (const button of document.querySelectorAll('.magnetic')) {
  if (!window.matchMedia('(pointer:fine)').matches) break;
  button.addEventListener('pointermove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * .08}px, ${y * .12}px)`;
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
}
