import CanvasEvents from './canvasEvents';
import floodFill from './bucket';
import IconEvents from '../DOM/IconEvents';
import { rgbToHex } from '../utils/color';
import Brush from './tools/FreeHandTools/brush';
import Eraser from './tools/FreeHandTools/eraser';
import Bucket from './tools/bucket/bucket';
import ColorPicker from './tools/picker/picker';

export default class CanvasController {
  constructor(socket) {
    this.tools = {
      brush: new Brush(),
      eraser: new Eraser(),
      bucket: new Bucket(),
      picker: new ColorPicker(),
    };

    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvasContainer = this.canvas.parentElement;

    this.selectedTool = this.tools.brush;
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

    this.events = new CanvasEvents();
    this.iconEvents = new IconEvents(this);
    this.iconEvents.setEvents();

    this.socket = socket;
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

  selectTool(tool = null) {
    if (tool) {
      this.selectedTool = tool;
      this.selectedTool.selectedColor = this.selectedColor;
    }
    this.setContextStyle(this.selectedTool);
  }

  selectToolSocket(tool) {
    this.setContextStyle(tool);
  }

  setContextStyle(tool) {
    this.context.globalCompositeOperation = tool.compositeOperation;
    this.context.strokeStyle = tool.selectedColor || this.selectedColor;
    this.context.lineWidth = tool.selectedSize;
    this.context.lineCap = tool.style;
    this.context.lineJoin = tool.style;
  }

  changeToolSize(newSize) {
    this.selectedTool.changeSize(newSize);
  }

  changeColor() {
    this.context.strokeStyle = this.selectedColor;
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

  drawFromSocket(data) {
    const type = data.isBrush ? new Brush() : new Eraser();
    const brush = Object.assign(type, data.brush);

    this.context.beginPath();
    this.context.moveTo(data.path[0].x, data.path[0].y);

    this.selectToolSocket(brush);
    if (data.path.length === 1) {
      this.context.lineTo(data.path[0].x, data.path[0].y);
      this.context.stroke();
      return;
    }

    for (let i = 1; i < data.path.length; i += 1) {
      this.selectToolSocket(brush);
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
  }

  savePreviousDrawing() {
    this.previousDrawing = this.canvas.toDataURL();
  }

  saveCurrentDrawing() {
    this.currentDrawing = this.canvas.toDataURL();
  }

  startDrawing() {
    this.drawing = true;
  }

  stopDrawing() {
    this.drawing = false;
  }

  setImage(image, clear = false) {
    if (clear) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    if (image === null) { return; }

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
    this.savePreviousDrawing();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.saveCurrentDrawing();
    this.socket.sendClear();
    this.socket.sendDrawData({ current: this.currentDrawing, previous: this.previousDrawing });
  }

  setEvents() {
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
