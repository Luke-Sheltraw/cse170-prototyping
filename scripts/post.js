import { loadView } from './router.js';

function initializeUpload() {
  const imageUpload = document.querySelector('#image-upload');
  const imageUrl = document.querySelector('#image-url');
  const imagePreview = document.querySelector('#image-preview');

  const fileReader = new FileReader();

  fileReader.addEventListener('loadend', (e) => {
    const encoding = e.target.result;

    imagePreview.src = encoding;
    imageUrl.value = encoding;

    imagePreview.classList.remove('hidden');
  });

  imageUpload.addEventListener('change', () => {
    fileReader.readAsDataURL(imageUpload.files[0]);
  });
}

function initializeButtonListeners() {
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

  nextButtons.forEach((btn) => 
    btn.addEventListener('click', () => {
      if (currentView >= viewList.length - 1) return;
      viewList[currentView].setAttribute('data-active', 'false');
      viewList[currentView + 1].setAttribute('data-active', 'true');
      currentView += 1;
    }
  ));

  viewList.forEach((viewElement) => {
    const requiredFields = viewElement.querySelectorAll('.required-input');
    const nextButton = viewElement.querySelector('.next-button');

    if (nextButton === null) return;
    if (requiredFields.length === 0) nextButton.disabled = false;

    const populatedFields = [];

    requiredFields.forEach((requiredField) => {
      requiredField.addEventListener('input', (e) => {
        if (requiredField.value) {
          if (!populatedFields.includes(requiredField))
            populatedFields.push(requiredField);
        } else {
          if (populatedFields.includes(requiredField))
            populatedFields.splice(populatedFields.indexOf(requiredField), 1);
        }

        if (populatedFields.length === requiredFields.length) {
          nextButton.disabled = false;
        } else {
          nextButton.disabled = true;
        }
      });
    });
  });
}

function initializeFormListener() {
  const form = document.querySelector('#post-upload');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const store_name = formData.get('search-stores');
    const store_location = 'User City, ST';
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

export function initPost() {
  initializeUpload();
  initializeButtonListeners();
  initializeFormListener();
}