const parser = new DOMParser();
let curView;

const VIEWS = {
  '/home': {
    showFooter: true,
    content: getDOMFragFromPathname('/home.tpl.html'),
  },
  '/profile': {
    showFooter: true,
    content: getDOMFragFromPathname('/profile.tpl.html'),
  },
  '/post': {
    showHeader: false,
    content: getDOMFragFromPathname('/post.tpl.html'),
  },
  '/shop': {
    showFooter: true,
    content: getDOMFragFromPathname('/shop.tpl.html'),
  },
  '/explore': {
    showFooter: true,
    content: getDOMFragFromPathname('/explore.tpl.html'),
  },
};

async function getDOMFragFromPathname(pathname) {
  return fetch(pathname)
    .then((res) => res.text())
    .then((htmlText) => parser.parseFromString(htmlText, 'text/html'))
    .then((domFrag) => [...domFrag.body.children]);
}

function enablePageRouting() {
  window.addEventListener('popstate', (e) => {
    loadView(window.location.pathname);
  });
}

function pathNameToRoot(fullPathname) {
  if (fullPathname === undefined || fullPathname === null) return;
  const nextSlashIndex = fullPathname.indexOf('/', 1);
  if (nextSlashIndex < 0) return fullPathname;
  return fullPathname.substring(0, nextSlashIndex);
}

export function URIString(...strings) {
  return strings
    .map((str) => str.replaceAll(' ', '-').toLowerCase())
    .join('/');
}

export async function loadView (
  viewName, 
  { 
    displayBackButton,
  } = {},
) {
  if (viewName === curView) return;
  const viewRoot = pathNameToRoot(viewName);
  const view = VIEWS[viewRoot];

  if (viewRoot === '/' || !view) return loadView('/home');

  if (window.location.pathname !== viewName)
    window.history.pushState({ displayBackButton }, '', viewName);

  const curButton = document.querySelector(`#${ pathNameToRoot(curView)?.slice(1) }-button`);
  const viewButton = document.querySelector(`#${ viewRoot.slice(1) }-button`);
  const main = document.querySelector('main');
  const footer = document.querySelector('#main-footer');
  
  const newContent = await view.content;
  main.replaceChildren(...newContent);
  main.dispatchEvent(new CustomEvent('view-switch'));

  if (curView) curButton.classList.remove('footer__button__active');
  viewButton.classList.add('footer__button__active');

  if (view.showFooter) footer.classList.remove('hidden');
  else footer.classList.add('hidden');

  curView = viewName;
}

export function initRouting() {
  enablePageRouting();
  loadView(window.location.pathname);
};