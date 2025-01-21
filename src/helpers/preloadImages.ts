import { dimensions } from '../consts';

export const preloadImages = async (images, callback) => {
  const target = {};
  const sources = Object.values(images);
  const keys = Object.keys(images);
  await Promise.allSettled(
    sources.map(
      (source, index) =>
        new Promise((resolve, reject) => {
          const img = new Image(dimensions.width, dimensions.height);
          img.src = source;
          Object.assign(target, { [keys[index]]: img });
          img.onload = () => resolve(img);
          img.onerror = (event) => reject(event);
        }),
    ),
  ).catch((error) => {
    console.log(error.message); // сделать единый блок демонстрации ошибок?
  });
  console.log(target);
  callback(target);
};
