import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { makeLetter, preloadImages } from './helpers';
import { dimensions, mapLettersToImages } from './consts';
import { Coords, ImageSources } from './types';

function App() {
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
      const [newX, newY] = makeLetter(imagesKeys, key, coords.x, coords.y, drawImage, clearRect);
      setCoords({ x: newX, y: newY });
    },
    [coords, clearRect, drawImage, imagesKeys],
  );

  const drawLetters = useCallback(
    (array: string[], x: number, y: number) => {
      const newCoords = { x, y };
      array.forEach((letter) => {
        const [newX, newY] = makeLetter(imagesKeys, letter, newCoords.x, newCoords.y, drawImage, clearRect);
        newCoords.x = newX;
        newCoords.y = newY;
      });
      setCoords(newCoords);
    },
    [imagesKeys, drawImage, clearRect],
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

  return (
    <main className="main">
      <button id="save" onClick={() => localStorage.setItem('writer', JSON.stringify(letters))}>
        SAVE
      </button>
      <button
        id="load"
        onClick={() => {
          const stored = localStorage.getItem('writer');
          if (stored) {
            ctx?.clearRect(0, 0, 1200, 700);
            const newLetters = JSON.parse(stored) as string[];
            setLetters(newLetters);
            drawLetters(newLetters, 0, 0);
          }
        }}
      >
        LOAD
      </button>
      <button id="deleteSaved" onClick={() => localStorage.removeItem('writer')}>
        DELETE SAVED
      </button>
      <button
        id="clearField"
        onClick={() => {
          ctx?.clearRect(0, 0, 1200, 700);
          setCoords({ x: 0, y: 0 });
          setLetters([]);
        }}
      >
        CLEAR FIELD
      </button>
      <canvas ref={canvasRef} className="canvas" width="1200" height="700"></canvas>
    </main>
  );
}

export default App;
