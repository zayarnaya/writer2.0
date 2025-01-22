import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { makeLetter, preloadImages } from './helpers';
import { dimensions, mapLettersToImages } from './consts';
import { Coords, ImageSources } from './types';

function App() {
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: dimensions.fieldWidth,
    height: dimensions.fieldHeight,
  });
  const [imagesKeys, setImagesKeys] = useState<ImageSources>({});
  const [letters, setLetters] = useState<string[]>([]);
  const [isImgLoaded, setImgLoaded] = useState(false);
  const [coords, setCoords] = useState<Coords>({
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
    setLetters([...letters].concat(e.key));
    drawLetter(e.key);
  };

  const drawLetter = useCallback(
    (key: string) => {
      const [newX, newY] = makeLetter(
        imagesKeys,
        key,
        coords.x,
        coords.y,
        drawImage,
        clearRect,
        canvasDimensions.width,
      );
      setCoords({ x: newX, y: newY });
    },
    [coords, clearRect, drawImage, imagesKeys, canvasDimensions.width],
  );

  const drawLetters = useCallback(
    (array: string[], x: number, y: number) => {
      const newCoords = { x, y };
      array.forEach((letter) => {
        const [newX, newY] = makeLetter(
          imagesKeys,
          letter,
          newCoords.x,
          newCoords.y,
          drawImage,
          clearRect,
          canvasDimensions.width,
        );
        newCoords.x = newX;
        newCoords.y = newY;
      });
      setCoords(newCoords);
    },
    [imagesKeys, drawImage, clearRect, canvasDimensions.width],
  );

  const handleSave = useCallback(() => {
    localStorage.setItem('writer', JSON.stringify(letters));
  }, [letters]);

  const handleLoad = useCallback(() => {
    const stored = localStorage.getItem('writer');
    if (stored) {
      ctx?.clearRect(0, 0, dimensions.fieldWidth, dimensions.fieldHeight);
      const newLetters = JSON.parse(stored) as string[];
      setLetters(newLetters);
      drawLetters(newLetters, 0, 0);
    }
  }, [ctx, drawLetters]);

  const handleDelete = useCallback(() => localStorage.removeItem('writer'), []);

  const handleClear = useCallback(() => {
    ctx?.clearRect(0, 0, 1200, 700);
    setCoords({ x: 0, y: 0 });
    setLetters([]);
  }, [ctx]);

  const resetDimensions = () => {
    const { innerWidth, innerHeight } = window;
    setCanvasDimensions({ height: innerHeight, width: innerWidth });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      resetDimensions();
      const context = canvas.getContext('2d');
      if (context) setCtx(context);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (letters.length) {
      drawLetters(letters, 0, 0);
    }
  }, [canvasDimensions.width]);

  useEffect(() => {
    if (!isImgLoaded) {
      preloadImages(mapLettersToImages, setImagesKeys).then(() => setImgLoaded(true));
    }
  }, [isImgLoaded, imagesKeys]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, imagesKeys]);

  useEffect(() => {
    window.addEventListener('resize', resetDimensions);
    return () => window.removeEventListener('resize', resetDimensions);
  }, []);

  return (
    <main className="main">
      <button id="save" onClick={handleSave}>
        SAVE
      </button>
      <button id="load" onClick={handleLoad}>
        LOAD
      </button>
      <button id="deleteSaved" onClick={handleDelete}>
        DELETE SAVED
      </button>
      <button id="clearField" onClick={handleClear}>
        CLEAR FIELD
      </button>
      <canvas
        ref={canvasRef}
        className="canvas"
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      ></canvas>
    </main>
  );
}

export default App;
