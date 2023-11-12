// function initializeListeners() {
//   document.querySelector('#close-video-button').addEventListener('click', () => {
//     window.history.back();
//   }, { once: true });
// }

// function initializeStream() {
//   const video = document.querySelector('#video-display');
//   const captureButton = document.querySelector('#take-photo-button');

//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: false })
//     .then((stream) => {
//       video.srcObject = stream;
//       video.play();
//     });

//   video.addEventListener('canplay', () => {
//     captureButton.addEventListener('click', () => {
//       takePicture(video);
//     });
//   }, { once: true });
// }

// function takePicture(video) {
//   const canvas = document.querySelector('#video-output-canvas');
//   // const photo = document.querySelector('#photo');

//   const context = canvas.getContext("2d");
//   context.drawImage(video, 0, 0);
//   // const data = canvas.toDataURL("image/png");

//   // photo.setAttribute("src", data);
// }

export function initPost() {
  // initializeListeners();
  // initializeStream();
}