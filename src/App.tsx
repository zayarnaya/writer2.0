import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { makeLetters, preloadImages } from './helpers';
import { dimensions, mapLettersToImages } from './consts';

function App() {
  const [imagesKeys, setImagesKeys] = useState({});

  const [isImgLoaded, setImgLoaded] = useState(false);
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
  });
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback(
    (image: CanvasImageSource, x: number, y: number) => {
      ctx?.drawImage(image, x, y, dimensions.width, dimensions.height);
    },
    [ctx],
  );

  const clearRect = useCallback(
    (x: number, y: number) => {
      ctx?.clearRect(x, y, dimensions.width, dimensions.height);
    },
    [ctx],
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    drawLetters(e);
  };

  const drawLetters = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      makeLetters(imagesKeys, e.key, coords.x, coords.y, setCoords, drawImage, clearRect, e.code);
    },
    [coords, clearRect, drawImage, imagesKeys],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) setCtx(context);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!isImgLoaded) {
      console.log('loading images');
      preloadImages(mapLettersToImages, setImagesKeys).then(() => setImgLoaded(true));
    }
  }, [isImgLoaded, imagesKeys]);

  useEffect(() => {
    console.log('adding listener');
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      console.log('removing listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [coords, imagesKeys]);

  return (
    <main className="main">
      <canvas ref={canvasRef} className="canvas" width="1200" height="700"></canvas>
    </main>
  );
}

export default App;
