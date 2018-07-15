import Brush from './brush';
import CanvasEvents from './canvasEvents';

export default class CanvasController {
  constructor(socket) {
    this.brush = new Brush();
    this.eraser = new Brush();
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvasContainer = this.canvas.parentElement;

    this.selectedTool = 'brush';

    this.drawing = false;

    this.resizeCanvas();
    this.initializeContext();
    this.setEvents();

    this.currentX = null;
    this.currentY = null;
    this.previousX = null;
    this.previousY = null;

    this.events = new CanvasEvents(socket);
  }

  setCanvasStyle(width, height) {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  resizeCanvas() {
    this.width = this.canvasContainer.clientWidth;
    this.height = (this.width / 16) * 9;

    this.setCanvasStyle(this.width, this.height);

    this.canvasContainer.style.height = `${this.height}px`;
  }

  initializeContext() {
    this.selectBrush();
  }

  selectBrush(brush = this.brush) {
    this.context.globalCompositeOperation = 'source-over';
    this.context.strokeStyle = brush.color;
    this.context.lineWidth = brush.selectedSize;
    this.context.lineCap = brush.style;
    this.context.lineJoin = brush.style;
  }

  selectEraser(eraser = this.eraser) {
    this.context.globalCompositeOperation = 'destination-out';
    this.context.strokeStyle = eraser.color;
    this.context.lineWidth = eraser.selectedSize;
    this.context.lineCap = eraser.style;
    this.context.lineJoin = eraser.style;
  }

  selectBucket() {
    this.context.globalCompositeOperation = 'source-over';
  }

  setPositions(x, y) {
    this.previousX = this.currentX;
    this.previousY = this.currentY;

    const BB = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / BB.width;
    const scaleY = this.canvas.height / BB.height;

    this.currentX = (x - BB.left) * scaleX;
    this.currentY = (y - BB.top) * scaleY;
  }

  draw(firstClick) {
    if (this.selectedTool === 'bucket') {
      const position = [this.currentX, this.currentY];
      const clickedPixel = this.context.getImageData(this.currentX, this.currentY, 1, 1).data;
      const selectedColor = this.brush.color;
      floodFill(this.context, position, clickedPixel, selectedColor);
      return;
    }

    if (this.selectedTool === 'picker') {
      this.getColor();
      return;
    }

    this.context.beginPath();
    if (!firstClick) {
      this.context.moveTo(this.previousX, this.previousY);
    }
    this.context.lineTo(this.currentX, this.currentY);
    this.context.stroke();
  }

  drawFromSocket(data) {
    this.selectBrush(data.brush);

    this.context.moveTo(data.path[0].x, data.path[0].y);

    if (data.path.length === 1) {
      this.context.lineTo(data.path[0].x, data.path[0].y);
      this.context.stroke();
      return;
    }

    for (let i = 1; i < data.path.length; i += 1) {
      this.context.lineTo(data.path[i].x, data.path[i].y);
    }
    this.context.stroke();

    this.selectBrush();
  }

  getColor() {
    const pixel = this.context.getImageData(this.currentX, this.currentY, 1, 1).data;
    const rgba = {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3],
    };
    // line.color = colorDiv.style.backgroundColor = "RGBA("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", 255)";
    // colorInput.value = rgbToHex(pixel[0], pixel[1], pixel[2]);
    // btnPincel.click();
  }

  setEvents() {
    this.canvas.addEventListener('mousedown', (event) => { this.events.clickStartHandler(event, this); });
    this.canvas.addEventListener('touchstart', (event) => { this.events.touchStartHandler(event, this); });

    this.canvas.addEventListener('mouseup', (event) => { this.events.stopDrawing(event, this); });
    this.canvas.addEventListener('mouseout', (event) => { this.events.stopDrawing(event, this); });
    this.canvas.addEventListener('touchend', (event) => { this.events.stopDrawing(event, this); });
    this.canvas.addEventListener('touchcancel', (event) => { this.events.stopDrawing(event, this); });

    this.canvas.addEventListener('mousemove', (event) => { this.events.mouseMoveHandler(event, this); });
    this.canvas.addEventListener('touchmove', (event) => { this.events.toucheMoveHandler(event, this); });
  }
}
