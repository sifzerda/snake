import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';
import { create } from 'zustand';

import StartGame from './StartGame';
import HighScores from './HighScores';
import FinalScore from './FinalScore';

import snakeHeadPx from '/images/snakeHead.png';
import snakeSegPx from '/images/snakeSeg.jpg';
import snakeEndPx from '/images/snakeEnd.jpg';
import snakeBendPx from '/images/snakeBend.jpg';

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
  const [time, setTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('right'); // New state for direction
  const [screen, setScreen] = useState('start');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (screen === 'game' && canvasRef.current) {
      initializeGame();
    }

    return () => {
      if (engine) {
        Matter.Engine.clear(engine);
      }
    };
  }, [screen, canvasRef.current]);

  useEffect(() => {
    if (gameOver || !timerStarted) return;

    const timerInterval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameOver, timerStarted]);

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
  
// ----------------------------  BOUNDARIES ----------------------------------------------------------//

    const strokeColor = '#00fff0'; // Set the color for all strokes
  
    const boundaries = [
      Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 20, {
        isStatic: true,
        render: {
          strokeStyle: strokeColor, // color
          strokeWidth: 2, // width
        },
      }),
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 20, {
        isStatic: true,
        render: {
          strokeStyle: strokeColor, // color
          strokeWidth: 2, // width
        },
      }),
      Matter.Bodies.rectangle(0, canvas.height / 2, 20, canvas.height, {
        isStatic: true,
        render: {
          strokeStyle: strokeColor, // color
          strokeWidth: 2, // width
        },
      }),
      Matter.Bodies.rectangle(canvas.width, canvas.height / 2, 20, canvas.height, {
        isStatic: true,
        render: {
          strokeStyle: strokeColor, // color
          strokeWidth: 2, // width
        },
      }),
    ];
  
    Matter.World.add(world, boundaries);

// ----------------------------  SNAKE HEAD ----------------------------------------------------------//
  
    const head = Matter.Bodies.rectangle(100, 100, 20, 20, {
      frictionAir: 0,
      render: {
        sprite: {
          texture: snakeHeadPx,
          xScale: 0.9,
          yScale: 0.9,
        },
      },
    });
  
    const initialSnake = [head];
    setSnake(initialSnake);
  
    segmentPositions.current = [{ x: 100, y: 100 }];
    Matter.World.add(world, initialSnake);

    // ----------------------------  FOOD ----------------------------------------------------------//

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

    // ----------------------------  ENGINE RENDERING -----------------------------------------------//

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

  // ----------------------------  DIRECTION HANDLING --------------------------------------------//

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

      // set the head's render.sprite angle based on movement direction
      const angleMap = {
        up: Math.PI,
        down:  0,
        left: Math.PI / 2,
        right: -Math.PI / 2,
      };
      Matter.Body.setAngle(head, angleMap[direction]);

      setCurrentDirection(direction); // Update the current direction

      if (!timerStarted) {
        setTimerStarted(true);
      }
    }
  };

  useHotkeys('arrowup', () => handleDirection('up'), [snake]);
  useHotkeys('arrowdown', () => handleDirection('down'), [snake]);
  useHotkeys('arrowleft', () => handleDirection('left'), [snake]);
  useHotkeys('arrowright', () => handleDirection('right'), [snake]);

// ----------------------------  SNAKE GROWTH -----------------------------------------------//

  useEffect(() => {
    if (!engine) return;

    const updateSegments = () => {
      if (snake.length > 1) {
        const headPosition = { ...snake[0].position };
        const newSegmentPositions = [headPosition, ...segmentPositions.current.slice(0, snake.length - 1)];
    
        // Update all segments
        snake.forEach((segment, index) => {
          if (index > 0) {
            const newPosition = newSegmentPositions[index];
            Matter.Body.setPosition(segment, newPosition);
    
            // Calculate angle based on position of next segment
            const nextSegment = snake[index - 1];
            const dx = nextSegment.position.x - segment.position.x;
            const dy = nextSegment.position.y - segment.position.y;
            const angle = Math.atan2(dy, dx);
            Matter.Body.setAngle(segment, angle);
    
            // Update sprite texture based on position
            if (index === snake.length - 1) {
              segment.render.sprite.texture = snakeEndPx;
            } else {
              const prevSegment = snake[index + 1];
              if (prevSegment) {
                const prevDx = prevSegment.position.x - segment.position.x;
                const prevDy = prevSegment.position.y - segment.position.y;
                const isTurning = Math.abs(prevDx - dx) > 1 || Math.abs(prevDy - dy) > 1;
                segment.render.sprite.texture = isTurning ? snakeBendPx : snakeSegPx;
              } else {
                segment.render.sprite.texture = snakeSegPx;
              }
            }
          }
        });
    
        segmentPositions.current = newSegmentPositions;
    
        // Ensure the head is always rendered above other segments
        const head = snake[0];
        const segments = snake.slice(1);
        Matter.World.remove(engine.world, [head]); // Remove head
        Matter.World.add(engine.world, [head]);   // Add head last
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', updateSegments);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', updateSegments);
    };
  }, [engine, snake]);

  // ----------------------------  COLLISION DETECTION (CD) -----------------------------------------------//

  useEffect(() => {
    if (!engine) return;
// ----------------------------- CD: snake head x food -------------------------------------------------//
    const checkFoodCollision = () => {
      const head = snake[0];
      if (food && Matter.Query.collides(head, [food]).length > 0) {
        Matter.Body.setPosition(food, {
          x: Math.random() * 780 + 10,
          y: Math.random() * 580 + 10,
        });
// ------------------------------------ SNAKE TAIL -------------------------------------------//
        const lastSegmentPosition = segmentPositions.current[segmentPositions.current.length - 1];
        const newSegment = Matter.Bodies.rectangle(lastSegmentPosition.x, lastSegmentPosition.y, 20, 20, {
          frictionAir: 0,
          isSensor: true,
          render: //{ fillStyle: '#00ff00' },
          {
            sprite: {
              texture: snakeSegPx,
              xScale: 0.9,
              yScale: 0.9,
          },
          },
        
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

// ----------------------------- CD: snake head x walls -------------------------------------------------//

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

// ----------------------------- CD: snake head x snake segments -------------------------------------------------//

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

// ----------------------------- GAME OVER -------------------------------------------------//

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
    setScreen('game');
  };

  // ----------------------------- SCREEN HANDLING -------------------------------------------------//

  if (screen === 'start') {
    return (
      <StartGame
        onStartGame={() => setScreen('game')}
        onViewHighScores={() => setScreen('highScores')}
      />
    );
  }

  if (screen === 'highScores') {
    return (
      <HighScores 
      onBackToMenu={() => setScreen('start')}
      onBack={() => setScreen('start')} />
    );
  }

  if (gameOver) {
    return (
      <FinalScore 
        score={score}
        time={time}
        onRestart={restartGame}
        onBackToMenu={() => setScreen('start')}
        onViewHighScores={() => setScreen('highScores')}
      />
    );
  }

  // ---------------------------- rendering ---------------------------------//

  return (
    <div>
      {gameOver && <div className="game-over">Game Over</div>}
      <div className="timer">Time: {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}</div>
      <div className="score">Score: {score}</div>

  {/*  --------------------------------------   restart button inside game
      <button onClick={restartGame}>New Game</button>
  ------------------------------------------*/}

      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default SnakeGame;