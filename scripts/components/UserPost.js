import { loadView, URIString } from './../router.js'

const DEFAULT_POST = {
  store_name: 'Store Name',
  store_location: 'City, ST',
  image_url: '/assets/images/posts/example_post1.jpg',
  image_desc: 'Image of a woman smiling with a matcha latte and cinnamon latte on a table in front of her',
  image_items: [
    {
      item_name: 'Example item 1',
      item_rating: 5,
      item_x: 0.47,
      item_y: 0.73,
    },
    {
      item_name: 'Example item 2',
      item_rating: 4,
      item_x: 0.68,
      item_y: 0.9,
    }
  ],
  post_desc: 'Lorem ipsum description.',
  post_author: 'First Last',
  likes_count: 99,
  comments_count: 99,
};

class UserPost extends HTMLElement {
  _userLikedPost = false;
  _postData;

  constructor() {
    super();
  }

  connectedCallback() {
    const postTemplate = document.querySelector('#post-template');
    const post = postTemplate.content.cloneNode(true);

    /* fetch post data */
    this._post_data = JSON.parse(window.sessionStorage.getItem(this.getAttribute('post-id'))) ?? DEFAULT_POST;

    /* embed information into post */
    post.querySelector('address .store-name').innerText = this._post_data.store_name;
    post.querySelector('address .city-state').innerText = this._post_data.store_location;
    
    const image = post.querySelector('picture img');
    image.setAttribute('src', this._post_data.image_url);
    image.setAttribute('alt', this._post_data.image_desc);

    post.querySelector('figcaption a').innerText = this._post_data.post_author;
    post.querySelector('figcaption .post-description').innerText = this._post_data.post_desc;

    post.querySelector('#count-likes').innerText = this._post_data.likes_count;
    post.querySelector('#count-comments').innerText = this._post_data.comments_count;

    const imageWrapper = post.querySelector('.image-wrapper');

    /* enable location link */
    post.querySelector('address a').addEventListener('click', (e) => {
      e.preventDefault();
      loadView(`/shop/${ URIString(this._post_data.store_name) }`, true);
    });

    /* create popover drink modals */
    this._post_data.image_items.forEach((item, i) => {
      const modal = document.createElement('drink-modal');

      modal.setAttribute('store-name', this._post_data.store_name);
      modal.setAttribute('item-name', item.item_name);
      modal.setAttribute('item-rating', item.item_rating);
      modal.setAttribute('item-pos-x', item.item_x);
      modal.setAttribute('item-pos-y', item.item_y);

      if (i === 0) modal.setAttribute('open', '');

      imageWrapper.appendChild(modal);

      modal.addEventListener('modal-opened', () => this._closeAllModalsExcept(i));
    });

    /* initialize double-tap-to-like image listener */
    let lastTouchTimestamp = 0;
    const tapHandler = () => {
      const timestamp = new Date().getTime();
      if (timestamp - lastTouchTimestamp < 350) this._handleDblTapLike();
      lastTouchTimestamp = timestamp;
    };
    image.addEventListener('click', tapHandler, { passive: true });

    /* initialize like/unlike toggle button listeners */
    post.querySelector('.likes-counter').addEventListener('click', () => {
      if (this._userLikedPost) this._handleUnlike();
      else this._handleLike();
    });

    this.replaceChildren(post);
  }

  _closeAllModalsExcept(n) {
    this.querySelectorAll('drink-modal').forEach((el, i) => {
      if (i === n) return;
      el.removeAttribute('open');
    });
  }

  _handleLike() {
    if (this._userLikedPost) return;
    this._userLikedPost = true;
    this.querySelector('.likes-counter').classList.add('user-liked-counter');
    this.querySelector('#count-likes').innerText = this._post_data.likes_count + 1;
  }

  _handleUnlike() {
    if (!this._userLikedPost) return;
    this._userLikedPost = false;
    this.querySelector('.likes-counter').classList.remove('user-liked-counter');
    this.querySelector('#count-likes').innerText = this._post_data.likes_count;
  }

  _handleDblTapLike() {
    if (this.getAttribute('preview') === 'true') return;
    const picture = this.querySelector('picture');
    picture.classList.add('liked-post');
    picture.addEventListener('animationend', () => {
      picture.classList.remove('liked-post');
    });
    this._handleLike();
  }
}

customElements.define('user-post', UserPost);