const MOCK_SERVER_DELAY_MS = 500;
const MOCK_POSTS_URI = '/scripts/mock_posts.json';
let mock_posts;

const MAX_POSTS = 35;

let currentNumPosts;
let currentlyFetchingData;
let postFeedFooterElement;

async function initializeInfiniteScroll() {
  mock_posts = await fetch(MOCK_POSTS_URI).then((contents) => contents.json());

  currentlyFetchingData = false;
  currentNumPosts = 0;
  postFeedFooterElement = document.querySelector('#post-feed-footer');

  loadNextPostBatch();

  window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight + 800 >= scrollHeight) loadNextPostBatch();
  }, { passive: true });
}

function loadNextPostBatch() {
  if (currentlyFetchingData || currentNumPosts >= MAX_POSTS) return;
  currentlyFetchingData = true;
  postFeedFooterElement.setAttribute('data-loading', 'true');

  const container = document.querySelector('#post-feed-container');

  fetchNextPostBatchIds()
    .then((post_ids) => {
      post_ids.forEach((id) => {
        const post = document.createElement('user-post');
        post.setAttribute('post-id', id);
        container.appendChild(post);
      });
      currentNumPosts += post_ids.length;
    })
    .finally(() => {
      currentlyFetchingData = false;
      postFeedFooterElement.setAttribute('data-loading', 'false');
    });
}

async function fetchNextPostBatchIds() {
  return new Promise((resolve) => {
    setTimeout(() =>
      resolve(
        Array.from({ length: 7 }).map(() => { 
          const post_info = getMockedPostInfo();
          window.sessionStorage.setItem(post_info.post_id, JSON.stringify(post_info));
          return post_info.post_id;
        })
      ), MOCK_SERVER_DELAY_MS);
  });
}

function getMockedPostInfo() {
  return mock_posts[Math.floor(Math.random() * mock_posts.length)];
}

export function initHome() {
  initializeInfiniteScroll();
}