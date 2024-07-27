// working snake with matterjs
// added usehotkeys

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';

const SnakeGame = () => {
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(null);
  const [engine, setEngine] = useState(null);

  const segmentPositions = useRef([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Set up Matter.js
    const newEngine = Matter.Engine.create();
    const world = newEngine.world;

    // Disable gravity
    newEngine.gravity.y = 0;
    newEngine.gravity.x = 0;

    // Set up the renderer
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

    // Create world boundaries
    const boundaries = [
      Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 20, { isStatic: true }), // Top boundary
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 20, { isStatic: true }), // Bottom boundary
      Matter.Bodies.rectangle(0, canvas.height / 2, 20, canvas.height, { isStatic: true }), // Left boundary
      Matter.Bodies.rectangle(canvas.width, canvas.height / 2, 20, canvas.height, { isStatic: true }), // Right boundary
    ];

    // Add boundaries to the world
    Matter.World.add(world, boundaries);

    // Create a moving snake
    const initialSnake = [Matter.Bodies.rectangle(100, 100, 20, 20, {
      frictionAir: 0, // snake will not slow down
      render: {
        fillStyle: 'green',
      },
    })];

    setSnake(initialSnake);

    // Initialize segment positions
    segmentPositions.current = [{ x: 100, y: 100 }];

    // Add the snake to the world
    Matter.World.add(world, initialSnake);

    // Create food object
    const foodObject = Matter.Bodies.circle(300, 300, 10, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: 'red',
      },
    });

    setFood(foodObject);
    Matter.World.add(world, foodObject);

    // Custom update loop to ensure snake moves
    const update = () => {
      Matter.Engine.update(newEngine, 1000 / 60); // Update the engine at 60 FPS
      requestAnimationFrame(update);
    };

    // Run the renderer
    Matter.Render.run(render);
    update(); // Start the custom update loop

    setEngine(newEngine);

    // Clean up on component unmount
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(newEngine);
    };
  }, []);

  // Use react-hotkeys-hook for handling keyboard input
  useHotkeys('arrowup', () => {
    if (snake.length > 0) {
      Matter.Body.setVelocity(snake[0], { x: 0, y: -5 });
    }
  }, [snake]);
  useHotkeys('arrowdown', () => {
    if (snake.length > 0) {
      Matter.Body.setVelocity(snake[0], { x: 0, y: 5 });
    }
  }, [snake]);
  useHotkeys('arrowleft', () => {
    if (snake.length > 0) {
      Matter.Body.setVelocity(snake[0], { x: -5, y: 0 });
    }
  }, [snake]);
  useHotkeys('arrowright', () => {
    if (snake.length > 0) {
      Matter.Body.setVelocity(snake[0], { x: 5, y: 0 });
    }
  }, [snake]);

  useEffect(() => {
    if (!engine) return;

    const updateSegments = () => {
      if (snake.length > 1) {
        // Update segment positions to follow the head
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

    const checkCollision = Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        if ((pair.bodyA === food && snake.includes(pair.bodyB)) || (pair.bodyB === food && snake.includes(pair.bodyA))) {
          // Move the food to a new random location
          Matter.Body.setPosition(food, {
            x: Math.random() * 780 + 10,
            y: Math.random() * 580 + 10,
          });

          // Add two new segments to the snake
          const lastSegmentPosition1 = segmentPositions.current[segmentPositions.current.length - 1];
          const newSegment1 = Matter.Bodies.rectangle(lastSegmentPosition1.x, lastSegmentPosition1.y, 20, 20, {
            frictionAir: 0,
            isSensor: true,
            render: {
              fillStyle: 'green',
            },
          });

          const lastSegmentPosition2 = { ...lastSegmentPosition1 }; // Duplicate last segment position for second segment
          const newSegment2 = Matter.Bodies.rectangle(lastSegmentPosition2.x, lastSegmentPosition2.y, 20, 20, {
            frictionAir: 0,
            isSensor: true,
            render: {
              fillStyle: 'green',
            },
          });

          setSnake((prevSnake) => [...prevSnake, newSegment1, newSegment2]);
          segmentPositions.current.push({ ...lastSegmentPosition1 }, { ...lastSegmentPosition2 });
          Matter.World.add(engine.world, [newSegment1, newSegment2]);
        }
      });
    });

    return () => {
      Matter.Events.off(engine, 'collisionStart', checkCollision);
    };
  }, [engine, snake, food]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default SnakeGame;