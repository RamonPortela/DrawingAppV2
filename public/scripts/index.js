import CanvasController from './canvas/canvas';
import Socket from './socket/socket';

const SocketIO = new Socket();
const canvasController = new CanvasController(SocketIO);

SocketIO.init(canvasController);

canvasController.selectBrush();
