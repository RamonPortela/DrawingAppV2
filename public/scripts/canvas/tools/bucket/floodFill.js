export default function floodFill(c, position, clickedPixel, selectedColor, canvas) {
  position[0] = Math.floor(position[0]);
  position[1] = Math.floor(position[1]);

  const clickedColor = {
    r: clickedPixel[0],
    g: clickedPixel[1],
    b: clickedPixel[2],
    a: clickedPixel[3],
  };
  if (clickedColor.r == selectedColor.r && clickedColor.g == selectedColor.g && clickedColor.b == selectedColor.b && clickedColor.a == selectedColor.a) {
    return;
  }

  const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let tolerance;

  const pixelStack = [];
  pixelStack.push([position[0], position[1]]);

  function verificarCor(position, clickedColor) {
    const positionColor = {
      r: data[position],
      g: data[position + 1],
      b: data[position + 2],
      a: data[position + 3],
    };

    if (positionColor.r == selectedColor.r && positionColor.g == selectedColor.g && positionColor.b == selectedColor.b && positionColor.a == selectedColor.a) {
      return false;
    }

    const hsp = Math.sqrt(
      0.299 * (selectedColor.r * selectedColor.r)
          + 0.587 * (selectedColor.g * selectedColor.g)
          + 0.114 * (selectedColor.b * selectedColor.b),
    );

    if (hsp > 200) {
      tolerance = 20;
    } else if (hsp > 85) {
      tolerance = 175;
    } else {
      tolerance = 250;
    }

    if (
      Math.abs(positionColor.r - clickedColor.r) <= tolerance
          && Math.abs(positionColor.g - clickedColor.g) <= tolerance
          && Math.abs(positionColor.b - clickedColor.b) <= tolerance
          && Math.abs(positionColor.a - clickedColor.a) <= tolerance) { return true; }

    return false;
  }

  function pintarPixel(position) {
    data[position] = selectedColor.r;
    data[position + 1] = selectedColor.g;
    data[position + 2] = selectedColor.b;
    data[position + 3] = selectedColor.a;
  }
  while (pixelStack.length) {
    if (pixelStack.length > 100) { break; }
    let newPos,
      x,
      y,
      pixelPosition,
      reachLeft,
      reachRight;

    newPos = pixelStack.pop();
    x = newPos[0];
    y = newPos[1];

    pixelPosition = (y * canvas.width + x) * 4;

    while (y >= 0 && verificarCor(pixelPosition, clickedColor)) {
      pixelPosition -= canvas.width * 4;
      y--;
    }

    pixelPosition += canvas.width * 4;
    y++;
    reachLeft = false;
    reachRight = false;

    while (y < canvas.height && verificarCor(pixelPosition, clickedColor)) {
      pintarPixel(pixelPosition);

      if (x > 0) {
        if (verificarCor(pixelPosition - 4, clickedColor)) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < canvas.width - 1) {
        if (verificarCor(pixelPosition + 4, clickedColor)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      pixelPosition += canvas.width * 4;
      y++;
    }
  }
  c.putImageData(imageData, 0, 0);
}
