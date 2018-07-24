import { hexToRGBA } from '../utils/color';
import FreeHandTool from '../canvas/tools/freeHandTool';
import Brush from '../canvas/tools/brush';

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
    this.brushIcon.addEventListener('click', (event) => { this.selectTool(event, this.brushIcon, this.canvasController.tools.brush); });
    this.eraserIcon.addEventListener('click', (event) => { this.selectTool(event, this.eraserIcon, this.canvasController.tools.eraser); });
    this.bucketIcon.addEventListener('click', (event) => { this.selectTool(event, this.bucketIcon, 'bucket'); });
    this.pickerIcon.addEventListener('click', (event) => { this.selectTool(event, this.pickerIcon, 'picker'); });
    this.colorIcon.addEventListener('click', (event) => { this.colorPicker.click(); });
    this.colorPicker.addEventListener('change', (event) => { this.changeColor(); });
    this.clearIcon.addEventListener('click', (event) => { this.selectTool(event, this.clearIcon, 'clear'); });
  }

  selectTool(event, element, tool) {
    event.preventDefault();
    event.stopPropagation();

    IconEvents.closeOpenedSizeMenu();
    IconEvents.removeActiveClass();

    element.firstElementChild.classList.add('tools-menu__icon--active');

    if (tool instanceof FreeHandTool) {
      this.openSizeMenu(element, tool);
      return;
    }

    this.canvasController.selectTool(tool);

    // if (tool === 'bucket') {
    //   this.selectBucket();
    //   return;
    // }

    // if (tool === 'picker') {
    //   this.selectPicker();
    //   return;
    // }

    this.clearCanvas();
    this.brushIcon.click();
  }

  openSizeMenu(element, tool) {
    if (element.childElementCount > 1) {
      return;
    }
    this.canvasController.selectTool(tool);
    IconEvents.createSizeMenuElement(element, tool);
  }

  // selectBucket() {
  //   this.canvasController.selectedTool = 'bucket';
  // }

  // selectPicker() {
  //   this.canvasController.selectedTool = 'picker';
  // }

  clearCanvas() {
    this.canvasController.clearCanvas();
  }

  static createSizeMenuElement(element, tool) {
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
    document.querySelector(`[data-size='${tool.selectedSize}']`).firstElementChild.classList.add('tools-menu__size--active');
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
