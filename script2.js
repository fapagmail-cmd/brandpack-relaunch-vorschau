// Native <details> funktionieren auch ohne JavaScript.
// Auf großen Displays ergänzt Hover die Bedienung per Klick und Tastatur.
const hoverCases = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1101px)');
const panels = [...document.querySelectorAll('.case-panel')];
for (const panel of panels) {
  const summary = panel.querySelector('summary');
  let pinned = false;
  panel.addEventListener('pointerenter', () => {
    if (hoverCases.matches) panel.open = true;
  });
  panel.addEventListener('pointerleave', () => {
    if (hoverCases.matches && !pinned && !panel.contains(document.activeElement)) panel.open = false;
  });
  summary.addEventListener('click', event => {
    event.preventDefault();
    pinned = !pinned;
    panel.open = pinned;
    panel.dataset.pinned = String(pinned);
  });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      pinned = false;
      panel.open = false;
      panel.dataset.pinned = 'false';
      summary.focus();
      event.stopPropagation();
    }
  });
  panel.addEventListener('focusout', event => {
    if (hoverCases.matches && !pinned && !panel.contains(event.relatedTarget) && !panel.matches(':hover')) panel.open = false;
  });
  hoverCases.addEventListener('change', () => {
    if (!pinned) panel.open = false;
  });
}

// Der einführende Inhalt wird über das vorhandene runde Emblem geöffnet.
const introButton = document.querySelector('.emblem');
const brandIntro = document.querySelector('#brand-intro');
introButton.addEventListener('click', () => {
  const open = introButton.getAttribute('aria-expanded') !== 'true';
  introButton.setAttribute('aria-expanded', String(open));
  brandIntro.hidden = !open;
});

// Der kurze Cureating-Absatz öffnet ausschließlich per Aktivierung (Klick, Antippen, Enter/Leertaste).
const roleButton = document.querySelector('.role-statement');
const roleIntro = document.querySelector('#cureating-intro');
function showRoleIntro(open) {
  roleIntro.hidden = !open;
  roleButton.setAttribute('aria-expanded', String(open));
}
roleButton.addEventListener('click', () => {
  showRoleIntro(roleButton.getAttribute('aria-expanded') !== 'true');
});
roleButton.addEventListener('keydown', event => {
  if (event.key === 'Escape') showRoleIntro(false);
});

// Die Cureating-Unterseite folgt später; bis dahin bleibt der Entwurfshinweis aktiv.
document.addEventListener('click', event => {
  if (event.target.closest('a[data-preview]')) event.preventDefault();
});
