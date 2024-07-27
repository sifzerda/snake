// working snake with matterjs
// added usehotkeys
// added a reducer to hold game state
// added use sound (commented out) for adding game sound


import { useEffect, useRef, useReducer } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';
//import useSound from 'use-sound';

const initialState = {
  snake: [],
  food: null,
  engine: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SNAKE':
      return { ...state, snake: action.payload };
    case 'SET_FOOD':
      return { ...state, food: action.payload };
    case 'SET_ENGINE':
      return { ...state, engine: action.payload };
    default:
      return state;
  }
}

const SnakeGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const segmentPositions = useRef([]);
  const canvasRef = useRef(null);

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

    dispatch({ type: 'SET_SNAKE', payload: initialSnake });

    segmentPositions.current = [{ x: 100, y: 100 }];
    Matter.World.add(world, initialSnake);

    const foodObject = Matter.Bodies.circle(300, 300, 10, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: 'red' },
    });

    dispatch({ type: 'SET_FOOD', payload: foodObject });
    Matter.World.add(world, foodObject);

    const update = () => {
      Matter.Engine.update(newEngine, 1000 / 60);
      requestAnimationFrame(update);
    };

    Matter.Render.run(render);
    update();

    dispatch({ type: 'SET_ENGINE', payload: newEngine });

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(newEngine);
    };
  }, []);

  const handleDirection = (direction) => {
    if (state.snake.length > 0) {
      const head = state.snake[0];
      const velocityMap = {
        up: { x: 0, y: -5 },
        down: { x: 0, y: 5 },
        left: { x: -5, y: 0 },
        right: { x: 5, y: 0 },
      };
      Matter.Body.setVelocity(head, velocityMap[direction]);
    }
  };

  useHotkeys('arrowup', () => handleDirection('up'), [state.snake]);
  useHotkeys('arrowdown', () => handleDirection('down'), [state.snake]);
  useHotkeys('arrowleft', () => handleDirection('left'), [state.snake]);
  useHotkeys('arrowright', () => handleDirection('right'), [state.snake]);

  useEffect(() => {
    if (!state.engine) return;

    const updateSegments = () => {
      if (state.snake.length > 1) {
        const headPosition = { ...state.snake[0].position };
        const newSegmentPositions = [headPosition, ...segmentPositions.current.slice(0, state.snake.length - 1)];

        state.snake.forEach((segment, index) => {
          if (index > 0) {
            const newPosition = newSegmentPositions[index];
            Matter.Body.setPosition(segment, newPosition);
          }
        });

        segmentPositions.current = newSegmentPositions;
      }
    };

    Matter.Events.on(state.engine, 'beforeUpdate', updateSegments);

    return () => {
      Matter.Events.off(state.engine, 'beforeUpdate', updateSegments);
    };
  }, [state.engine, state.snake]);

  useEffect(() => {
    if (!state.engine) return;

    const checkCollision = Matter.Events.on(state.engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        if ((pair.bodyA === state.food && state.snake.includes(pair.bodyB)) || (pair.bodyB === state.food && state.snake.includes(pair.bodyA))) {
          //playFoodSound();
          Matter.Body.setPosition(state.food, {
            x: Math.random() * 780 + 10,
            y: Math.random() * 580 + 10,
          });

          const lastSegmentPosition1 = segmentPositions.current[segmentPositions.current.length - 1];
          const newSegment1 = Matter.Bodies.rectangle(lastSegmentPosition1.x, lastSegmentPosition1.y, 20, 20, {
            frictionAir: 0,
            isSensor: true,
            render: { fillStyle: 'green' },
          });

          const lastSegmentPosition2 = { ...lastSegmentPosition1 };
          const newSegment2 = Matter.Bodies.rectangle(lastSegmentPosition2.x, lastSegmentPosition2.y, 20, 20, {
            frictionAir: 0,
            isSensor: true,
            render: { fillStyle: 'green' },
          });

          dispatch({ type: 'SET_SNAKE', payload: [...state.snake, newSegment1, newSegment2] });
          segmentPositions.current.push({ ...lastSegmentPosition1 }, { ...lastSegmentPosition2 });
          Matter.World.add(state.engine.world, [newSegment1, newSegment2]);
        }
      });
    });

    return () => {
      Matter.Events.off(state.engine, 'collisionStart', checkCollision);
    };
  }, [state.engine, state.snake, state.food]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
};

export default SnakeGame;