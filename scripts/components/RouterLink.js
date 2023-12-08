import { loadView } from './../router.js';

class RouterLink extends HTMLElement {
  _href;
  _displayBackButton;

  constructor() {
    super();
  }

  connectedCallback() {
    this._href = this.getAttribute('href');
    this._displayBackButton = this.getAttribute('display-back-button') ?? false;

    const aEl = document.createElement('a');

    [...this.attributes].forEach(({ name, value }) => aEl.setAttribute(name, value));

    aEl.replaceChildren(...this.childNodes);
    aEl.addEventListener('click', (e) => {
      e.preventDefault();
      loadView(this._href,
        {
          displayBackButton: this._displayBackButton,
        }
      );
    });
    this.replaceWith(aEl);
  }
}

window.customElements.define('router-link', RouterLink);