import { initRouting, loadView } from './router.js';
import { initHome } from './home.js';
import { initPost } from './post.js';

document.addEventListener('DOMContentLoaded', () => {
  initRouting();

  const observer = new MutationObserver((attributeChanges) => {
    const newView = attributeChanges[0].target.getAttribute('data-curview');
    switch (newView) {
      case '/home':
        initHome();
        break;
      case '/trending':

        break;
      case '/post':
        initPost();
        break;
      case '/shop':

        break;
      case '/search':
        
        break;
      default:
        loadView('/home');
    }
  });

  observer.observe(document.querySelector('main'), {
    attributeFilter: ['data-curview'],
  });
});
