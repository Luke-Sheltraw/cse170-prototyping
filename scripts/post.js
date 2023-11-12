function initializeUpload() {
  const imageUpload = document.querySelector('#image-upload');
  const imagePreview = document.querySelector('#image-preview');

  const fileReader = new FileReader();

  fileReader.addEventListener('loadend', (e) => {
    const encoding = e.target.result;

    imagePreview.src = encoding;
    imagePreview.classList.remove('hidden');
  });

  imageUpload.addEventListener('change', () => {
    fileReader.readAsDataURL(imageUpload.files[0]);
  });
}

export function initPost() {
  initializeUpload();
}