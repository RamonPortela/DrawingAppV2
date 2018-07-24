import Tool from './tool';

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
      socket.sendDraw(pathArray, selectedTool, selectedColor);
      socket.sendDrawData({ current: currentDrawing, previousDrawing });
    }
  }
}
