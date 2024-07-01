import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCw, SkipForward, ArrowLeft } from 'lucide-react';

const GRID_SIZE = 10;
const CELL_SIZE = 40;

const CellType = {
  EMPTY: 0,
  START: 1,
  END: 2,
  MIRROR: 3,
  PLANET: 4,
};

const Direction = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

const Button = ({ onClick, children }) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
    onClick={onClick}
  >
    {children}
  </button>
);

const Cell = ({ type, rotation, onClick }) => {
  const baseClasses = "w-10 h-10 border border-gray-700 flex items-center justify-center";
  
  switch (type) {
    case CellType.START:
      return <div className={`${baseClasses} bg-blue-500 rounded-full`} />;
    case CellType.END:
      return <div className={`${baseClasses} bg-green-500 rounded-full`} />;
    case CellType.MIRROR:
      return (
        <div 
          className={`${baseClasses} bg-red-500 transform rotate-${rotation * 45} cursor-pointer`}
          onClick={onClick}
        >
          <div className="w-8 h-1 bg-white transform -rotate-45" />
        </div>
      );
    case CellType.PLANET:
      return <div className={`${baseClasses} bg-yellow-500 rounded-full`} />;
    default:
      return <div className={baseClasses} />;
  }
};

const Laser = ({ position, direction }) => {
  const rotationDegrees = {
    [Direction.UP]: 0,
    [Direction.RIGHT]: 90,
    [Direction.DOWN]: 180,
    [Direction.LEFT]: 270,
  };

  return (
    <div 
      className="absolute w-4 h-4 transition-all duration-300 ease-linear"
      style={{ 
        left: `${position.x * CELL_SIZE + 8}px`, 
        top: `${position.y * CELL_SIZE + 8}px`,
        transform: `rotate(${rotationDegrees[direction]}deg)`,
      }}
    >
      <div className="w-full h-full bg-red-500 rounded-full" />
      <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-red-500 transform -translate-y-1/2 origin-left" />
    </div>
  );
};

const MirrorLazerBreak = () => {
  const [grid, setGrid] = useState([]);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [laserDir, setLaserDir] = useState(Direction.RIGHT);
  const [isRunning, setIsRunning] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState('');

  const createLevel = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(CellType.EMPTY));
    newGrid[0][0] = CellType.START;
    newGrid[GRID_SIZE - 1][GRID_SIZE - 1] = CellType.END;
    
    // Add mirrors and planets
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (newGrid[y][x] === CellType.EMPTY) {
        newGrid[y][x] = Math.random() < 0.7 ? { type: CellType.MIRROR, rotation: Math.floor(Math.random() * 4) } : CellType.PLANET;
      }
    }
    
    setGrid(newGrid);
    setLaserPos({ x: 0, y: 0 });
    setLaserDir(Direction.RIGHT);
    setGameStatus('');
  }, []);

  useEffect(() => {
    createLevel();
  }, [level, createLevel]);

  const rotateMirror = (x, y) => {
    const newGrid = [...grid];
    newGrid[y][x] = { 
      type: CellType.MIRROR, 
      rotation: (newGrid[y][x].rotation + 1) % 4 
    };
    setGrid(newGrid);
  };

  const moveLaser = useCallback(() => {
    let newX = laserPos.x;
    let newY = laserPos.y;
    let newDir = laserDir;

    switch (laserDir) {
      case Direction.UP: newY--; break;
      case Direction.RIGHT: newX++; break;
      case Direction.DOWN: newY++; break;
      case Direction.LEFT: newX--; break;
    }

    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
      setIsRunning(false);
      setGameStatus('Game Over: Laser went off grid!');
      return;
    }

    const cell = grid[newY][newX];

    if (cell === CellType.PLANET) {
      setIsRunning(false);
      setGameStatus('Game Over: Laser hit a planet!');
      return;
    }

    if (cell === CellType.END) {
      setIsRunning(false);
      setGameStatus('You Won! Laser reached the end!');
      return;
    }

    if (cell.type === CellType.MIRROR) {
      const mirrorRotation = cell.rotation;
      newDir = (mirrorRotation + laserDir + 1) % 4;
    }

    setLaserPos({ x: newX, y: newY });
    setLaserDir(newDir);
  }, [grid, laserPos, laserDir]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(moveLaser, 500);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, moveLaser]);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Mirror Lazer Break</h1>
      <div className="flex gap-4 mb-6">
        <div className="relative grid grid-cols-10 gap-1 bg-gray-900 p-2 rounded-lg">
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <Cell
                key={`${x}-${y}`}
                type={cell.type || cell}
                rotation={cell.type === CellType.MIRROR ? cell.rotation : 0}
                onClick={() => cell.type === CellType.MIRROR && rotateMirror(x, y)}
              />
            ))
          )}
          {isRunning && <Laser position={laserPos} direction={laserDir} />}
        </div>
        <div className="flex flex-col gap-4">
          <Button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={createLevel}><RotateCw size={18} /> Reset Level</Button>
          <Button onClick={() => setLevel(prev => prev + 1)}><SkipForward size={18} /> Next Level</Button>
          <Button onClick={() => setLevel(prev => Math.max(1, prev - 1))}><ArrowLeft size={18} /> Previous Level</Button>
        </div>
      </div>
      <div className="text-center text-xl font-bold">{gameStatus}</div>
    </div>
  );
};

export default MirrorLazerBreak;