import { loadView } from './router.js';

function initializeUpload() {
  const imageUpload = document.querySelector('#image-upload');
  const imageUrl = document.querySelector('#image-url');
  const imagePreview = document.querySelector('#image-preview');

  const fileReader = new FileReader();

  fileReader.addEventListener('loadend', (e) => {
    const encoding = e.target.result;
    if (!encoding) return;

    imagePreview.src = encoding;
    imageUrl.value = encoding;

    imagePreview.classList.remove('hidden');
  });

  imageUpload.addEventListener('change', () => {
    try {
      fileReader.readAsDataURL(imageUpload.files[0]);
    } catch { return; }
  });
}

function initializeNavigationListeners() {
  const closeButton = document.querySelector('#close-post-interface');
  const backButtons = document.querySelectorAll('.back-button');
  const nextButtons = document.querySelectorAll('.next-button');

  const viewList = document.querySelectorAll('.post-view');
  let currentView = 0;
  
  closeButton.addEventListener('click', () => {
    window.history.back();
  });

  backButtons.forEach((btn) => 
    btn.addEventListener('click', () => {
      if (currentView <= 0) return;
      viewList[currentView].setAttribute('data-active', 'false');
      viewList[currentView - 1].setAttribute('data-active', 'true');
      currentView -= 1;
    }
  ));

  const moveToNextView = () => {
    if (currentView >= viewList.length - 1) return;
    viewList[currentView].setAttribute('data-active', 'false');
    viewList[currentView + 1].setAttribute('data-active', 'true');
    currentView += 1;
  }

  nextButtons.forEach((btn) => 
    btn.addEventListener('click', () => {
      if (currentView === 1) { // store select next button
        const modal = document.querySelector('#location-rating-modal');
        document.querySelector('#review-store-name').innerText = 
          document.querySelector('#selected-store-name').value;
        document.querySelector('#review-store-location').innerText = 
          document.querySelector('#selected-store-location').value;
        modal.setAttribute('open', '');
        document.querySelector('.save-stars-button').addEventListener('click', () => {
          modal.removeAttribute('open');
          moveToNextView();
        }, { once: true });
      } else {
        moveToNextView();
      }
    }
  ));

  viewList.forEach((viewElement) => {
    const requiredFields = viewElement.querySelectorAll('.required-input');
    const nextButton = viewElement.querySelector('.next-button');

    if (nextButton === null) return;
    if (requiredFields.length === 0) nextButton.disabled = false;

    const populatedFields = {};

    const handleInputChange = (e) => {
      if (e.target.value) {
        populatedFields[e.target.name] = e.target.value;
      } else {
        delete populatedFields[e.target.name];
      }

      if (Object.entries(populatedFields).length === requiredFields.length) {
        nextButton.disabled = false;
      } else {
        nextButton.disabled = true;
      }
    };

    const observer = new MutationObserver((e) => {
      e.forEach((evt) => handleInputChange(evt));
    });
  
    requiredFields.forEach((requiredField) => {
      observer.observe(requiredField, {
        attributeFilter: ['value'],
      });
    });

    requiredFields.forEach((requiredField) =>
      requiredField.addEventListener('input', handleInputChange)
    );
  });
}

function initializeFormListener() {
  const form = document.querySelector('#post-upload');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const store_name = formData.get('selected-store-name');
    const store_location = formData.get('selected-store-location');
    const image_url = formData.get('image-url');
    const post_desc = formData.get('post-caption');

    const post_id = 'xxxxxx';
    const post_author = 'John Doe';

    if (!store_name || !store_location || !image_url || !post_desc) return;

    const newPost = {
      post_id,
      store_name,
      store_location,
      image_url,
      image_desc: post_desc,
      image_items: [
        // {
        //   item_name: 'User-flagged item',
        //   item_rating: 5,
        //   item_x: 0.5,
        //   item_y: 0.5
        // },
      ],
      post_desc,
      post_author,
      likes_count: 0,
      comments_count: 0,
    };
    window.sessionStorage.setItem(post_id, JSON.stringify(newPost));

    const postElement = document.createElement('user-post');
    postElement.setAttribute('post-id', post_id);

    loadView('/home').then(() => {
      const feedContainer = document.querySelector('#post-feed-container');
      feedContainer.prepend(postElement);
    });
  });
}

function initializeStoreSearch() {
  const hiddenFieldElementName = document.querySelector('#selected-store-name');
  const hiddenFieldElementLocation = document.querySelector('#selected-store-location');
  const suggestedOptionElements = document.querySelectorAll('#suggested-search-stores button');
  let activeButtonElement;

  suggestedOptionElements.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn === activeButtonElement) {
        activeButtonElement.removeAttribute('data-selected');
        activeButtonElement = undefined;
        hiddenFieldElementName.value = '';
        hiddenFieldElementLocation.value = '';
        return;
      };
      activeButtonElement?.removeAttribute('data-selected');
      btn.setAttribute('data-selected', '');
      activeButtonElement = btn;
      hiddenFieldElementName.value = activeButtonElement.getAttribute('data-storename');
      hiddenFieldElementLocation.value = activeButtonElement.getAttribute('data-storelocation');
    });
  });
}

export function initPost() {
  initializeUpload();
  initializeNavigationListeners();
  initializeStoreSearch();
  initializeFormListener();
}