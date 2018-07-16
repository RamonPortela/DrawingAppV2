export default class Socket {
  constructor() {
    this.socket = io();
    this.notificar = true;
    this.ultimaNotifacao = new Date();
  }

  init(canvasController) {
    this.socket.on('draw', (data) => {
      if (data.id === this.socket.id) {
        return;
      }

      if (data.path.length < 1) {
        return;
      }

      canvasController.drawFromSocket(data);
    });
  }

  sendDraw(pathArray, brush, color) {
    const newBrush = Object.assign(brush, { selectedColor: color });

    this.socket.emit('draw', {
      path: pathArray, brush: newBrush, id: this.socket.id, notify: this.notificar,
    });
  }
}
