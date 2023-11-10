class DrinkModal extends HTMLElement {
  static observedAttributes = ['open'];

  _dialogElement;
  _lineContainerElement;
  _lineObject;
  _button;

  _posX;
  _posY;

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
    this._lineObject = modal.querySelector('.drink-info-svg line');
    this._button = modal.querySelector('.drink-info-button');

    this._posX = +this.getAttribute('item-pos-x');
    this._posY = +this.getAttribute('item-pos-y');

    setTimeout(() => this._positionModal(), 100); // TODO: fix this

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

    this.appendChild(modal);

    window.addEventListener('resize', this._positionModal.bind(this), { passive: true });
  }

  _positionModal() {
    const imageRect = this.parentElement.getBoundingClientRect();

    /* position button */
    const buttonX = imageRect.width * this._posX;
    const buttonY = imageRect.height * this._posY;

    this._button.style.left = `${ buttonX }px`;
    this._button.style.top = `${ buttonY }px`;

    /* position modal */
    const dialogX = imageRect.width * (this._posX - 0.1);
    const dialogY = imageRect.height * (this._posY - 0.3);

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

  attributeChangedCallback(name, _, newValue) {
    if (name === 'open' && this._dialogElement && this._lineContainerElement) {
      if (newValue !== null) {
        this._dialogElement.setAttribute('open', '');
        this._lineContainerElement.classList.remove('hidden');
        this.dispatchEvent(new CustomEvent('modal-opened'));
      } else {
        this._dialogElement.removeAttribute('open');
        this._lineContainerElement.classList.add('hidden');
      }
    }
  }
}

customElements.define('drink-modal', DrinkModal);