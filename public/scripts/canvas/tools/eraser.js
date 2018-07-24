import FreeHandTool from './freeHandTool';

export default class Eraser extends FreeHandTool {
  constructor() {
    super();
    this.compositeOperation = 'destination-out';
  }

  action(canvasController, pathArray = null, firstClick = false) {
    canvasController.selectTool(this);
    FreeHandTool.draw(canvasController, firstClick);
  }
}
