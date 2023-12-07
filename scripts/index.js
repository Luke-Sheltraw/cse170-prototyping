import { initRouting, loadView } from './router.js';
import { initHome, updateHome } from './home.js';
import { initPost } from './post.js';
import { initShop, updateShop } from './shop.js';
import { initExplore, updateExplore } from './explore.js';

const pages = {
  'home': {
    initializer: initHome,
    updater: updateHome,
    hasBeenInitialized: false,
  },
  'post': {
    initializer: initPost,
    updater: () => {},
    hasBeenInitialized: false,
  },
  'shop': {
    initializer: initShop,
    updater: updateShop,
    hasBeenInitialized: false,
  },
  'profile': {
    initializer: () => {},
    updater: () => {},
    hasBeenInitialized: false,
  },
  'explore': {
    initializer: initExplore,
    updater: updateExplore,
    hasBeenInitialized: false,
  },
}

document.addEventListener('DOMContentLoaded', () => {
  initRouting();

  document.querySelector('main').addEventListener('view-switch', async () => {
    const newView = window.location.pathname.split('/')?.[1] ?? 'home';
    const pageObj = pages[newView];

    if (!pageObj) loadView('/home');

    if (!pageObj.hasBeenInitialized) {
      pageObj.hasBeenInitialized = true;
      pageObj.initializer();
    }

    await pageObj.updater();
    document.documentElement.scrollTop = 0;
  });
});