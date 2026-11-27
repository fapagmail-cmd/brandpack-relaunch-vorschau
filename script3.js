/* Interaktionen für den Meeting-Entwurf. Kein automatischer Sprachwechsel. */
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
window.matchMedia('(min-width: 601px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    if (document.activeElement?.closest('.main-nav')) menuButton.focus();
  }
});

// Die Auswahl gilt nur für den jeweiligen Absatz und benötigt keinen Online-Dienst.
document.querySelectorAll('.translatable').forEach((block, index) => {
  const content = block.querySelector('.translation-content');
  const button = block.querySelector('.language-toggle');
  content.id = `translation-${index}`;
  button.setAttribute('aria-controls', content.id);
  button.hidden = false;
  button.addEventListener('click', () => {
    const english = block.classList.toggle('is-english');
    content.querySelector('[lang="de"]').hidden = english;
    content.querySelector('[lang="en"]').hidden = !english;
    button.textContent = english ? 'DE' : 'EN';
    const label = english ? 'Diesen Text auf Deutsch anzeigen' : 'Diesen Text auf Englisch anzeigen';
    button.setAttribute('aria-label', label);
    button.title = english ? 'Auf Deutsch anzeigen' : 'Auf Englisch anzeigen';
  });
});

// Rollover, Tastaturfokus und Antippen öffnen dieselbe kurze Unterzeile.
document.querySelectorAll('.discipline').forEach(row => {
  const button = row.querySelector('.discipline-trigger');
  const copy = row.querySelector('.discipline-copy');
  const navigates = button.matches('a');
  let pinned = false;
  let hovered = false;
  function render() {
    const open = pinned || hovered || row.contains(document.activeElement);
    row.classList.toggle('is-open', open);
    if (!navigates) button.setAttribute('aria-expanded', String(open));
    copy.inert = !open;
    copy.setAttribute('aria-hidden', String(!open));
  }
  if (!navigates) button.addEventListener('click', () => {
    pinned = !pinned;
    if (!pinned && !hovered) button.blur();
    render();
  });
  row.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; render(); } });
  row.addEventListener('pointerleave', () => { hovered = false; render(); });
  row.addEventListener('focusin', render);
  row.addEventListener('focusout', () => requestAnimationFrame(render));
  row.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      pinned = false;
      hovered = false;
      document.activeElement.blur();
      render();
    }
  });
  render();
});
document.documentElement.classList.add('enhanced');

const dialog = document.querySelector('.preview-dialog');
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-preview]');
  if (!trigger) return;
  event.preventDefault();
  dialog.querySelector('#dialog-title').textContent = trigger.dataset.preview;
  dialog.showModal();
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.dialog-back').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
