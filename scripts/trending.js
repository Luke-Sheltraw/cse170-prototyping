const MOCK_TRENDING_URI = '/scripts/mock_trending.json';

async function initializeTrendingLayout() {
  const items = await fetch(MOCK_TRENDING_URI).then((contents) => contents.json());

  /* Create suggested item */
  
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
    return listItemEl;
  });
  document.querySelector('#trending-coming-soon-items ol').replaceChildren(...comingSoonEls);

}

export function initTrending() {
  initializeTrendingLayout();
}