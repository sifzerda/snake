// snake with react spring

import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 100, y: 100 }]);
  const [food, setFood] = useState({ x: 300, y: 300 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameInterval, setGameInterval] = useState(null);

  useEffect(() => {
    // Start the game loop
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        newSnake.unshift(head);
        newSnake.pop();

        // Check collision with food
        if (head.x < food.x + 10 &&
            head.x + 20 > food.x &&
            head.y < food.y + 10 &&
            head.y + 20 > food.y) {
          setFood({
            x: Math.random() * (canvasRef.current.width - 20),
            y: Math.random() * (canvasRef.current.height - 20)
          });

          newSnake.push({ ...newSnake[newSnake.length - 1] });
        }

        return newSnake;
      });
    }, 100);

    setGameInterval(interval);

    // Clean up on component unmount
    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -20 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 20 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -20, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 20, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const snakeElements = snake.map((segment, index) => (
    <animated.div
      key={index}
      style={{
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: 'green',
        left: segment.x,
        top: segment.y
      }}
    />
  ));

  return (
    <div ref={canvasRef} style={{ position: 'relative', width: 800, height: 600, backgroundColor: 'black' }}>
      {snakeElements}
      <animated.div
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          backgroundColor: 'red',
          left: food.x,
          top: food.y
        }}
      />
    </div>
  );
};

export default SnakeGame;