export default class Brush {
  constructor(isBrush) {
    this.minBrushSize = 5;
    this.maxBrushSize = 25;
    this.selectedSize = 5;
    this.style = 'round';
    this.isBrush = isBrush;
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
