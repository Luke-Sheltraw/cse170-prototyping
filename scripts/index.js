import { initRouting, loadView } from './router.js';
import { initHome } from './home.js';
import { initPost } from './post.js';
import { initShop, updateShop } from './shop.js';
import { initTrending } from './trending.js';
import { initSearch, updateSearch } from './search.js';

const INITIALIZER_BY_NAME = {
  'home': initHome,
  'post': initPost,
  'shop': initShop,
  'trending': initTrending,
  'search': initSearch,
}

const UPDATER_BY_NAME = {
  'home': () => {},
  'post': () => {},
  'shop': updateShop,
  'trending': () => {},
  'search': updateSearch,
}

const hasBeenInitialized = {};

document.addEventListener('DOMContentLoaded', () => {
  initRouting();

  document.querySelector('main').addEventListener('view-switch', () => {
    const newView = window.location.pathname.split('/')?.[1] ?? 'home';

    if (!INITIALIZER_BY_NAME[newView]) loadView('/home');

    if (!hasBeenInitialized[newView]) {
      INITIALIZER_BY_NAME[newView]();
      hasBeenInitialized[newView] = true;
    }

    UPDATER_BY_NAME[newView]();
  });
});