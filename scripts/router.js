import { initHome } from "./home.js";
import { initPost } from "./post.js";

const VIEWS = {
  '/home': {
    initialize: initHome,
    showHeader: true,
    showFooter: true,
  },
  '/trending': {
    initialize: () => {},
    showHeader: true,
    showFooter: true,
  },
  '/post': {
    initialize: initPost,
    showFooter: false,
    showHeader: false,
  },
  '/shop': {
    initialize: () => {},
    showHeader: true,
    showFooter: true,
  },
  '/search': {
    initialize: () => {},
    showHeader: false,
    showFooter: true,
  },
};

let curView;
let mainContainer;

function enablePageRouting() {
  mainContainer = document.querySelector('main');

  window.addEventListener('popstate', (e) => {
    loadView(window.location.pathname);
  });
}

export async function loadView(viewName) {
  if (viewName === curView) return;
  if (viewName === '/' || !VIEWS[viewName]) return loadView('/home');

  if (window.location.pathname !== viewName)
    window.history.pushState({}, '', viewName);
  
  const view = VIEWS[viewName];

  const curButton = document.querySelector(`#${ curView?.slice(1) }-button`);
  const viewButton = document.querySelector(`#${ viewName.slice(1) }-button`);
  const header = document.querySelector('#main-header');
  const footer = document.querySelector('#main-footer');

  const viewContent = await fetch(`${ viewName }.tpl.html`).then((res) => res.text());
  mainContainer.innerHTML = viewContent;

  if (curView) curButton.classList.remove('footer__button__active');
  viewButton.classList.add('footer__button__active');

  if (view.showHeader) header.classList.remove('hidden');
  else header.classList.add('hidden');

  if (view.showFooter) footer.classList.remove('hidden');
  else footer.classList.add('hidden');

  curView = viewName;

  view.initialize();
}

function enableNavButtonListeners() {
  document.querySelectorAll('.footer__button').forEach((el) => {
    el.addEventListener('click', () => {
      loadView(`/${ el.getAttribute('data-view') }`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  enablePageRouting();
  loadView('/home');
  enableNavButtonListeners();
});