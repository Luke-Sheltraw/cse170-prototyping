import { loadView, URIString } from './router.js';

const MOCK_TRENDING_URI = '/scripts/mocks/mock_trending.json';

async function initializeTrendingLayout() {
  const items = await fetch(MOCK_TRENDING_URI).then((contents) => contents.json());

  /* Create suggested item */
  const suggestedButtonEl = document.querySelector('#trending-suggested-item button');
  const suggestedImgEl = document.querySelector('#trending-suggested-item img');
  const suggestedItemNameEl = document.querySelector('#trending-suggested-item h3');
  const suggestedStoreNameEl = document.querySelector('#trending-suggested-item h4');
  suggestedImgEl.src = items.current_suggested_item.image_url;
  suggestedImgEl.alt = `Image of ${ items.current_suggested_item.fullname } from ${ items.current_suggested_item.store_name }`;
  suggestedItemNameEl.innerText = items.current_suggested_item.fullname;
  suggestedStoreNameEl.innerText = items.current_suggested_item.store_name;
  
  suggestedButtonEl.addEventListener('click', () => {
    loadView(`/shop/${ URIString(
      items.current_suggested_item.store_name,
      items.current_suggested_item.fullname) 
    }`, true);
  });

  /* Create trending list */
  const trendingItemEls = items.trending_items.map((item) => {
    const listItemEl = document.createElement('li');
    const buttonEl = document.createElement('button');
    const itemNameEl = document.createElement('h3');
    const storeNameEl = document.createElement('h4');
    itemNameEl.innerText = item.fullname;
    storeNameEl.innerText = item.store_name;
    buttonEl.append(itemNameEl, storeNameEl);
    listItemEl.append(buttonEl);
    buttonEl.classList.add('chevron-button');

    buttonEl.addEventListener('click', () => {
      loadView(`/shop/${ URIString(
        item.store_name,
        item.fullname
      )}`, true);
    });

    return listItemEl;
  });
  document.querySelector('#trending-trending-items ol').replaceChildren(...trendingItemEls);

  /* Create coming soon list */
  const comingSoonEls = items.coming_soon_items.map((item) => {
    const listItemEl = document.createElement('li');
    const buttonEl = document.createElement('button');
    const itemNameEl = document.createElement('h3');
    const storeNameEl = document.createElement('h4');
    const timeEl = document.createElement('time');
    itemNameEl.innerText = item.fullname;
    storeNameEl.innerText = item.store_name;
    timeEl.innerText = item.release_date.short_written;
    timeEl.setAttribute('datetime', item.release_date.datetime);
    buttonEl.append(itemNameEl, storeNameEl);
    listItemEl.append(buttonEl, timeEl);
    buttonEl.classList.add('chevron-button');

    buttonEl.addEventListener('click', () => {
      loadView(`/shop/${ URIString(
        item.store_name,
        item.fullname
      )}`, true);
    });

    return listItemEl;
  });
  document.querySelector('#trending-coming-soon-items ol').replaceChildren(...comingSoonEls);

}

function initializeSearchBar() {
  const searchBar = document.querySelector('#search-bar');
  const resultWrapper = document.querySelector('#search-result-wrapper');
  
  searchBar.addEventListener('input', (e) => {
    if (e.target.value.length > 0) resultWrapper.dataset.curview = 'real';
    else resultWrapper.dataset.curview = 'suggested';
  });
}

function resetSearchBar() {
  const searchBar = document.querySelector('#search-bar');
  const resultWrapper = document.querySelector('#search-result-wrapper');
  
  searchBar.value = '';
  resultWrapper.dataset.curview = 'suggested';
}

export function initExplore() {
  initializeSearchBar();
  initializeTrendingLayout();
}

export function updateExplore() {
  resetSearchBar();
}