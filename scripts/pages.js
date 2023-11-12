import { initHome } from "./posts.js";

const VIEWS = ['/home', '/post', '/trending', '/search', '/shop'];
const INITIALIZERS = {
  '/home': initHome,
  '/post': () => {},
  '/trending': () => {},
  '/search': () => {},
  '/shop': () => {},
}

let curView;
let mainContainer;

function enablePageRouting() {
  mainContainer = document.querySelector('main');

  window.addEventListener('popstate', (e) => {
    loadView(window.location.pathname);
  });
}

async function loadView(viewName) {
  if (viewName === curView) return;
  if (viewName === '/' || !VIEWS.includes(viewName)) return loadView('/home');

  if (curView) document.querySelector(`#${ curView.slice(1) }-button`)
    .classList.remove('footer__button__active');
  document.querySelector(`#${ viewName.slice(1) }-button`)
    .classList.add('footer__button__active');
  
  curView = viewName;

  const viewContent = await fetch(`${ viewName }.tpl.html`).then((res) => res.text());
  (INITIALIZERS[viewName])();

  mainContainer.innerHTML = viewContent;
}

function enableNavButtonListeners() {
  document.querySelectorAll('.footer__button').forEach((el) => {
    el.addEventListener('click', () => {
      const targetView = el.getAttribute('data-view');
      window.history.pushState({}, '', targetView);
      loadView(`/${ targetView }`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  enablePageRouting();
  window.history.pushState({}, '', '/home');
  loadView(window.location.pathname);
  enableNavButtonListeners();
});