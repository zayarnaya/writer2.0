import { dimensions } from '../consts';
import { ImageSources } from '../types';

export const preloadImages = async (images: Record<string, string>, callback: (object: ImageSources) => void) => {
  const target = {};
  const sources = Object.values(images);
  const keys = Object.keys(images);
  await Promise.allSettled(
    sources.map(
      (source, index) =>
        new Promise((resolve, reject) => {
          const img = new Image(dimensions.width, dimensions.height);
          img.src = (process.env.NODE_ENV === 'production' ? '/writer2.0' : '') + source;
          Object.assign(target, { [keys[index]]: img });
          img.onload = () => resolve(img);
          img.onerror = (event) => reject(event);
        }),
    ),
  ).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error.message); // сделать единый блок демонстрации ошибок?
  });
  callback(target);
};
