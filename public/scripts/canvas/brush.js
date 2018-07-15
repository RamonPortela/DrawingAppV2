export default class Brush {
  constructor() {
    this.minBrushSize = 5;
    this.maxBrushSize = 25;
    this.selectedSize = 5;
    this.color = 'black';
    this.style = 'round';
  }

  changeSize(size) {
    if (size < this.minBrushSize || size > this.maxBrushSize) {
      return;
    }
    this.selectedSize = size;
  }

  changeColor(color) {
    this.color = color;
  }
}
