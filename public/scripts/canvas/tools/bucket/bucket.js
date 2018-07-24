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
    let { previousDrawing, currentDrawing } = canvasController;


    const position = [currentX, currentY];
    const selectedColor = selectedColorRGBA;
    previousDrawing = canvas.toDataURL();
    canvasController.draw(true);
    currentDrawing = canvas.toDataURL();
    this.socket.sendFloodFill(position, selectedColor);
    this.socket.sendDrawData({ current: currentDrawing, previous: previousDrawing });
  }
}
