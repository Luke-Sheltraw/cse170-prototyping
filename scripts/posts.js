const MAX_POSTS = 50;

let currentPosts = 0;

function initializeInfiniteScroll() {
  loadNextPostBatch();

  window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight + 500 >= scrollHeight) loadNextPostBatch();
  }, { passive: true });
}

function loadNextPostBatch() {
  if (currentPosts >= MAX_POSTS) return;

  const container = document.querySelector('#post-container');

  const newPosts = Array.from({ length: 7 }).map(() => { 
    return document.createElement('user-post')
  });

  newPosts.forEach((el) => {
    container.appendChild(el);
  });

  currentPosts += newPosts.length;
}

document.addEventListener('DOMContentLoaded', () => {
  initializeInfiniteScroll();
});