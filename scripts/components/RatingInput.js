class RatingInput extends HTMLElement {
  static observedAttributes = ['name'];

  constructor() {
    super();
  }

  _hiddenInputEl;
  _inputName;
  _currentValue;

  connectedCallback() {
    this._inputName = this.getAttribute('name');
    this._currentValue = -1;

    const starWrapper = document.createElement('div');
    starWrapper.classList.add('star-input-wrapper');

    const stars = [];

    Array.from({ length: 5 }).forEach((_, i) => {
      const star = document.createElement('button');
      star.setAttribute('aria-label', `${ i + 1 } Stars`);
      star.setAttribute('type', 'button');
      stars.push(star);
    });

    stars.forEach((star, i) => {
      star.addEventListener('click', () => {
        if (this._currentValue === -1) {
          this.dispatchEvent(new CustomEvent('starselected'));
        }
        this._currentValue = i + 1;
        this._hiddenInputEl.value = this._currentValue;
        stars.forEach((otherStar, j) => {
          if (j <= i) otherStar.dataset.selected = true;
          else otherStar.removeAttribute('data-selected');
        });
      });
      starWrapper.append(star);
    });

    this._hiddenInputEl = document.createElement('input');
    this._hiddenInputEl.setAttribute('type', 'hidden');
    this._hiddenInputEl.setAttribute('name', this._inputName);

    this.replaceChildren(starWrapper, this._hiddenInputEl);
  }

  attributeChangedCallback(name, _, newValue) {
    if (name !== 'name') return;
    this._inputName = newValue;
    if (!this._hiddenInputEl) return;
    this._hiddenInputEl.setAttribute('name', this._inputName);
  }
}

customElements.define('rating-input', RatingInput);