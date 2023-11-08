function enableButtonListeners() {
  let currentActiveElement = document.querySelector('.footer__button__active');

  document.querySelectorAll('.footer__button').forEach((el) => {
    el.addEventListener('click', () => {
      if (el === currentActiveElement) return;
      currentActiveElement?.classList?.remove('footer__button__active');
      el.classList.add('footer__button__active');
      currentActiveElement = el;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  enableButtonListeners();
});