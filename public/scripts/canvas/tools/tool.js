export default class Tool {
  constructor() {
    if (this.constructor === Tool) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    this.color = 'black';
  }

  action(canvasController, pathArray = null, firstClick = false) {
    throw new TypeError('Do not call abstract method foo from child.');
  }

  sendToSocket(canvasController, pathArray = null) {
    throw new TypeError('Do not call abstract method foo from child.');
  }
}
