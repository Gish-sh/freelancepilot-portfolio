'use strict';

const languages = [...document.querySelectorAll('[data-lang]')];
const translations = [...document.querySelectorAll('[data-ru], [data-ru-label], [data-ru-alt]')].map(node => ({
  node,
  text: node.textContent,
  label: node.getAttribute('aria-label'),
  alt: node.getAttribute('alt')
}));
const shots = [...document.querySelectorAll('.gallery [data-shot]')];
const dialog = document.querySelector('#lightbox');
const dialogImage = dialog.querySelector('img');
const dialogTitle = dialog.querySelector('h2');
const counter = dialog.querySelector('[data-counter]');
let selected = 0;
let opener;

function renderShot() {
  const button = shots[selected];
  const image = button.querySelector('img');
  dialogTitle.textContent = button.getAttribute('aria-label');
  dialogImage.src = image.getAttribute('src');
  dialogImage.alt = image.alt;
  counter.textContent = (selected + 1) + ' / ' + shots.length;
}

function setLanguage(language) {
  const russian = language === 'ru';
  document.documentElement.lang = language;
  document.title = russian ? 'FreelancePilot · Кейс разработчика' : 'FreelancePilot · Software Development Case Study';
  for (const {node, text, label, alt} of translations) {
    if (node.dataset.ru !== undefined) node.textContent = russian ? node.dataset.ru : text;
    if (node.dataset.ruLabel !== undefined) node.setAttribute('aria-label', russian ? node.dataset.ruLabel : label);
    if (node.dataset.ruAlt !== undefined) node.setAttribute('alt', russian ? node.dataset.ruAlt : alt);
  }
  for (const button of languages) button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  if (dialog.open) renderShot();
}

for (const button of languages) button.addEventListener('click', () => setLanguage(button.dataset.lang));

for (const button of document.querySelectorAll('[data-shot]')) {
  button.addEventListener('click', () => {
    opener = button;
    selected = shots.findIndex(item => item.dataset.shot === button.dataset.shot);
    renderShot();
    dialog.showModal();
  });
}

function move(direction) {
  selected = (selected + direction + shots.length) % shots.length;
  renderShot();
}

dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.querySelector('[data-prev]').addEventListener('click', () => move(-1));
dialog.querySelector('[data-next]').addEventListener('click', () => move(1));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
dialog.addEventListener('close', () => opener?.focus());
