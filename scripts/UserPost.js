const POST_DATA = {
  store_name: 'Home Coffee Roasters',
  store_location: 'San Francisco, CA',
  image_url: '/assets/images/posts/example_post1.png',
  image_desc: 'Image of a woman smiling with a matcha latte and cinnamon latte on a table in front of her',
  image_items: [
    {
      item_name: 'Matcha Latte',
      item_rating: 5,
      item_x: 0.47,
      item_y: 0.73,
    },
    {
      item_name: 'Cinnamon Latte',
      item_rating: 4,
      item_x: 0.68,
      item_y: 0.9,
    }
  ],
  post_desc: 'Taking a quick study break... had to drop in for a few lattes. Peep the Totoro latte art.',
  post_author: 'Luke Sheltraw',
  likes_count: 6,
  comments_count: 2,
};

class UserPost extends HTMLElement {
  _userLikedPost = false;

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const postTemplate = document.querySelector('#post-template');
    const post = postTemplate.content.cloneNode(true);

    /* embed information into post */
    post.querySelector('address .store-name').innerText = POST_DATA.store_name;
    post.querySelector('address .city-state').innerText = POST_DATA.store_location;
    
    const image = post.querySelector('picture img');
    image.setAttribute('src', POST_DATA.image_url);
    image.setAttribute('alt', POST_DATA.image_desc);

    post.querySelector('figcaption a').innerText = POST_DATA.post_author;
    post.querySelector('figcaption .post-description').innerText = POST_DATA.post_desc;

    post.querySelector('#count-likes').innerText = POST_DATA.likes_count;
    post.querySelector('#count-comments').innerText = POST_DATA.comments_count;

    const imageWrapper = post.querySelector('.image-wrapper');

    /* create popover drink modals */
    POST_DATA.image_items.forEach((item, i) => {
      const modal = document.createElement('drink-modal');

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
    imageWrapper.addEventListener('touchstart', (e) => {
      const timestamp = new Date().getTime();
      if (timestamp - lastTouchTimestamp < 350) this._handleDblTapLike();
      lastTouchTimestamp = timestamp;
    }, { passive: true });

    /* initialize like/unlike toggle button listeners */
    post.querySelector('.likes-counter').addEventListener('click', () => {
      if (this._userLikedPost) this._handleUnlike();
      else this._handleLike();
    });

    shadow.appendChild(post);
  }

  _closeAllModalsExcept(n) {
    this.shadowRoot.querySelectorAll('drink-modal').forEach((el, i) => {
      if (i === n) return;
      el.removeAttribute('open');
    });
  }

  _handleLike() {
    if (this._userLikedPost) return;
    this._userLikedPost = true;
    this.shadowRoot.querySelector('.likes-counter').classList.add('user-liked-counter');
    this.shadowRoot.querySelector('#count-likes').innerText = POST_DATA.likes_count + 1;
  }

  _handleUnlike() {
    if (!this._userLikedPost) return;
    this._userLikedPost = false;
    this.shadowRoot.querySelector('.likes-counter').classList.remove('user-liked-counter');
    this.shadowRoot.querySelector('#count-likes').innerText = POST_DATA.likes_count;
  }

  _handleDblTapLike() {
    const picture = this.shadowRoot.querySelector('picture');
    picture.classList.add('liked-post');
    picture.addEventListener('animationend', () => {
      picture.classList.remove('liked-post');
    });
    this._handleLike();
  }
}

customElements.define('user-post', UserPost);