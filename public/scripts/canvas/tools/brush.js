import { FreeHandTool } from './freeHandTool';

export default class Brush extends FreeHandTool{
    constructor(){
        super();

        this.compositeOperation = 'source-over';
    }

    action(canvasController){
        canvasController.selectBrush(this);
        FreeHandTool.draw(canvasController);
    }
}