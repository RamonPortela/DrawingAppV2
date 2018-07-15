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
      this.socket.sendDraw(this.pathArray, canvas.brush);
      this.pathArray = [];
    }
  }

  clickStartHandler(event, canvas) {
    event.preventDefault();
    const c = canvas;
    if (event.buttons > 1) {
      return;
    }

    canvas.setPositions(event.clientX, event.clientY);
    canvas.draw(true);

    c.drawing = true;

    this.pathArray.push({ x: canvas.currentX, y: canvas.currentY });
    this.socket.sendDraw(this.pathArray, canvas.brush);
  }

  touchStartHandler(event, canvas) {
    event.preventDefault();
    const c = canvas;
    const touches = event.changedTouches;

    if (touches.length > 1) {
      return;
    }

    const touch = touches[0];

    canvas.setPositions(touch.clientX, touch.clientY);
    canvas.draw(true);

    c.drawing = true;

    this.pathArray.push({ x: canvas.currentX, y: canvas.currentY });
    this.socket.sendDraw(this.pathArray, canvas.brush);
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
        this.socket.sendDraw(this.pathArray, canvas.brush);
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
        this.socket.sendDraw(this.pathArray, canvas.brush);
        this.pathArray = this.pathArray.slice(49);
      }
    }
  }
}
