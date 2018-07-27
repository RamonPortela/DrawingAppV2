import FreeHandTool from './freeHandTool';

export default class Eraser extends FreeHandTool {
  constructor() {
    super();
    this.compositeOperation = 'destination-out';
  }
}
