const MOCK_ITEMS_URI = '/scripts/mock_items.json';

async function initializeItemFetch() {
  const mock_items = await fetch(MOCK_ITEMS_URI).then((contents) => contents.json());

  const itemName = window.location.pathname.split('/')[3];
  const itemObj = mock_items[itemName];

  const itemViewTemplate = document.querySelector('#item-information-template');
  const itemView = itemViewTemplate.content.cloneNode(true);

  itemView.querySelector('.item-info-name').innerText = itemObj.fullname;

  document.querySelector('#shop-view-container').replaceChildren(itemView);
}

export function initShop() {
  initializeItemFetch();
}