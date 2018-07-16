import CanvasController from './canvas/canvas';
import Socket from './socket/socket';
import WindowEvents from './DOM/WindowEvents';

const SocketIO = new Socket();
const canvasController = new CanvasController(SocketIO);
const windowEvents = new WindowEvents(canvasController);

canvasController.selectBrush();
windowEvents.setEvents();

SocketIO.init(canvasController);
