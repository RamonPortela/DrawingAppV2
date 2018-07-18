export default class CanvasEvents {
  constructor(socket) {
    this.socket = socket;
    this.pathArray = [];
  }

  stopDrawing(event, canvas) {
    event.preventDefault();
    const c = canvas;
    c.drawing = false;

    if (this.pathArray.length > 0) {
      this.socket.sendDraw(this.pathArray, CanvasEvents.getBrushOrEraser(canvas), canvas.selectedColor);
      this.socket.sendDrawData({ current: canvas.currentDrawing, previous: canvas.previousDrawing });
      this.pathArray = [];
    }
  }

  clickStartHandler(event, canvas) {
    event.preventDefault();

    // if (event.type !== 'mousedown') {
    //   return;
    // }

    if (event.buttons > 1) {
      return;
    }

    canvas.setPositions(event.clientX, event.clientY);

    this.handleClickTouch(canvas);
  }

  touchStartHandler(event, canvas) {
    event.preventDefault();

    const touches = event.changedTouches;

    if (touches.length > 1) {
      return;
    }

    const touch = touches[0];

    canvas.setPositions(touch.clientX, touch.clientY);

    this.handleClickTouch(canvas);
  }

  handleClickTouch(canvas) {
    const c = canvas;

    if (canvas.selectedTool === 'bucket') {
      const position = [canvas.currentX, canvas.currentY];
      const selectedColor = canvas.selectedColorRGBA;
      canvas.draw(true);
      this.socket.sendFloodFill(position, selectedColor);
      this.socket.sendDrawData({ current: canvas.currentDrawing, previous: canvas.previousDrawing });
      return;
    }

    if (canvas.selectedTool === 'picker') {
      canvas.getColor();
      return;
    }

    canvas.draw(true);
    c.drawing = true;

    this.pathArray.push({ x: canvas.currentX, y: canvas.currentY });
    this.socket.sendDraw(this.pathArray, CanvasEvents.getBrushOrEraser(canvas), canvas.selectedColor);
    this.socket.sendDrawData({ current: canvas.currentDrawing, previous: canvas.previousDrawing });
  }

  mouseMoveHandler(event, canvas) {
    event.preventDefault();
    if (canvas.selectedTool === 'picker' || canvas.selectedTool === 'bucket') {
      return;
    }

    if (canvas.drawing) {
      canvas.setPositions(event.clientX, event.clientY);
      canvas.draw(false);
      this.pathArray.push({ x: canvas.currentX, y: canvas.currentY });
      if (this.pathArray.length === 50) {
        this.socket.sendDraw(this.pathArray, CanvasEvents.getBrushOrEraser(canvas), canvas.selectedColor);
        this.socket.sendDrawData({ current: canvas.currentDrawing, previous: canvas.previousDrawing });
        this.pathArray = this.pathArray.slice(49);
      }
    }
  }

  toucheMoveHandler(event, canvas) {
    event.preventDefault();

    if (canvas.selectedTool === 'picker' || canvas.selectedTool === 'bucket') {
      return;
    }

    const touches = event.changedTouches;

    if (touches.length > 1) {
      return;
    }

    const touch = touches[0];

    if (canvas.drawing) {
      canvas.setPositions(touch.clientX, touch.clientY);
      canvas.draw(false);
      this.pathArray.push({ x: canvas.currentX, y: canvas.currentY });
      if (this.pathArray.length === 50) {
        this.socket.sendDraw(this.pathArray, CanvasEvents.getBrushOrEraser(canvas), canvas.selectedColor);
        this.socket.sendDrawData({ current: canvas.currentDrawing, previous: canvas.previousDrawing });
        this.pathArray = this.pathArray.slice(49);
      }
    }
  }

  undo(event) {
    event.preventDefault();
    event.stopPropagation();

    this.socket.sendUndo();
  }

  redo(event) {
    event.preventDefault();
    event.stopPropagation();

    this.socket.sendRedo();
  }

  clearCanvas() {
    this.socket.sendClear();
  }

  static getBrushOrEraser(canvas) {
    return canvas.selectedTool === 'brush' ? canvas.brush : canvas.eraser;
  }
}
