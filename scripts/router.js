const VIEWS = {
  '/home': {
    showHeader: true,
    showFooter: true,
    content: fetch('home.tpl.html').then((res) => res.text()),
  },
  '/trending': {
    showHeader: true,
    showFooter: true,
    content: fetch('trending.tpl.html').then((res) => res.text()),
  },
  '/post': {
    showFooter: false,
    showHeader: false,
    content: fetch('post.tpl.html').then((res) => res.text()),
  },
  '/shop': {
    showHeader: true,
    showFooter: true,
    content: fetch('shop.tpl.html').then((res) => res.text()),
  },
  '/search': {
    showHeader: false,
    showFooter: true,
    content: fetch('search.tpl.html').then((res) => res.text()),
  },
};

let curView;

function enablePageRouting() {
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
  const main = document.querySelector('main');
  const footer = document.querySelector('#main-footer');
  
  main.innerHTML = await VIEWS[viewName].content;
  main.setAttribute('data-curview', viewName);

  if (curView) curButton.classList.remove('footer__button__active');
  viewButton.classList.add('footer__button__active');

  if (view.showHeader) header.classList.remove('hidden');
  else header.classList.add('hidden');

  if (view.showFooter) footer.classList.remove('hidden');
  else footer.classList.add('hidden');

  curView = viewName;
}

function enableNavButtonListeners() {
  document.querySelectorAll('.footer__button').forEach((el) => {
    el.addEventListener('click', () => {
      loadView(`/${ el.getAttribute('data-view') }`);
    });
  });
}

export function initRouting() {
  enablePageRouting();
  loadView('/home');
  enableNavButtonListeners();
};