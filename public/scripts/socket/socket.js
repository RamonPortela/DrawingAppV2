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

  sendDraw(pathArray, brush) {
    this.socket.emit('draw', {
      path: pathArray, brush, id: this.socket.id, notify: this.notificar,
    });
  }
}
