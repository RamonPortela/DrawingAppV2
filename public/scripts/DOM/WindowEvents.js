export default class WindowEvents {
  constructor(canvasController) {
    this.canvasController = canvasController;
  }

  setEvents() {
    document.addEventListener('mousedown', event => this.sizeMenuHandler(event));
    document.addEventListener('touchstart', event => this.sizeMenuHandler(event));
  }

  sizeMenuHandler(event) {
    const sizeMenu = document.getElementById('size-menu');
    if (sizeMenu !== null) {
      if (event.target.closest('#size-menu') === null) {
        sizeMenu.remove();
      } else if (event.target.closest('.tools-menu__size-container') !== null) {
        const element = event.target.closest('.tools-menu__size-container');
        const newSize = element.dataset.size;

        this.canvasController.changeToolSize(newSize);

        element.firstElementChild.classList.add('tools-menu__size--active');
      }
    }
  }
}
