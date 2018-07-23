export default class Tool{
    constructor(socket){
        if (this.constructor === Tool) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.socket = socket;
    }

    action(canvasController){
        throw new TypeError("Do not call abstract method foo from child.");
    }

    sendToSocket(){
        throw new TypeError("Do not call abstract method foo from child.");
    }
}