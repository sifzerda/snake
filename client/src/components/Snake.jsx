import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(null);

  useEffect(() => {
    // Set up Matter.js
    const engine = Matter.Engine.create();
    const world = engine.world;

    // Disable gravity
    engine.gravity.y = 0;
    engine.gravity.x = 0;

    // Set up the renderer
    const canvas = canvasRef.current;
    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false
      }
    });

    // Create boundaries
    const boundaries = [
      Matter.Bodies.rectangle(canvas.width / 2, 0, canvas.width, 20, { isStatic: true }), // Top boundary
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 20, { isStatic: true }), // Bottom boundary
      Matter.Bodies.rectangle(0, canvas.height / 2, 20, canvas.height, { isStatic: true }), // Left boundary
      Matter.Bodies.rectangle(canvas.width, canvas.height / 2, 20, canvas.height, { isStatic: true }) // Right boundary
    ];

    // Add boundaries to the world
    Matter.World.add(world, boundaries);

    // Create a moving snake
    const initialSnake = Matter.Bodies.rectangle(100, 100, 20, 20, {
      frictionAir: 0, // snake will not slow down
      render: {
        fillStyle: 'green'
      }
    });

    setSnake(initialSnake);

    // Add the snake to the world
    Matter.World.add(world, initialSnake);

    // Custom update loop to ensure snake moves
    const update = () => {
      Matter.Engine.update(engine, 1000 / 60); // Update the engine at 60 FPS
      requestAnimationFrame(update);
    };

    // Run the renderer
    Matter.Render.run(render);
    update(); // Start the custom update loop

    // Clean up on component unmount
    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!snake) return;

      switch (event.key) {
        case 'ArrowUp':
          Matter.Body.setVelocity(snake, { x: 0, y: -5 });
          break;
        case 'ArrowDown':
          Matter.Body.setVelocity(snake, { x: 0, y: 5 });
          break;
        case 'ArrowLeft':
          Matter.Body.setVelocity(snake, { x: -5, y: 0 });
          break;
        case 'ArrowRight':
          Matter.Body.setVelocity(snake, { x: 5, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default SnakeGame;