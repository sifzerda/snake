// WORKING RESTART BUTTON INSIDE GAME

// working snake with matterjs
// added usehotkeys
// zustand reducer to hold game state
// added use sound (commented out) for adding game sound
// simplified segment adding code
// simplified and made more precise collision detection code

// game over state when collision with wall boundary
// game over state when collision with snake body (minus first 10 segments)
// new game works during game
// new game works after game over

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';
import { create } from 'zustand';

const useGameStore = create((set) => ({
  snake: [],
  food: null,
  engine: null,
  setSnake: (snake) => set({ snake }),
  setFood: (food) => set({ food }),
  setEngine: (engine) => set({ engine }),
}));

const SnakeGame = () => {
  const { snake, food, engine, setSnake, setFood, setEngine } = useGameStore();
  const segmentPositions = useRef([]);
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0); // Timer state
  const [timerStarted, setTimerStarted] = useState(false); // Timer start state
  const [score, setScore] = useState(0); // Score state

  const initializeGame = () => {
    const newEngine = Matter.Engine.create();
    const world = newEngine.world;

    newEngine.gravity.y = 0;
    newEngine.gravity.x = 0;

    const canvas = canvasRef.current;
    const render = Matter.Render.create({
      canvas: canvas,
      engine: newEngine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
      },
    });

    const boundaries = [
      Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 20, { isStatic: true }),
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 20, { isStatic: true }),
      Matter.Bodies.rectangle(0, canvas.height / 2, 20, canvas.height, { isStatic: true }),
      Matter.Bodies.rectangle(canvas.width, canvas.height / 2, 20, canvas.height, { isStatic: true }),
    ];

    Matter.World.add(world, boundaries);

    const initialSnake = [Matter.Bodies.rectangle(100, 100, 20, 20, {
      frictionAir: 0,
      render: { fillStyle: '#00ff00' },
    })];
    
    setSnake(initialSnake);

    segmentPositions.current = [{ x: 100, y: 100 }];
    Matter.World.add(world, initialSnake);

    const emojiCanvas = document.createElement('canvas');
    const emojiContext = emojiCanvas.getContext('2d');
    emojiCanvas.width = 30;
    emojiCanvas.height = 30;
    emojiContext.font = '20px sans-serif';
    emojiContext.fillText('🍏', 0, 20);

    emojiContext.globalCompositeOperation = 'source-atop';
    emojiContext.fillStyle = '#f02652';
    emojiContext.fillRect(0, 0, emojiCanvas.width, emojiCanvas.height);

    const foodObject = Matter.Bodies.circle(300, 300, 10, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: emojiCanvas.toDataURL(),
          xScale: 1.3,
          yScale: 1.3,
        },
      },
    });

    setFood(foodObject);
    Matter.World.add(world, foodObject);

    const update = () => {
      if (!gameOver) {
        Matter.Engine.update(newEngine, 1000 / 60);
        requestAnimationFrame(update);
      }
    };

    Matter.Render.run(render);
    update();

    setEngine(newEngine);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(newEngine);
    };
  };

  useEffect(() => {
    initializeGame();

    return () => {
      if (engine) {
        Matter.Engine.clear(engine);
      }
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || !timerStarted) return;

    const timerInterval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameOver, timerStarted]);

  const handleDirection = (direction) => {
    if (snake.length > 0) {
      const head = snake[0];
      const velocityMap = {
        up: { x: 0, y: -5 },
        down: { x: 0, y: 5 },
        left: { x: -5, y: 0 },
        right: { x: 5, y: 0 },
      };
      Matter.Body.setVelocity(head, velocityMap[direction]);

      if (!timerStarted) {
        setTimerStarted(true);
      }
    }
  };

  useHotkeys('arrowup', () => handleDirection('up'), [snake]);
  useHotkeys('arrowdown', () => handleDirection('down'), [snake]);
  useHotkeys('arrowleft', () => handleDirection('left'), [snake]);
  useHotkeys('arrowright', () => handleDirection('right'), [snake]);

  useEffect(() => {
    if (!engine) return;

    const updateSegments = () => {
      if (snake.length > 1) {
        const headPosition = { ...snake[0].position };
        const newSegmentPositions = [headPosition, ...segmentPositions.current.slice(0, snake.length - 1)];

        snake.forEach((segment, index) => {
          if (index > 0) {
            const newPosition = newSegmentPositions[index];
            Matter.Body.setPosition(segment, newPosition);
          }
        });

        segmentPositions.current = newSegmentPositions;
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', updateSegments);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', updateSegments);
    };
  }, [engine, snake]);

  useEffect(() => {
    if (!engine) return;

    const checkFoodCollision = () => {
      const head = snake[0];
      if (Matter.Query.collides(head, [food]).length > 0) {
        Matter.Body.setPosition(food, {
          x: Math.random() * 780 + 10,
          y: Math.random() * 580 + 10,
        });

        const lastSegmentPosition = segmentPositions.current[segmentPositions.current.length - 1];
        const newSegment = Matter.Bodies.rectangle(lastSegmentPosition.x, lastSegmentPosition.y, 20, 20, {
          frictionAir: 0,
          isSensor: true,
          render: { fillStyle: '#00ff00' },
        });

        setSnake([...snake, newSegment]);
        segmentPositions.current.push({ ...lastSegmentPosition });
        Matter.World.add(engine.world, newSegment);

        // Increase score
        setScore((prevScore) => prevScore + 15);
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', checkFoodCollision);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', checkFoodCollision);
    };
  }, [engine, snake, food, setSnake]);

  useEffect(() => {
    if (!engine) return;

    const checkWallCollision = () => {
      const head = snake[0];
      const boundaries = Matter.Composite.allBodies(engine.world).filter(body => body.isStatic);

      for (const boundary of boundaries) {
        if (Matter.Query.collides(head, [boundary]).length > 0) {
          setGameOver(true);
          break;
        }
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', checkWallCollision);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', checkWallCollision);
    };
  }, [engine, snake]);

  useEffect(() => {
    if (!engine) return;

    const checkSegmentCollision = () => {
      const head = snake[0];
      for (let i = 10; i < snake.length; i++) {
        if (Matter.Query.collides(head, [snake[i]]).length > 0) {
          setGameOver(true);
          break;
        }
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', checkSegmentCollision);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', checkSegmentCollision);
    };
  }, [engine, snake]);

  useEffect(() => {
    if (gameOver) {
      snake.forEach(segment => {
        segment.render.visible = false;
      });
    }
  }, [gameOver, snake]);

  const restartGame = () => {
    setGameOver(false);
    setTimerStarted(false);
    setTime(0);
    setScore(0);
    setSnake([]);
    setFood(null);
    initializeGame();
  };

  return (
    <div>
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="timer">Time: {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}</div>
      <div className="score">Score: {score}</div>
      <button onClick={restartGame}>New Game</button>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default SnakeGame;