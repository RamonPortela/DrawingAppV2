export default class Socket {
  constructor() {
    this.socket = io();
    this.notificar = true;
    this.ultimaNotifacao = new Date();
  }

  init(canvasController) {
    // event that recieves a freehand drawing
    this.socket.on('draw', (data) => {
      if (data.id === this.socket.id) {
        return;
      }

      if (data.path.length < 1) {
        return;
      }

      canvasController.drawFromSocket(data);
    });

    // event that recieves the bucket floodfill fuction
    this.socket.on('flood', (data) => {
      if (data.id === this.socket.id) {
        return;
      }

      canvasController.floodFillFromSocket(data);
    });
  }

  // function that sends the draw event
  sendDraw(pathArray, brush, color) {
    const newBrush = Object.assign(brush, { selectedColor: color });

    this.socket.emit('draw', {
      path: pathArray, brush: newBrush, id: this.socket.id, notify: this.notificar,
    });
  }

  // function that sends the floodfill event
  sendFloodFill(pos, selectedColor) {
    const position = [pos[0], pos[1]];

    this.socket.emit('flood', {
      position,
      selectedColor,
      id: this.socket.id,
    });
  }
}
