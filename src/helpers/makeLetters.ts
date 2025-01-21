import { dimensions } from '../consts';
import { Coords, ImageSources } from '../types';

export const makeLetters = (
  imagesKeys: ImageSources,
  key: string,
  x: number,
  y: number,
  setCoords: (coords: Coords) => void,
  drawImage: (image: CanvasImageSource, x: number, y: number) => void,
  clearRect: (x: number, y: number) => void,
) => {
  const coords = { x, y };
  const { height: lHeight, width: lWidth } = dimensions;
  if (coords.x > 1200) {
    coords.x = 0;
    coords.y += lHeight;
  }

  if (coords.x < 0 && coords.y < 0) {
    coords.x = 0;
    coords.y = 0;
  }

  switch (key) {
    case 'Shift':
    case 'Control': {
      break;
    }

    case '!': {
      drawImage(imagesKeys.ExMark, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '?': {
      drawImage(imagesKeys.QMark, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case ':': {
      // Ж
      drawImage(imagesKeys.JJ, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case ';': {
      // ж
      drawImage(imagesKeys.jj, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '"': {
      // Ж
      drawImage(imagesKeys.EE, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case "'": {
      // ж
      drawImage(imagesKeys.ee, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '<': {
      // Б
      drawImage(imagesKeys['<'], coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case ',': {
      // б

      drawImage(imagesKeys[','], coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '>': {
      // Ю
      drawImage(imagesKeys['>'], coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '.': {
      // ю
      drawImage(imagesKeys.yy, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '~': {
      // Ё
      drawImage(imagesKeys['~'], coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '`': {
      // ё
      drawImage(imagesKeys['`'], coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '=': {
      drawImage(imagesKeys.eq, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '-': {
      drawImage(imagesKeys.minus, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '+': {
      drawImage(imagesKeys.plus, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case '_': {
      drawImage(imagesKeys.dash, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
    case 'Enter': {
      coords.y += lHeight;
      coords.x = 0;
      break;
    }
    case 'Backspace': {
      if (coords.y > 0 && coords.x == 0) {
        coords.y -= lHeight;
        coords.x = 1200;
      }
      clearRect(coords.x - lWidth, coords.y);
      coords.x -= lWidth;
      break;
    }
    case ' ': {
      drawImage(imagesKeys.space, coords.x, coords.y);
      coords.x += lWidth;
      break;
    }

    default: {
      drawImage(imagesKeys[key], coords.x, coords.y);
      coords.x += lWidth;
      break;
    }
  }
  setCoords(coords);
};
