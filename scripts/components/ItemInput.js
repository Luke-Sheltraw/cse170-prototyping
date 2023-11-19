class ItemInput extends HTMLElement {
  _modalWrapper;
  _imageEl;
  _itemName;
  
  constructor() {
    super();
  }

  connectedCallback() {
    /* Creation */
    const template = document.querySelector('#item-input-template');
    const itemChooser = template.content.cloneNode(true);
    this.append(itemChooser);
    this._modalWrapper = this.querySelector('dialog');
    this._imageWrapper = this.querySelector('.image-wrapper');
    this._imageEl = this._imageWrapper.querySelector('img');

    const imageUrl = document.querySelector('#image-url').value;
    this._imageEl.src = imageUrl;

    /* Open & close item selection and item tagging menus */
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

    /* Open and close popover */
    discardItemBtnEl.addEventListener('click', () => {
      this.remove();
    });

    const handleItemCreation = () => {
      this._modalWrapper.removeAttribute('open');
      discardItemBtnEl.classList.add('destructive-button');
      discardItemBtnEl.innerText = 'Delete';
      addItemBtnEl.innerText = 'Save item';
    }

    addItemBtnEl.addEventListener('click', handleItemCreation);

    previewContainerEl.addEventListener('click', () => {
      currentModalEl = itemLocationModalEl;
      itemSelectModalEl.removeAttribute('data-active');
      itemLocationModalEl.setAttribute('data-active', '');
      this._modalWrapper.setAttribute('open', '');
    });

    /* Select suggested item */
    const suggestedOptionEls = this.querySelectorAll('.suggested-search-items button');
    const hiddenItemInputEl = this.querySelector('.selected-item-name');
    let activeButtonEl;

    suggestedOptionEls.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn === activeButtonEl) {
          activeButtonEl.removeAttribute('data-selected');
          activeButtonEl = undefined;
          hiddenItemInputEl.value = '';
          return;
        };
        activeButtonEl?.removeAttribute('data-selected');
        btn.setAttribute('data-selected', '');
        activeButtonEl = btn;
        this._itemName = activeButtonEl.getAttribute('data-itemname');
        hiddenItemInputEl.value = this._itemName;
        this.querySelectorAll('.replace-w-item-name').forEach((el) => {
          el.innerText = this._itemName;
        });
        itemSelectButtonEl.querySelector('h3').innerText = `Selected: ${ this._itemName }`;
        handleModalSwitch(itemLocationModalEl);
      });
    });

    /* Tagging location in image */
    this._imageEl.addEventListener('click', (e) => {
      const imageBox = this._imageWrapper.getBoundingClientRect();

      const dX = e.clientX - imageBox.left;
      const dY = e.clientY - imageBox.top;
      
      const ratioX = dX / imageBox.width;
      const ratioY = dY / imageBox.height;

      const modal = document.createElement('drink-modal');

      modal.setAttribute('item-name', this._itemName);
      modal.setAttribute('item-rating', 5);
      modal.setAttribute('item-pos-x', ratioX);
      modal.setAttribute('item-pos-y', ratioY);

      this._imageWrapper.append(modal);
    });
  }
}

customElements.define('item-input', ItemInput);