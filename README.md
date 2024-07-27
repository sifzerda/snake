# SNAKE 🐍

Current games in gamestack:

- [ ] Minesweeper
- [ ] Solitaire
- [ ] Asteroids
- [ ] 8 Ball Pool
- [x] Snake

## Table of Contents

1. Description
2. Badges
3. Visuals
4. Installation
5. Usage
6. Dev Stuff: Building
7. Bugs 
8. To do
9. To do for all games
10. Support
11. Contributing 
12. Authors and acknowledgment
13. License
14. Project status

## (1) Description

Part of my personal project to create a react MERN stack app which has a number of simple games. I used trial and error and ChatGPT prompting. 

As this is a fairly simple game, it didn't need to be broken up into multiple build stages as the previous games. 
It started with a moving snake, configuring snake movement/physics, and then adding snake growth dynamic.
 
Lessons learned from building this project:

- Not all moving bodies/objects in matter.js need physics, and there are alternate ways of creating 'non-physics' objects in matter.js.  
- Using react reducers and zustand
- Matter.Query and Matter.Bounds instead of a 'collision' fx for more precise collision detection

## (2) Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) 
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) 
![Matter.js](https://img.shields.io/badge/Matter.js-4B5562.svg?style=for-the-badge&logo=matterdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![FontAwesome](https://img.shields.io/badge/Font%20Awesome-538DD7.svg?style=for-the-badge&logo=Font-Awesome&logoColor=white) 
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## (3) Visuals

[Visit App deployed to Heroku](https://....com/)

[INSERT SCREENSHOT HERE]

## (4) Installation

```bash
git clone https://github.com/sifzerda/snake.git
cd snake
npm install
npm run start
```

## (5) Usage

Parts:
 
 - Start screen
 - Game
 - Final score page + score submission
 - High scores page
 - If logged on: profile page with User scores.

## (6) Dev Stuff: Building:

### Tech used:
- ~~React-Spring~~ this was used but replaced with matter.js
- ~~React transition group~~ replaced with matter.js
- Matter.js
- useHotkeys: hook for handling movement controls, (not essential, can manage with switch statement)
-  zustand: handles react reducers to manage game state
-  useSound: add audio fx

-  

 

 




I initially tried making the game using both matter.js and react-spring.  The game can work in react-spring but lacks the physics dynamic and seamless animation.

Matter.js had an issue where the snake segments had their own physics and collision with the snake head, which caused erratic movement with more segments. UseState had to track the head and copy/spread the snake head so segments mirrored the head and did not move independently.
Also had an issue implementing collision between snake head and body; since head is always touching body this constantly triggered game over for snake running into itself. Have to make collision detectors in snake separate and smaller - inside snake segments - same as I did with pocket detectors in 8 ball pool.

1. <u>'useState':</u> useStates track the snake head, food, and matter.js engine;
2. <u>'const initialSnake':</u> Creates the snake head;
3. <u>'const foodObject':</u> creates static 'sensor' food objects;
4. <u>'const handleKeyDown':</u> sets movement controls;
5. <u>'const updateSegments', 'const updatedDecks'</u> adds segments to snake, spreading existing snake. Segment parts are copies of the head which mirror the head movement;
6. <u>'const checkCollision':</u> handles collision between snake head and food objects; food is removed and reset to a random position, and a segment is added to the snake head;
7. <u>'const newSegment':</u> segments are 'sensors' so they do not interfere with snake head physics.

## (7) Bugs: 

- xxx
- xxx
- xxx

## (8) To do: 

- [ ] create moving snake
- [ ] create food which randomly resets position once 'eaten'
- [ ] segments add to snake;
  - [ ] segments added to snake don't interfere with movement physics;
- [ ] add render.sprite to snake head, segments, and food
- [ ] difficulty ramp: snake moves faster as it gets longer
- [ ] score with food eaten
- [ ] timer for game session
- [ ] highscores
- [ ] main screen
- [ ] submit score
- [ ] exit game from game screen

## (10) Support

For support, users can contact tydamon@hotmail.com.

## (11) Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add some NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request

## (12) Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project, including:

- ChatGPT

## (13) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (14) Project status

This project is incomplete.
