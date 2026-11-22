const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 601px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Ein zweiter, identischer Durchlauf ermöglicht ein nahtloses Laufband.
// Die Kopie bleibt für Tastatur und Screenreader ausgeblendet.
const news = document.querySelector('.news');
const track = document.querySelector('.news-track');
const copy = document.querySelector('.news-group').cloneNode(true);
copy.setAttribute('aria-hidden', 'true');
copy.querySelectorAll('button').forEach(button => button.tabIndex = -1);
track.append(copy);
const pauseButton = document.querySelector('.news-toggle');
pauseButton.addEventListener('click', () => {
  const paused = news.classList.toggle('is-paused');
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.setAttribute('aria-label', paused ? 'News-Laufband fortsetzen' : 'News-Laufband pausieren');
  pauseButton.querySelector('.pause-label').textContent = paused ? 'WEITER' : 'PAUSE';
  pauseButton.querySelector('.pause-icon').textContent = paused ? '▷' : 'Ⅱ';
});

const dialog = document.querySelector('.preview-dialog');
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-preview]');
  if (!trigger) return;
  document.querySelector('#dialog-title').textContent = trigger.dataset.preview;
  dialog.showModal();
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.dialog-back').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
