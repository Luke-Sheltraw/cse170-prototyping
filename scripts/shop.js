import { loadView } from './router.js';

const MOCK_ITEMS_URI = '/scripts/mock_items.json';

function initializeMainView() {

}

async function initializeStoreView(storeName) {
  /* Fetching store info */
  const mock_items = await fetch(MOCK_ITEMS_URI).then((contents) => contents.json());

  const storeObj = mock_items[storeName];

  /* Creating store view */
  const storeViewTemplateEl = document.querySelector('#store-information-template');
  const storeViewEl = storeViewTemplateEl.content.cloneNode(true);
  
  /* Placing store information */
  const itemImageEl = storeViewEl.querySelector('figure img');
  const itemNameEl = storeViewEl.querySelector('figcaption h2');
  const itemLocationEl = storeViewEl.querySelector('figcaption h3');
  const itemRatingEl = storeViewEl.querySelector('figcaption .stars');
  const itemRatingDescEl = storeViewEl.querySelector('figcaption .stars-desc');
  const itemDescEl = storeViewEl.querySelector('figcaption p');
  const relatedPostsCountEl = storeViewEl.querySelector('figcaption .related-posts-count');
  const directionsLinkEl = storeViewEl.querySelector('.store-info-links .store-directions-link');
  const extWebsiteLinkEl = storeViewEl.querySelector('.store-info-links .store-website-link');
  
  itemImageEl.src = storeObj['image_url'];
  itemImageEl.alt = `Image of ${ storeObj.fullname }`;
  itemNameEl.innerText = storeObj.fullname;
  itemLocationEl.innerText = storeObj.location.short;
  itemRatingEl.setAttribute('aria-label', `${ storeObj.fullname } is rated ${ storeObj.rating } stars`);
  itemRatingEl.classList.add(`stars-${ storeObj.rating }`);
  itemRatingDescEl.innerText = `${ storeObj.rating } stars (${ storeObj['ratings_count'] } reviews)`;
  itemDescEl.innerText = storeObj.description;
  relatedPostsCountEl.innerText = storeObj['related_posts_count'];
  directionsLinkEl.href = storeObj.location['maps_url'];
  extWebsiteLinkEl.href = storeObj['website_url'];
  
  /* Attaching to DOM */
  const pageContainerEl = document.querySelector('#shop-view-container');
  pageContainerEl.replaceChildren(storeViewEl);
}

async function initializeItemView(storeName, itemName) {
  /* Fetching item and store info */
  const mock_items = await fetch(MOCK_ITEMS_URI).then((contents) => contents.json());

  const storeObj = mock_items[storeName];
  const itemObj = storeObj.items[itemName];

  /* Creating item view */
  const itemViewTemplateEl = document.querySelector('#item-information-template');
  const itemViewEl = itemViewTemplateEl.content.cloneNode(true);
  
  /* Placing store information */
  const storeTitleEl = itemViewEl.querySelector('.store-link-button h3');
  const storeLocationEl = itemViewEl.querySelector('.store-link-button address');
  const storeRatingEl = itemViewEl.querySelector('.store-link-button span');
  
  storeTitleEl.innerText = storeObj.fullname;
  storeLocationEl.innerText = storeObj.location.short;
  storeRatingEl.setAttribute('aria-label', `${ storeObj.fullname } is rated ${ storeObj.rating } stars`);
  storeRatingEl.classList.add(`stars-${ storeObj.rating }`);

  /* Enabling location link */
  itemViewEl.querySelector('.store-link-button').addEventListener('click', (e) => {
    e.preventDefault();
    loadView(`/shop/${ storeObj.fullname.replaceAll(' ', '-').toLowerCase() }`, true);
  });
  
  /* Placing item information */
  const itemImageEl = itemViewEl.querySelector('figure img');
  const itemNameEl = itemViewEl.querySelector('figcaption h2');
  const itemRatingEl = itemViewEl.querySelector('figcaption .stars');
  const itemRatingDescEl = itemViewEl.querySelector('figcaption .stars-desc');
  const itemDescEl = itemViewEl.querySelector('figcaption p');
  const relatedPostsCountEl = itemViewEl.querySelector('figcaption .related-posts-count');
  
  itemImageEl.src = itemObj['image_url'];
  itemImageEl.alt = `Image of ${ itemObj.fullname }`;
  itemNameEl.innerText = itemObj.fullname;
  itemRatingEl.setAttribute('aria-label', `${ itemObj.fullname } is rated ${ itemObj.rating } stars`);
  itemRatingEl.classList.add(`stars-${ itemObj.rating }`);
  itemRatingDescEl.innerText = `${ itemObj.rating } stars (${ itemObj['ratings_count'] } reviews)`;
  itemDescEl.innerText = itemObj.description;
  relatedPostsCountEl.innerText = itemObj['related_posts_count'];
  
  /* Attaching to DOM */
  const pageContainerEl = document.querySelector('#shop-view-container');
  pageContainerEl.replaceChildren(itemViewEl);
}

export function initShop() {
  console.log('called');
  const backButton = document.querySelector('.shop-back-button');
  if (window.history.state?.displayBackButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  } else {
    backButton.remove();
  }

  const storeName = window.location.pathname.split('/')[2]; 
  const itemName = window.location.pathname.split('/')[3];

  if (!storeName)
    initializeMainView();
  else if (!itemName)
    initializeStoreView(storeName);
  else 
    initializeItemView(storeName, itemName);
}