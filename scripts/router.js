const VIEWS = {
  '/home': {
    showHeader: true,
    showFooter: true,
    content: fetch('/home.tpl.html').then((res) => res.text()),
  },
  '/trending': {
    showHeader: true,
    showFooter: true,
    content: fetch('/trending.tpl.html').then((res) => res.text()),
  },
  '/post': {
    showFooter: false,
    showHeader: false,
    content: fetch('/post.tpl.html').then((res) => res.text()),
  },
  '/shop': {
    showHeader: true,
    showFooter: true,
    content: fetch('/shop.tpl.html').then((res) => res.text()),
  },
  '/search': {
    showHeader: false,
    showFooter: true,
    content: fetch('/search.tpl.html').then((res) => res.text()),
  },
};

let curView;

function enablePageRouting() {
  window.addEventListener('popstate', (e) => {
    loadView(pathNameToRoot(window.location.pathname));
  });
}

function pathNameToRoot(fullPathname) {
  if (fullPathname === undefined || fullPathname === null) return;
  const nextSlashIndex = fullPathname.indexOf('/', 1);
  if (nextSlashIndex < 0) return fullPathname;
  return fullPathname.substring(0, nextSlashIndex);
}

export async function loadView(viewName, displayBackButton) {
  if (viewName === curView) return;
  const viewRoot = pathNameToRoot(viewName);
  const view = VIEWS[viewRoot];

  if (viewRoot === '/' || !view) return loadView('/home');

  if (pathNameToRoot(window.location.pathname) !== viewName)
    window.history.pushState({ displayBackButton }, '', viewName);

  const curButton = document.querySelector(`#${ pathNameToRoot(curView)?.slice(1) }-button`);
  const viewButton = document.querySelector(`#${ viewRoot.slice(1) }-button`);
  const header = document.querySelector('#main-header');
  const main = document.querySelector('main');
  const footer = document.querySelector('#main-footer');
  
  main.innerHTML = await view.content;
  main.setAttribute('data-curview', viewRoot);

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
  loadView(window.location.pathname);
  enableNavButtonListeners();
};