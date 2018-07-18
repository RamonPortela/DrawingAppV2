import Brush from './brush';
import CanvasEvents from './canvasEvents';
import floodFill from './bucket';
import IconEvents from '../DOM/IconEvents';
import { rgbToHex } from '../utils/color';

export default class CanvasController {
  constructor(socket) {
    this.brush = new Brush(true);
    this.eraser = new Brush(false);
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvasContainer = this.canvas.parentElement;
    this.btnUndo = document.getElementById('btn-undo');
    this.btnRedo = document.getElementById('btn-redo');

    this.selectedTool = 'brush';
    this.selectedColor = 'black';
    this.selectedColorRGBA = {
      r: 0, g: 0, b: 0, a: 255,
    };

    this.drawing = false;

    this.resizeCanvas();
    this.setEvents();

    this.currentX = null;
    this.currentY = null;
    this.previousX = null;
    this.previousY = null;
    this.previousDrawing = null;
    this.currentDrawing = null;

    this.events = new CanvasEvents(socket);
    this.iconEvents = new IconEvents(this);
    this.iconEvents.setEvents();
  }

  setCanvasStyle(width, height) {
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  resizeCanvas() {
    this.width = this.canvasContainer.clientWidth;
    this.height = Math.floor((this.width / 16) * 9);

    this.setCanvasStyle(this.width, this.height);

    this.canvasContainer.style.height = `${this.height}px`;
  }

  selectBrush(brush = this.brush) {
    this.context.globalCompositeOperation = 'source-over';
    this.context.strokeStyle = brush.selectedColor || this.selectedColor;
    this.context.lineWidth = brush.selectedSize;
    this.context.lineCap = brush.style;
    this.context.lineJoin = brush.style;
  }

  selectEraser(eraser = this.eraser) {
    this.context.globalCompositeOperation = 'destination-out';
    this.context.lineWidth = eraser.selectedSize;
    this.context.lineCap = eraser.style;
    this.context.lineJoin = eraser.style;
  }

  changeBrushValues(newValues) {
    this.brush = Object.assign(this.brush, newValues);
    this.selectBrush();
  }

  changeEraserValues(newValues) {
    this.eraser = Object.assign(this.eraser, newValues);
    this.selectEraser();
  }

  changeColor() {
    this.context.strokeStyle = this.selectedColor;
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
      floodFill(this.context, position, clickedPixel, this.selectedColorRGBA, this.canvas);
      return;
    }

    if (this.selectedTool === 'picker') {
      this.getColor();
      return;
    }

    if (this.selectedTool === 'brush') { this.selectBrush(); } else { this.selectEraser(); }

    this.context.beginPath();
    if (!firstClick) {
      this.context.moveTo(this.previousX, this.previousY);
    }
    this.context.lineTo(this.currentX, this.currentY);
    this.context.stroke();
  }

  drawFromSocket(data) {
    this.context.beginPath();
    this.context.moveTo(data.path[0].x, data.path[0].y);

    if (data.path.length === 1) {
      if (data.brush.isBrush) { this.selectBrush(data.brush); } else { this.selectEraser(data.brush); }
      this.context.lineTo(data.path[0].x, data.path[0].y);
      this.context.stroke();
      return;
    }

    for (let i = 1; i < data.path.length; i += 1) {
      if (data.brush.isBrush) { this.selectBrush(data.brush); } else { this.selectEraser(data.brush); }
      this.context.lineTo(data.path[i].x, data.path[i].y);
    }
    this.context.stroke();
  }

  floodFillFromSocket(data) {
    const { position } = data;
    const clickedPixel = this.context.getImageData(position[0], position[1], 1, 1).data;
    floodFill(this.context, position, clickedPixel, data.selectedColor, this.canvas);
  }

  getColor() {
    const pixel = this.context.getImageData(this.currentX, this.currentY, 1, 1).data;
    const rgba = {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3],
    };

    this.selectedColorRGBA = rgba;
    this.selectedColor = `RGBA(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    const { r, g, b } = this.selectedColorRGBA;
    this.iconEvents.colorPicker.value = rgbToHex(r, g, b);
    this.iconEvents.colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
    this.iconEvents.brushIcon.click();

    // line.color = colorDiv.style.backgroundColor = "RGBA("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", 255)";
    // colorInput.value = rgbToHex(pixel[0], pixel[1], pixel[2]);
    // btnPincel.click();
  }

  setImage(image, clear = false) {
    if (clear) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    if (image === null) {
      return;
    }

    const baseImage = new Image();
    baseImage.src = image;
    baseImage.onload = () => {
      const currentGlobalCompositeOperation = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = 'source-over';
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(baseImage, 0, 0, this.canvas.width, this.canvas.height);
      this.context.globalCompositeOperation = currentGlobalCompositeOperation;
    };
  }

  clearCanvas() {
    this.previousDrawing = this.canvas.toDataURL();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentDrawing = this.canvas.toDataURL();
    this.events.clearCanvas(this);
  }

  setEvents() {
    this.btnUndo.addEventListener('mousedown', (event) => { this.events.undo(event); });
    this.btnRedo.addEventListener('mousedown', (event) => { this.events.redo(event); });
    this.btnUndo.addEventListener('touchstart', (event) => { this.events.undo(event); });
    this.btnRedo.addEventListener('touchstart', (event) => { this.events.redo(event); });

    this.canvasContainer.addEventListener('mousedown', (event) => { this.events.clickStartHandler(event, this); });
    this.canvasContainer.addEventListener('touchstart', (event) => { this.events.touchStartHandler(event, this); });

    this.canvasContainer.addEventListener('mouseup', (event) => { this.events.stopDrawing(event, this); });
    this.canvasContainer.addEventListener('mouseout', (event) => { this.events.stopDrawing(event, this); });
    this.canvasContainer.addEventListener('touchend', (event) => { this.events.stopDrawing(event, this); });
    this.canvasContainer.addEventListener('touchcancel', (event) => { this.events.stopDrawing(event, this); });

    this.canvasContainer.addEventListener('mousemove', (event) => { this.events.mouseMoveHandler(event, this); });
    this.canvasContainer.addEventListener('touchmove', (event) => { this.events.toucheMoveHandler(event, this); });
  }
}
