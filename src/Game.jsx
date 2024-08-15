import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Game.css';

function Game() {
  const [points, setPoints] = useState(3);
  const [inputPoints, setInputPoints] = useState(3);
  const [numbers, setNumbers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [clickedNumber, setClickedNumber] = useState(null);
  const [title, setTitle] = useState("LET'S PLAY");
  const [gameStarted, setGameStarted] = useState(false);

  const generatePositions = useCallback((count) => {
    return Array.from({ length: count }, () => ({
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 90}%`,
    }));
  }, []);

  const startGameLogic = useCallback(() => {
    const nums = Array.from({ length: points }, (_, i) => i + 1);
    setNumbers(nums);
    setPositions(generatePositions(points));
    setTime(0);
    setGameOver(false);
    setTitle("LET'S PLAY");
    return setInterval(() => setTime((prev) => +(prev + 0.1).toFixed(1)), 100);
  }, [points, generatePositions]);

  useEffect(() => {
    if (gameStarted) {
      const newTimer = startGameLogic();
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    }
  }, [gameStarted, startGameLogic]);

  const handleNumberClick = useCallback((num) => {
    if (num === numbers[0]) {
      setClickedNumber(num);
      setTimeout(() => {
        setClickedNumber(null);
        setNumbers((prev) => {
          const newNumbers = prev.slice(1);
          if (newNumbers.length === 0) {
            setGameOver(true);
            setTitle("ALL CLEARED");
            clearInterval(timer);
          }
          return newNumbers;
        });
        setPositions((prev) => prev.slice(1));
      }, 1000);
    } else {
      setGameOver(true);
      setTitle("GAME OVER");
      clearInterval(timer);
    }
  }, [numbers, timer]);

  const resetGame = useCallback(() => {
    clearInterval(timer);
    setGameOver(false);
    setNumbers([]);
    setPositions([]);
    setTime(0);
    setGameStarted(false);
    setTitle("LET'S PLAY");
  }, [timer]);

  const handleInputPointsChange = useCallback((e) => {
    const value = Math.max(1, Math.min(1000, Number(e.target.value)));
    setInputPoints(value);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setPoints(inputPoints);
    setGameStarted(true);
  }, [resetGame, inputPoints]);

  const gameBoard = useMemo(() => (
    <div className="game-board">
      {!gameOver && numbers.map((num, index) => (
        <div
          key={index}
          className={`number ${num === clickedNumber ? 'clicked' : ''}`}
          style={{
            top: positions[index]?.top,
            left: positions[index]?.left,
            transition: num === clickedNumber ? 'background-color 1s ease' : '',
          }}
          onClick={() => handleNumberClick(num)}
        >
          {num}
        </div>
      ))}
    </div>
  ), [gameOver, numbers, positions, clickedNumber, handleNumberClick]);

  return (
    <div className="game-container">
      <h1 className={`status-message ${
        title === "ALL CLEARED" ? "all-cleared" : 
        title === "GAME OVER" ? "game-over" : ""
      }`}>
        {title}
      </h1>
      <div className="game-info">
        <label>Points:</label>
        <input
          type="number"
          value={inputPoints}
          min="1"
          max="1000"
          onChange={handleInputPointsChange}
        />
        <p>Time: {time.toFixed(1)}s</p>
        <button onClick={startGame}>
          {gameStarted ? "Restart" : "Play"}
        </button>
      </div>
      {gameBoard}
    </div>
  );
}

export default Game;