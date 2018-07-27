import Tool from '../tool';
import floodFill from './floodFill';

export default class Bucket extends Tool {
  constructor() {
    super();
    this.compositeOperation = 'source-over';
  }

  action(canvasController) {
    const {
      canvas, context, currentX, currentY, selectedColorRGBA,
    } = canvasController;

    canvasController.startDrawing();

    canvasController.savePreviousDrawing();
    this.selectedColor = selectedColorRGBA;
    this.position = [currentX, currentY];
    this.clickedPixel = context.getImageData(currentX, currentY, 1, 1).data;
    floodFill(context, this.position, this.clickedPixel, selectedColorRGBA, canvas);
    canvasController.saveCurrentDrawing();
  }

  sendToSocket(canvasController) {
    canvasController.saveCurrentDrawing();
    const {
      currentDrawing, previousDrawing, socket,
    } = canvasController;
    socket.sendFloodFill(this.position, this.selectedColor);
    socket.sendDrawData({ current: currentDrawing, previous: previousDrawing });
  }
}
