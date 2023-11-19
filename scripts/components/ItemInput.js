class ItemInput extends HTMLElement {
  _modalWrapper;
  
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.querySelector('#item-input-template');

    const itemChooser = template.content.cloneNode(true);

    this.append(itemChooser);

    this._modalWrapper = this.querySelector('dialog');

    const itemSelectModalEl = this.querySelector('.item-select-modal');
    const itemSelectButtonEl = this.querySelector('.item-select-modal-opener');
  
    const itemLocationModalEl = this.querySelector('.item-loc-modal');
    const itemLocationButtonEl = this.querySelector('.item-loc-modal-opener');

    const discardItemBtnEl = this.querySelector('.discard-item-button');
    const addItemBtnEl = this.querySelector('.add-item-button');
  
    const previewContainerEl = this.querySelector('.item-preview-container');

    let currentModalEl = itemSelectModalEl;
  
    const handleModalSwitch = (targetedModalEl) => {
      if (targetedModalEl === currentModalEl) return;
      currentModalEl.removeAttribute('data-active');
      targetedModalEl.setAttribute('data-active', '');
      currentModalEl = targetedModalEl;
    };
  
    itemSelectButtonEl.addEventListener('click', () => handleModalSwitch(itemSelectModalEl));
    itemLocationButtonEl.addEventListener('click', () => handleModalSwitch(itemLocationModalEl));

    discardItemBtnEl.addEventListener('click', () => {
      this.remove();
    });

    const handleItemCreation = () => {
      this._modalWrapper.removeAttribute('open');
      discardItemBtnEl.classList.add('destructive-button');
      addItemBtnEl.innerText = 'Save item';
    }

    addItemBtnEl.addEventListener('click', handleItemCreation);

    previewContainerEl.addEventListener('click', () => {
      currentModalEl = itemLocationModalEl;
      itemSelectModalEl.removeAttribute('data-active');
      itemLocationModalEl.setAttribute('data-active', '');
      this._modalWrapper.setAttribute('open', '');
    });
  }
}

customElements.define('item-input', ItemInput);