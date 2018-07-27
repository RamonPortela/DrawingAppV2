import CanvasController from './canvas/canvasController';
import Socket from './socket/socket';
import WindowEvents from './DOM/WindowEvents';

const SocketIO = new Socket();
const canvasController = new CanvasController(SocketIO);
const windowEvents = new WindowEvents(canvasController);

canvasController.selectTool(canvasController.tools.brush);
windowEvents.setEvents();

SocketIO.init(canvasController);
