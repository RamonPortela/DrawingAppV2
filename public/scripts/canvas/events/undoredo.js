export function undo(event) {
  event.preventDefault();
  event.stopPropagation();

  this.socket.sendUndo();
}

export function redo(event) {
  event.preventDefault();
  event.stopPropagation();

  this.socket.sendRedo();
}
