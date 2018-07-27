export default class CanvasEvents {
  constructor() {
    this.pathArray = [];
  }

  stopDrawing(event, canvas) {
    event.preventDefault();

    if (!canvas.drawing) { return; }
    if (CanvasEvents.isDrawingOverUndoRedo(event)) { return; }
    canvas.stopDrawing();
    canvas.selectedTool.sendToSocket(canvas, this.pathArray);
    this.pathArray = [];
  }

  clickStartHandler(event, canvas) {
    event.preventDefault();

    if (event.type !== 'mousedown') { return; }
    if (event.buttons > 1) { return; }

    canvas.setPositions(event.clientX, event.clientY);

    this.handleClickTouch(canvas);
  }

  touchStartHandler(event, canvas) {
    event.preventDefault();

    const touches = event.changedTouches;

    if (touches.length > 1) { return; }

    const touch = touches[0];

    canvas.setPositions(touch.clientX, touch.clientY);

    this.handleClickTouch(canvas);
  }

  handleClickTouch(canvas) {
    canvas.startDrawing();
    canvas.selectedTool.action(canvas, this.pathArray, true);
  }

  mouseMoveHandler(event, canvas) {
    event.preventDefault();

    if (CanvasEvents.isPickerOrBucket(canvas)) { return; }
    const position = { x: event.clientX, y: event.clientY };
    this.handleClickTouchMove(canvas, position);
  }

  toucheMoveHandler(event, canvas) {
    event.preventDefault();

    if (CanvasEvents.isPickerOrBucket(canvas)) { return; }
    const touches = event.changedTouches;
    if (touches.length > 1) { return; }
    const touch = touches[0];
    const position = { x: touch.clientX, y: touch.clientY };
    this.handleClickTouchMove(canvas, position);
  }

  handleClickTouchMove(canvas, position) {
    if (!canvas.drawing) { return; }

    canvas.setPositions(position.x, position.y);
    canvas.selectedTool.action(canvas, this.pathArray);
    if (this.pathArray.length === 50) {
      canvas.selectedTool.sendToSocketPartial(canvas, this.pathArray);
      this.pathArray = this.pathArray.slice(49);
    }
  }

  static isPickerOrBucket(canvas) {
    return canvas.selectedTool === 'picker' || canvas.selectedTool === 'bucket';
  }

  static isDrawingOverUndoRedo(event) {
    return event.type === 'mouseout' && event.target.closest('#canvas-holder');
  }
}
