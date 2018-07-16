import { hexToRGBA } from '../utils/color';

export default class IconEvents {
  constructor(canvasController) {
    this.canvasController = canvasController;
    this.burguerIcon = document.getElementById('burguer-icon');
    this.brushIcon = document.getElementById('brush-icon');
    this.eraserIcon = document.getElementById('eraser-icon');
    this.bucketIcon = document.getElementById('bucket-icon');
    this.pickerIcon = document.getElementById('picker-icon');
    this.textIcon = document.getElementById('text-icon');
    this.colorIcon = document.getElementById('color-icon');
    this.clearIcon = document.getElementById('clear-icon');

    this.colorPicker = document.createElement('input');
    this.colorPicker.setAttribute('type', 'color');
  }

  setEvents() {
    this.burguerIcon.addEventListener('click', (event) => {});
    this.brushIcon.addEventListener('click', (event) => { this.selectTool(event, this.brushIcon, 'brush'); });
    this.eraserIcon.addEventListener('click', (event) => { this.selectTool(event, this.eraserIcon, 'eraser'); });
    this.bucketIcon.addEventListener('click', (event) => { this.selectTool(event, this.bucketIcon, 'bucket'); });
    this.pickerIcon.addEventListener('click', (event) => { this.selectTool(event, this.pickerIcon, 'picker'); });
    this.colorIcon.addEventListener('click', (event) => { this.colorPicker.click(); });
    this.colorPicker.addEventListener('change', (event) => { this.changeColor(); });
  }

  selectTool(event, element, tool) {
    event.preventDefault();
    event.stopPropagation();

    IconEvents.closeOpenedSizeMenu();
    IconEvents.removeActiveClass();

    element.firstElementChild.classList.add('tools-menu__icon--active');

    if (tool === 'brush') {
      this.openSizeMenu(element, 'brush');
      return;
    }
    if (tool === 'eraser') {
      this.openSizeMenu(element, 'eraser');
      return;
    }
    if (tool === 'bucket') {
      this.selectBucket();
      return;
    }

    if (tool === 'picker') {
      this.selectPicker();
    }
  }

  openSizeMenu(element, type) {
    if (element.childElementCount > 1) {
      return;
    }

    if (type === 'brush') {
      this.canvasController.selectBrush();
      this.canvasController.selectedTool = 'brush';
    } else {
      this.canvasController.selectEraser();
      this.canvasController.selectedTool = 'eraser';
    }

    this.createSizeMenuElement(element, type);
  }

  selectBucket() {
    this.canvasController.selectedTool = 'bucket';
  }

  selectPicker() {
    this.canvasController.selectedTool = 'picker';
  }

  createSizeMenuElement(element, type) {
    const sizes = [5, 10, 15, 20, 25];
    const divSizeMenu = document.createElement('div');
    divSizeMenu.id = 'size-menu';
    divSizeMenu.classList.add('tools-menu__size-selector');

    divSizeMenu.innerHTML = sizes.map((size, index) => `
    <div class="tools-menu__size-container" data-size="${size}">
        <div class="tools-menu__size--${index + 1}"></div>
    </div>
    `).join('');
    element.appendChild(divSizeMenu);
    document.querySelector(`[data-size='${this.canvasController[type].selectedSize}']`).firstElementChild.classList.add('tools-menu__size--active');
  }

  changeColor() {
    const selectedColorRGBA = hexToRGBA(this.colorPicker.value);
    const selectedColor = `RGBA(${selectedColorRGBA.r},${selectedColorRGBA.g},${selectedColorRGBA.b},${selectedColorRGBA.a})`;
    this.canvasController.selectedColorRGBA = selectedColorRGBA;
    this.canvasController.selectedColor = selectedColor;
    this.canvasController.changeColor();
    document.documentElement.style.setProperty('--selected-color', selectedColor);
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
