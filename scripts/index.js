import { initRouting, loadView } from './router.js';
import { initHome } from './home.js';
import { initPost } from './post.js';
import { initShop } from './shop.js';
import { initTrending } from './trending.js';

document.addEventListener('DOMContentLoaded', () => {
  initRouting();

  document.querySelector('main').addEventListener('view-switch', () => {
    const newView = window.location.pathname.split('/')?.[1] ?? 'home';
    switch (newView) {
      case 'home':
        initHome();
        break;
      case 'trending':
        initTrending();
        break;
      case 'post':
        initPost();
        break;
      case 'shop':
        initShop();
        break;
      case 'search':
        
        break;
      default:
        loadView('/home');
    }
  });
});
