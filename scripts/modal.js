const position = [ 0.47, 0.73 ];

function positionModalInformation() {
  const button = document.querySelector('.drink-info-button');
  const modal = document.querySelector('.drink-info-modal');
  const lineContainer = document.querySelector('#drink1-button-line');
  const lineObject = document.querySelector('#drink1-button-line line');

  const imageRect = document.querySelector('.image-wrapper').getBoundingClientRect();

  /* position button */
  const buttonX = imageRect.width * position[0];
  const buttonY = imageRect.height * position[1];

  button.style.left = `${ buttonX }px`;
  button.style.top = `${ buttonY }px`;

  /* position modal */
  const modalX = imageRect.width * (position[0] - 0.1);
  const modalY = imageRect.height * (position[1] - 0.3);

  modal.style.left = `${ modalX }px`;
  modal.style.top = `${ modalY }px`;

  /* position connecting line */
  lineContainer.setAttribute('width', imageRect.width);
  lineContainer.setAttribute('height', imageRect.height);
  lineContainer.setAttribute('viewBox', `0 0 ${ imageRect.width } ${ imageRect.height }`);

  lineObject.setAttribute('x1', buttonX);
  lineObject.setAttribute('y1', buttonY);
  lineObject.setAttribute('x2', modalX);
  lineObject.setAttribute('y2', modalY);
}

function enableModalButtonListeners() {
  const button = document.querySelector('.drink-info-button');
  const modal = document.querySelector('.drink-info-modal');
  const lineContainer = document.querySelector('#drink1-button-line');

  button.addEventListener('click', () => {
    modal.classList.toggle('hidden');
    lineContainer.classList.toggle('hidden');
  });
}

window.addEventListener('resize', () => {
  positionModalInformation();
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(positionModalInformation, 150);
  enableModalButtonListeners();
});