import Tool from './tool';

export default class FreeHandTool extends Tool{
    constructor(socket){
        super(socket);
        if (this.constructor === FreeHandTool) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.selectedSize = 5;
        this.style = 'round';
    }

    changeSize(size) {
        if (this.isInvalidSize(size)) {
          return;
        }
        this.selectedSize = size;
    }

    isInvalidSize(size){
        const minSize = 5;
        const maxSize = 25;

        return size < minSize || size > maxSize;
    }

    static draw(canvasController){
        const { context, previousX, previousY, currentX, currentY } = canvasController

        context.beginPath();
        if (!firstClick) {
            context.moveTo(previousX, previousY);
        }
        context.lineTo(currentX, currentY);
        context.stroke();
    } 
}