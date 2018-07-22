import { Tool } from './tool';

export default class Bucket extends Tool{
    constructor(){
        this.compositeOperation = 'source-over';
    }

    action(canvasController){
        const position = [canvas.currentX, canvas.currentY];
        const selectedColor = canvas.selectedColorRGBA;
        c.previousDrawing = c.canvas.toDataURL();
        canvas.draw(true);
        c.currentDrawing = c.canvas.toDataURL();
        this.socket.sendFloodFill(position, selectedColor);
        this.socket.sendDrawData({ current: canvas.currentDrawing, previous: canvas.previousDrawing });
    }
}