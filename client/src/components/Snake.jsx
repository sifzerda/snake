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

const SnakeGame = () => {
  const { snake, food, engine, setSnake, setFood, setEngine } = useGameStore();
  const segmentPositions = useRef([]);
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);

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
      render: { fillStyle: 'red' },
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
        Matter.Body.setPosition(food, {
          x: Math.random() * 780 + 10,
          y: Math.random() * 580 + 10,
        });

        const lastSegmentPosition = segmentPositions.current[segmentPositions.current.length - 1];
        const newSegment = Matter.Bodies.rectangle(lastSegmentPosition.x, lastSegmentPosition.y, 20, 20, {
          frictionAir: 0,
          isSensor: true,
          render: { fillStyle: 'green' },
        });

        setSnake([...snake, newSegment]);
        segmentPositions.current.push({ ...lastSegmentPosition });
        Matter.World.add(engine.world, newSegment);
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
    <div>
      {gameOver && <div className="game-over">Game Over</div>}
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default SnakeGame;