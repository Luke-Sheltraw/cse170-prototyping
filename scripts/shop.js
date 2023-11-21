const MOCK_ITEMS_URI = '/scripts/mock_items.json';

function initializeMainView() {

}

function initializeStoreView() {

}

async function initializeItemView(storeName, itemName) {
  /* Fetching item and store info */
  const mock_items = await fetch(MOCK_ITEMS_URI).then((contents) => contents.json());

  const storeObj = mock_items[storeName];
  const itemObj = storeObj.items[itemName];

  /* Creating item view */
  const pageContainerEl = document.querySelector('#shop-view-container');
  const itemViewTemplateEl = document.querySelector('#item-information-template');
  const itemViewEl = itemViewTemplateEl.content.cloneNode(true);

  /* Placing store information */
  const storeTitleEl = itemViewEl.querySelector('.store-link-button h3');
  const storeLocationEl = itemViewEl.querySelector('.store-link-button address');
  const storeRatingEl = itemViewEl.querySelector('.store-link-button span');

  storeTitleEl.innerText = storeObj.fullname;
  storeLocationEl.innerText = storeObj.location;
  storeRatingEl.setAttribute('aria-label', `${ storeObj.fullname } is rated ${ storeObj.rating } stars`);
  storeRatingEl.classList.add(`stars-${ storeObj.rating }`);

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
  pageContainerEl.replaceChildren(itemViewEl);
}

export function initShop() {
  const backButton = document.querySelector('.back-button');
  if (window.history.state.displayBackButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  } else {
    backButton?.remove();
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