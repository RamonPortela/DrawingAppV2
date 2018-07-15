export default class IconEvents {
  constructor(canvasController) {
    this.canvasController = canvasController;
    this.burguerIcon = document.getElementById('burguer-icon');
    this.brushIcon = document.getElementById('brush-icon');
    this.eraserIcon = document.getElementById('eraser-icon');
    this.bucketIcon = document.getElementById('bucket-icon');
    this.pickerIcon = document.getElementById('picker-icon');
    this.textIcon = document.getElementById('text-icon');
    this.colorIcon = document.getElementById('icon-color');
    this.clearIcon = document.getElementById('clear-icon');
  }

  setEvents() {
    this.burguerIcon.addEventListener('click', (event) => {});
    this.brushIcon.addEventListener('click', (event) => { this.openSizeMenus(event, 'brush'); });
    this.eraserIcon.addEventListener('click', (event) => { this.openSizeMenus(event, 'eraser'); });
  }

  openSizeMenus(event, tool) {
    event.preventDefault();
    event.stopPropagation();

    IconEvents.closeOpenedSizeMenu();
    IconEvents.removeActiveClass();

    if (tool === 'brush') {
      this.activeSizeMenu(this.brushIcon, 'brush');
    } else {
      this.activeSizeMenu(this.eraserIcon, 'eraser');
    }
  }

  activeSizeMenu(element, type) {
    if (element.childElementCount > 1) {
      return;
    }
    element.firstElementChild.classList.add('tools-menu__icon--active');
    if (type === 'brush') { this.canvasController.selectBrush(); } else { this.canvasController.selectEraser(); }

    this.createSizeMenuElement(element, type);
  }

  createSizeMenuElement(element, type) {
    const sizes = [5, 10, 15, 20, 25];
    const divSizeMenu = document.createElement('div');
    divSizeMenu.id = 'size-menu';
    divSizeMenu.classList.add('tools-menu__size-selector');

    divSizeMenu.innerHTML = sizes.map((size, index) => `
    <div class="tools-menu__size-container" data-size="${size}">
        <div class="tools-menu__size--${index + 1} ${this.canvasController[type].selectedSize === size ? 'tools-menu__size--active' : ''}"></div>
    </div>
    `).join('');

    element.appendChild(divSizeMenu);
  }

  static closeOpenedSizeMenu() {
    const sizeMenu = document.getElementById('size-menu');
    if (sizeMenu !== null) {
      sizeMenu.remove();
    }
  }

  static removeActiveClass() {
    const icons = document.querySelectorAll('.tools-menu__icon');
    icons.forEach((element) => {
      element.classList.remove('tools-menu__icon--active');
    });
  }
}
