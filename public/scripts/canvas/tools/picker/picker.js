import Tool from '../tool';
import { rgbToHex } from '../../../utils/color';

export default class ColorPicker extends Tool {
  constructor() {
    super();
  }

  action(canvasController) {
    canvasController.stopDrawing();

    const {
      context, currentX, currentY, iconEvents,
    } = canvasController;

    let {
      selectedColor, selectedColorRGBA,
    } = canvasController;

    const pixel = context.getImageData(currentX, currentY, 1, 1).data;
    const rgba = {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3],
    };

    selectedColorRGBA = rgba;
    selectedColor = `RGBA(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    const { r, g, b } = selectedColorRGBA;
    iconEvents.colorPicker.value = rgbToHex(r, g, b);
    iconEvents.colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
    iconEvents.brushIcon.click();
  }
}
