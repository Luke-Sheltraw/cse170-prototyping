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

  const progressBar = document.querySelector('#post-progress');

  const viewList = document.querySelectorAll('.post-view');
  let currentView = 0;

  progressBar.max = viewList.length;
  
  closeButton.addEventListener('click', () => window.history.back());

  backButtons.forEach((btn) => 
    btn.addEventListener('click', () => {
      if (currentView <= 0) return;
      viewList[currentView].dataset.active = false;
      viewList[currentView - 1].dataset.active = true;
      progressBar.value = currentView;
      currentView -= 1;
    }
  ));

  const moveToNextView = () => {
    if (currentView >= viewList.length - 1) return;
    viewList[currentView].dataset.active = false;
    viewList[currentView + 1].dataset.active = true;
    progressBar.value = currentView + 2;
    currentView += 1;
  }

  nextButtons.forEach((btn) => 
    btn.addEventListener('click', () => {
      if (currentView === 1) { // store select next button
        const modalEl = document.querySelector('#location-rating-modal');
        const saveStarsButtonEl = document.querySelector('.save-stars-button');
        document.querySelector('#review-store-name').innerText = 
          document.querySelector('#selected-store-name').value;
        document.querySelector('#review-store-location').innerText = 
          document.querySelector('#selected-store-location').value;
        modalEl.setAttribute('open', '');
        document.querySelector('rating-input').addEventListener('click', () => {
          saveStarsButtonEl.removeAttribute('disabled');
        }, { once: true });
        saveStarsButtonEl.addEventListener('click', () => {
          modalEl.removeAttribute('open');
          moveToNextView();
        }, { once: true });
      } else if (currentView === viewList.length - 2) { // confirmation screen
        const wrapper = document.querySelector('#post-preview-wrapper');
        const postInfo = getCurrentFormData();
        postInfo.post_id = 'POST_PREVIEW';
        window.sessionStorage.setItem(postInfo.post_id, JSON.stringify(postInfo));
        const postPreview = document.createElement('user-post');
        postPreview.setAttribute('post-id', postInfo.post_id);
        postPreview.setAttribute('preview', 'true');
        wrapper.replaceChildren(postPreview);
        postPreview.querySelector('.button-wrapper').remove();
        postPreview.querySelector('.leave-comment').remove();
        moveToNextView();
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

function getCurrentFormData() {
  const form = document.querySelector('#post-upload');

  const formData = new FormData(form);

  const store_name = formData.get('selected-store-name');
  const store_location = formData.get('selected-store-location');
  const image_url = formData.get('image-url');
  const post_desc = formData.get('post-caption');

  const post_id = 'xxxxxx';
  const post_author = 'Luke Sheltraw';

  const image_items = [...document.querySelectorAll('item-input')].map((itemInput) =>
    ({
      item_name: itemInput.querySelector('.selected-item-name').value,
      item_rating: 5,
      item_x: +itemInput.querySelector('.selected-item-pos-x').value,
      item_y: +itemInput.querySelector('.selected-item-pos-y').value,
    })
  );

  return {
    post_id,
    store_name,
    store_location,
    image_url,
    image_desc: post_desc,
    image_items,
    post_desc,
    post_author,
    likes_count: 0,
    comments_count: 0,
  };
}

function initializeFormListener() {
  const form = document.querySelector('#post-upload');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newPost = getCurrentFormData();
    window.sessionStorage.setItem(newPost.post_id, JSON.stringify(newPost));

    const postElement = document.createElement('user-post');
    postElement.setAttribute('post-id', newPost.post_id);

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
        delete activeButtonElement.dataset.selected
        activeButtonElement = undefined;
        hiddenFieldElementName.value = '';
        hiddenFieldElementLocation.value = '';
        return;
      };
      delete activeButtonElement?.dataset?.selected
      btn.dataset.selected = true;
      activeButtonElement = btn;
      hiddenFieldElementName.value = activeButtonElement.dataset.storename
      hiddenFieldElementLocation.value = activeButtonElement.dataset.storelocation;
    });
  });
}

function initializeItemInterface() {
  const addMoreBtnEl = document.querySelector('#add-more-btn');
  const itemContainerEl = document.querySelector('#current-item-wrapper');

  const itemScreenNextBtnEl = document.querySelector('#item-screen-next');

  const handleItemNextButton = () => {
    if (document.querySelectorAll('item-input').length === 0) {
      itemScreenNextBtnEl.setAttribute('disabled', '');
    } else {
      itemScreenNextBtnEl.removeAttribute('disabled');
    }
  };

  addMoreBtnEl.addEventListener('click', () => {
    const newItemEl = document.createElement('item-input');
    newItemEl.addEventListener('deleted', handleItemNextButton);
    newItemEl.addEventListener('created', handleItemNextButton);
    itemContainerEl.append(newItemEl);
  });
}

export function initPost() {
  initializeUpload();
  initializeNavigationListeners();
  initializeStoreSearch();
  initializeFormListener();
  initializeItemInterface();
}