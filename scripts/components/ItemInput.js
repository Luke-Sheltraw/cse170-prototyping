class ItemInput extends HTMLElement {
  _modalWrapper;
  _imageEl;
  _itemName;
  _drinkModal;
  
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
      delete currentModalEl.dataset.active;
      targetedModalEl.dataset.active = true;
      currentModalEl = targetedModalEl;
    };
  
    itemSelectButtonEl.addEventListener('click', () => handleModalSwitch(itemSelectModalEl));
    itemLocationButtonEl.addEventListener('click', () => handleModalSwitch(itemLocationModalEl));

    /* Open and close popover */
    discardItemBtnEl.addEventListener('click', () => {
      this.remove();
      this.dispatchEvent(new CustomEvent('deleted'));
    });

    const handleItemCreation = () => {
      this._modalWrapper.removeAttribute('open');
      discardItemBtnEl.classList.add('destructive-button');
      discardItemBtnEl.innerText = 'Delete';
      addItemBtnEl.innerText = 'Update';
      this.dispatchEvent(new CustomEvent('created'));
    }

    addItemBtnEl.addEventListener('click', handleItemCreation);

    previewContainerEl.addEventListener('click', () => {
      currentModalEl = itemLocationModalEl;
      delete itemSelectModalEl.dataset.active;
      itemLocationModalEl.dataset.active = true;
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
          itemLocationButtonEl.setAttribute('disabled', '');
          addItemBtnEl.setAttribute('disabled', '');
          return;
        };
        activeButtonEl?.removeAttribute('data-selected');
        btn.dataset.selected = true;
        activeButtonEl = btn;
        this._itemName = activeButtonEl.getAttribute('data-itemname');
        hiddenItemInputEl.value = this._itemName;
        this.querySelectorAll('.replace-w-item-name').forEach((el) => {
          el.innerText = this._itemName;
        });
        itemSelectButtonEl.querySelector('h3').innerText = `Selected: ${ this._itemName }`;
        itemLocationButtonEl.removeAttribute('disabled');
        if (this._drinkModal) {
          this._drinkModal.setAttribute('item-name', this._itemName);
          addItemBtnEl.removeAttribute('disabled');
        }
        handleModalSwitch(itemLocationModalEl);
      });
    });

    /* Tagging location in image */
    const hiddenXEl = this.querySelector('.selected-item-pos-x');
    const hiddenYEl = this.querySelector('.selected-item-pos-y');

    this._imageEl.addEventListener('click', (e) => {
      const imageBox = this._imageWrapper.getBoundingClientRect();

      const dX = e.clientX - imageBox.left;
      const dY = e.clientY - imageBox.top;
      
      const ratioX = dX / imageBox.width;
      const ratioY = dY / imageBox.height;

      if (!this._drinkModal) {
        this._drinkModal = document.createElement('drink-modal');
      }

      this._drinkModal.setAttribute('item-name', this._itemName);
      this._drinkModal.setAttribute('link-disabled', '');
      this._drinkModal.setAttribute('item-rating', 5);
      this._drinkModal.setAttribute('item-pos-x', ratioX);
      this._drinkModal.setAttribute('item-pos-y', ratioY);
      this._drinkModal.setAttribute('open', '');

      hiddenXEl.value = ratioX;
      hiddenYEl.value = ratioY;

      if (!this._imageWrapper.contains(this._drinkModal)) {
        this._imageWrapper.append(this._drinkModal);
        addItemBtnEl.removeAttribute('disabled');
      }
    });
  }
}

customElements.define('item-input', ItemInput);