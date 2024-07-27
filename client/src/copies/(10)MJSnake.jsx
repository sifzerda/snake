// customize random food objects and colors

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';
import { create } from 'zustand';
//import useSound from 'use-sound';

// Creates Zustand store
const useGameStore = create((set) => ({
  snake: [],
  food: null,
  engine: null,
  setSnake: (snake) => set({ snake }),
  setFood: (food) => set({ food }),
  setEngine: (engine) => set({ engine }),
}));

const emojis = [
  { emoji: '🍇', color: '#6D6E00' },
  { emoji: '🍉', color: '#F4A300' },
  { emoji: '🍌', color: '#F2C700' },
  { emoji: '🍍', color: '#F1C30F' },
  { emoji: '🍑', color: '#F77F9C' },
  { emoji: '🍒', color: '#E53935' },
  { emoji: '🍓', color: '#D32F2F' },
  { emoji: '🍄', color: '#9E9E9E' }
];

const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

const SnakeGame = () => {
  const { snake, food, engine, setSnake, setFood, setEngine } = useGameStore();
  const segmentPositions = useRef([]);
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [foodEmoji, setFoodEmoji] = useState(getRandomEmoji());

  //const [playCollisionSound] = useSound('/sounds/collision.mp3');
  //const [playFoodSound] = useSound('/sounds/food.mp3');

  useEffect(() => {
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
      render: { fillStyle: 'green' },
    })];

    setSnake(initialSnake);

    segmentPositions.current = [{ x: 100, y: 100 }];
    Matter.World.add(world, initialSnake);

    const foodObject = Matter.Bodies.circle(300, 300, 10, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: 'transparent' }, // Initially invisible
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
  }, [setSnake, setFood, setEngine, gameOver]);

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

    const checkCollision = () => {
      const head = snake[0];
      if (Matter.Query.collides(head, [food]).length > 0) {
        //playFoodSound();
        // Randomly select a new emoji
        setFoodEmoji(getRandomEmoji());

        // Move the food to a new position
        Matter.Body.setPosition(food, {
          x: Math.random() * 780 + 10,
          y: Math.random() * 580 + 10,
        });

        // Calculate a new position for the new segment with a slight offset
        const segmentSize = 20; // Width/height of the segment
        const distance = segmentSize * 3; // Distance between segments, adjust as needed

        // Determine the direction of the last segment to place the new segment farther away
        const lastSegmentPosition = segmentPositions.current[segmentPositions.current.length - 1];
        const direction = {
          x: Math.sign(lastSegmentPosition.x - snake[1]?.position.x) || 1,
          y: Math.sign(lastSegmentPosition.y - snake[1]?.position.y) || 1,
        };

        // Calculate new position based on direction
        const newSegmentPosition = {
          x: lastSegmentPosition.x + distance * direction.x,
          y: lastSegmentPosition.y + distance * direction.y,
        };

        // Create and position the new segment
        const newSegment = Matter.Bodies.rectangle(newSegmentPosition.x, newSegmentPosition.y, segmentSize, segmentSize, {
          frictionAir: 0,
          isSensor: true,
          render: { fillStyle: 'green' },
        });

        // Check if the new segment position is not overlapping with existing ones
        const isValidPosition = !snake.some(segment => Matter.Query.collides(newSegment, [segment]).length > 0);

        if (isValidPosition) {
          // Add the new segment
          setSnake([...snake, newSegment]);
          segmentPositions.current.push({ ...newSegmentPosition });
          Matter.World.add(engine.world, newSegment);
        }
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', checkCollision);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', checkCollision);
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
          //playCollisionSound();
          break;
        }
      }
    };

    Matter.Events.on(engine, 'beforeUpdate', checkWallCollision);

    return () => {
      Matter.Events.off(engine, 'beforeUpdate', checkWallCollision);
    };
  }, [engine, snake]);

  return (
    <div style={{ position: 'relative' }}>
      {gameOver && <div className="game-over">Game Over</div>}
      <canvas ref={canvasRef} width={800} height={600} />
      {/* Render food emoji with its color */}
      <div
        style={{
          position: 'absolute',
          top: food ? `${food.position.y}px` : 0,
          left: food ? `${food.position.x}px` : 0,
          fontSize: '20px', // Adjust size as needed
          color: foodEmoji.color, // Set color based on emoji
          pointerEvents: 'none', // Ensure it does not block canvas interactions
        }}
      >
        {foodEmoji.emoji}
      </div>
    </div>
  );
};

export default SnakeGame;