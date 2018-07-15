import CanvasController from './canvas/canvas';
import Socket from './socket/socket';
import IconEvents from './DOM/IconEvents';
import WindowEvents from './DOM/WindowEvents';

const SocketIO = new Socket();
const canvasController = new CanvasController(SocketIO);
const windowEvents = new WindowEvents(canvasController);
const iconEvents = new IconEvents(canvasController);

iconEvents.setEvents();
canvasController.selectBrush();
windowEvents.setEvents();

SocketIO.init(canvasController);
