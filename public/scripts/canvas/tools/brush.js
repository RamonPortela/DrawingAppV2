import FreeHandTool from './freeHandTool';

export default class Brush extends FreeHandTool {
  constructor() {
    super();
    this.compositeOperation = 'source-over';
  }

  action(canvasController, pathArray = null, firstClick = false) {
    if (firstClick) {
      canvasController.savePreviousDrawing();
    }
    canvasController.selectTool(this);
    FreeHandTool.draw(canvasController, firstClick);
    pathArray.push({ x: canvasController.currentX, y: canvasController.currentY });
  }
}
