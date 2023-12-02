function initializeSearchBar() {
  const searchBar = document.querySelector('#search-bar');
  const resultWrapper = document.querySelector('#search-result-wrapper');

  searchBar.addEventListener('input', (e) => {
    if (e.target.value.length > 0) resultWrapper.dataset.curview = 'real';
    else resultWrapper.dataset.curview = 'suggested';
  });
}

export function initSearch() {
  initializeSearchBar();
}

export function updateSearch() {
  const searchBar = document.querySelector('#search-bar');

  searchBar.value = '';
  searchBar.focus();
}