export default class WindowEvents {
  constructor(canvasController) {
    this.canvasController = canvasController;
  }

  setEvents() {
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const sizeMenu = document.getElementById('size-menu');
      if (sizeMenu !== null) {
        if (event.target.closest('#size-menu') === null) {
          sizeMenu.remove();
        } else {
          console.log(event.target);
          if (event.target.closest('.tools-menu__size-container') !== null) {
            console.log('hi');
          }
        }
      }
    });
  }
}
