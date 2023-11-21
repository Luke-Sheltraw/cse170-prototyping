import { loadView } from '../router.js';

class DrinkModal extends HTMLElement {
  static observedAttributes = ['open', 'item-pos-x', 'item-pos-y', 'item-name'];

  _dialogElement;
  _lineContainerElement;
  _lineObject;
  _button;

  _posX;
  _posY;
  _itemName;

  constructor() {
    super();
  }

  connectedCallback() {
    const modalTemplate = document.querySelector('#drink-modal-template');
    const modal = modalTemplate.content.cloneNode(true);

    const rating = modal.querySelector('.stars');
    rating.classList.add(`stars-${ this.getAttribute('item-rating') }`);
    rating.setAttribute('aria-label', `${ this.getAttribute('item-rating') } Stars`);

    this._dialogElement = modal.querySelector('.drink-info-modal');
    this._lineContainerElement = modal.querySelector('.drink-info-svg');
    this._lineObject = modal.querySelector('.drink-info-svg line');
    this._button = modal.querySelector('.drink-info-button');

    this._posX = +this.getAttribute('item-pos-x');
    this._posY = +this.getAttribute('item-pos-y');
    this._itemName = this.getAttribute('item-name');

    modal.querySelector('.item-name').innerText = this._itemName;

    /* open modal if needed */
    if (this.hasAttribute('open')) {
      this._dialogElement.setAttribute('open', '');
      this._lineContainerElement.classList.remove('hidden');
    }

    /* initialize event listeners */
    this._button.addEventListener('click', () => {
      if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      } else {
        this.setAttribute('open', '');
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      this._positionModal();
    });

    resizeObserver.observe(this.parentElement);

    this._initializeRouting();

    this.appendChild(modal);
  }

  _positionModal() {
    if (!this.parentElement) return;
    const imageRect = this.parentElement.getBoundingClientRect();

    /* position button */
    const buttonX = imageRect.width * this._posX;
    const buttonY = imageRect.height * this._posY;

    this._button.style.left = `${ buttonX }px`;
    this._button.style.top = `${ buttonY }px`;

    /* position modal */
    const dialogX = imageRect.width * (this._posX + (this._posX < 0.5 ? 1 : -1) * 0.1);
    const dialogY = imageRect.height * (this._posY + (this._posY < 0.5 ? 1 : -1) * 0.3);

    this._dialogElement.style.left = `${ dialogX }px`;
    this._dialogElement.style.top = `${ dialogY }px`;

    /* position connecting line */
    this._lineContainerElement.setAttribute('width', imageRect.width);
    this._lineContainerElement.setAttribute('height', imageRect.height);
    this._lineContainerElement.setAttribute('viewBox', `0 0 ${ imageRect.width } ${ imageRect.height }`);

    this._lineObject.setAttribute('x1', buttonX);
    this._lineObject.setAttribute('y1', buttonY);
    this._lineObject.setAttribute('x2', dialogX);
    this._lineObject.setAttribute('y2', dialogY);
  }

  _initializeRouting() {
    const itemButton = this._dialogElement.querySelector('button');
    itemButton.addEventListener('click', () => {
      loadView(`/shop/store1/${ this._itemName.replace(' ', '-').toLowerCase() }`);
    });
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === 'open') {
      if (!this._dialogElement || !this._lineContainerElement) return;
      if (newValue !== null) {
        this._dialogElement.setAttribute('open', '');
        this._lineContainerElement.classList.remove('hidden');
        this.dispatchEvent(new CustomEvent('modal-opened'));
      } else {
        this._dialogElement.removeAttribute('open');
        this._lineContainerElement.classList.add('hidden');
      }
    } else if (name === 'item-pos-x' || name === 'item-pos-y') {
      if (name === 'item-pos-x') this._posX = +newValue;
      else if (name === 'item-pos-y') this._posY = +newValue;
      this._positionModal();
    } else if (name === 'item-name') {
      this._itemName = newValue;
      if (!this._dialogElement) return;
      this._dialogElement.querySelector('.item-name').innerText = this._itemName;
    }
  }
}

customElements.define('drink-modal', DrinkModal);
