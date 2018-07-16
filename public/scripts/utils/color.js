export function hexToRGBA(color) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    c = color.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return {
      r: (c >> 16) & 255,
      g: (c >> 8) & 255,
      b: c & 255,
      a: 255,
    };
  }
  throw new Error('Bad Hex');
}

export function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
