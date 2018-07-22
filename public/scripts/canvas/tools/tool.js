export default class Tool{
    constructor(){
        if (this.constructor === Tool) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    action(canvasController){
        throw new TypeError("Do not call abstract method foo from child.");
    }
}