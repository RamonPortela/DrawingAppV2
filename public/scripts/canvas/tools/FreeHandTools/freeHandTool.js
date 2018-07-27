import Tool from '../tool';

export default class FreeHandTool extends Tool {
  constructor() {
    super();
    if (this.constructor === FreeHandTool) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    this.selectedSize = 5;
    this.style = 'round';
  }

  changeSize(size) {
    if (FreeHandTool.isInvalidSize(size)) {
      return;
    }
    this.selectedSize = size;
  }

  static isInvalidSize(size) {
    const minSize = 5;
    const maxSize = 25;

    return size < minSize || size > maxSize;
  }

  action(canvasController, pathArray = null, firstClick = false) {
    if (firstClick) {
      canvasController.savePreviousDrawing();
    }
    canvasController.selectTool(this);
    FreeHandTool.draw(canvasController, firstClick);
    pathArray.push({ x: canvasController.currentX, y: canvasController.currentY });
  }

  static draw(canvasController, firstClick = false) {
    const {
      context, previousX, previousY, currentX, currentY,
    } = canvasController;

    context.beginPath();
    if (!firstClick) {
      context.moveTo(previousX, previousY);
    }
    context.lineTo(currentX, currentY);
    context.stroke();
  }

  sendToSocket(canvasController, pathArray = null) {
    if (pathArray.length > 0) {
      canvasController.saveCurrentDrawing();
      const {
        selectedTool, selectedColor, currentDrawing, previousDrawing, socket,
      } = canvasController;
      socket.sendFreeHandDrawing(pathArray, selectedTool, selectedColor);
      socket.sendDrawData({ current: currentDrawing, previous: previousDrawing });
    }
  }

  sendToSocketPartial(canvasController, pathArray = null) {
    if (pathArray.length > 0) {
      const {
        selectedTool, selectedColor, socket,
      } = canvasController;
      socket.sendFreeHandDrawing(pathArray, selectedTool, selectedColor);
    }
  }
}
