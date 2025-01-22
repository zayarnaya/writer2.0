import { dimensions } from '../consts';
import { ImageSources } from '../types';

export const makeLetter = (
  imagesKeys: ImageSources,
  key: string,
  x: number,
  y: number,
  drawImage: (image: CanvasImageSource, x: number, y: number) => void,
  clearRect: (x: number, y: number) => void,
  maxWidth: number,
) => {
  const coords = { x, y };
  const { height, width } = dimensions;
  const limitWidth = maxWidth - (maxWidth % width);
  if (coords.x >= limitWidth) {
    coords.x = 0;
    coords.y += height;
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
    case 'Backspace': {
      if (coords.y > 0 && coords.x == 0) {
        coords.y -= height;
        coords.x = limitWidth;
      }
      clearRect(coords.x - width, coords.y);
      coords.x -= width;
      break;
    }

    default: {
      if (!imagesKeys[key]) return [coords.x, coords.y];
      drawImage(imagesKeys[key], coords.x, coords.y);
      coords.x += width;
      break;
    }
  }
  return [coords.x, coords.y];
};
