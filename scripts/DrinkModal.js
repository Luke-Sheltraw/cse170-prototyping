class DrinkModal extends HTMLElement {
  static observedAttributes = ['open'];

  _dialogElement;
  _lineContainerElement;

  constructor() {
    super();
  }

  connectedCallback() {
    const modalTemplate = document.querySelector('#drink-modal-template');
    const modal = modalTemplate.content.cloneNode(true);
    
    modal.querySelector('.item-name').innerText = this.getAttribute('item-name');

    const rating = modal.querySelector('.stars');
    rating.classList.add(`stars-${ this.getAttribute('item-rating') }`);
    rating.setAttribute('aria-label', `${ this.getAttribute('item-rating') } Stars`);

    this._dialogElement = modal.querySelector('.drink-info-modal');
    this._lineContainerElement = modal.querySelector('.drink-info-svg');
    const lineObject = modal.querySelector('.drink-info-svg line');
    const button = modal.querySelector('.drink-info-button');

    const posX = +this.getAttribute('item-pos-x');
    const posY = +this.getAttribute('item-pos-y');

    const imageRect = this.parentElement.getBoundingClientRect();

    /* position button */
    const buttonX = imageRect.width * posX;
    const buttonY = imageRect.height * posY;

    button.style.left = `${ buttonX }px`;
    button.style.top = `${ buttonY }px`;

    /* position modal */
    const dialogX = imageRect.width * (posX - 0.1);
    const dialogY = imageRect.height * (posY - 0.3);

    this._dialogElement.style.left = `${ dialogX }px`;
    this._dialogElement.style.top = `${ dialogY }px`;

    /* position connecting line */
    this._lineContainerElement.setAttribute('width', imageRect.width);
    this._lineContainerElement.setAttribute('height', imageRect.height);
    this._lineContainerElement.setAttribute('viewBox', `0 0 ${ imageRect.width } ${ imageRect.height }`);

    lineObject.setAttribute('x1', buttonX);
    lineObject.setAttribute('y1', buttonY);
    lineObject.setAttribute('x2', dialogX);
    lineObject.setAttribute('y2', dialogY);

    /* open modal if needed */
    if (this.hasAttribute('open')) {
      this._dialogElement.setAttribute('open', '');
      this._lineContainerElement.classList.remove('hidden');
    }

    /* initialize event listeners */
    button.addEventListener('click', () => {
      if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      } else {
        this.setAttribute('open', '');
      }
    });

    this.appendChild(modal);
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === 'open' && this._dialogElement && this._lineContainerElement) {
      if (newValue !== null) {
        this._dialogElement.setAttribute('open', '');
        this._lineContainerElement.classList.remove('hidden');
      } else {
        this._dialogElement.removeAttribute('open');
        this._lineContainerElement.classList.add('hidden');
      }
    }
  }
}

customElements.define('drink-modal', DrinkModal);