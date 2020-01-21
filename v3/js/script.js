const targetMap = document.getElementById("map");
let addItem = document.createElement("div");
const mapBlock = `<div class="block"></div>`;
const keyMoove = ["z", "q", "s", "d"];
const aroundElement = 1;

let title = document.getElementById("map_title");
let emptyMap = [];
let updatedMap;
let mapWidth;
let mapHeight;
let direction;

// Create a map with a name, a width and a height
function createMap(name, width, height) {
  mapWidth = width;
  mapHeight = height;
  // pushing the height as row
  for (let i = 0; i < mapHeight; i++) {
    emptyMap.push([]);
    // pushing the width as column
    for (let y = 0; y < mapWidth; y++) {
      emptyMap[i].push("");
    }
  }
  title.textContent = name;
  return emptyMap;
}
createMap("DogGo", 50, 50);
//createMap('map2', 30, 30);
function targetAroundElement(clbk) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      clbk(i, j);
    }
  }
}

// Defining a class for all map element
class MapElement {
  constructor(name, type, x, y) {
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
  }
}
// Defining a class for all movable elements
class Movable extends MapElement {
  constructor(name, type, x, y) {
    super(name, type, x, y);
  }
  mooveTo(key) {
    let direction;
    let targetMain;
    let xNew = this.x;
    let yNew = this.y;
    let getName = this.name;
    let getType = this.type;
    const directionsList = ['up', 'down', 'left', 'right']

    if (key === "z") {
      direction = 'up';
      targetMain = targetMap.querySelector(`.x${xNew}.y${yNew} .main.${getName}`);
      targetMain.classList.remove(...directionsList);
      targetMain.classList.add(direction);
      let xFuture = xNew - aroundElement;

      function getFuturePosition(i, j) {
        checkLimits(getName, xFuture + i, yNew + j)
        checkEmpty(getName, getType, xFuture + i, yNew + j);
      }
      targetAroundElement(getFuturePosition);
      xNew--;

    }
    if (key === "s") {
      direction = 'down';
      targetMain = targetMap.querySelector(`.x${xNew}.y${yNew} .main.${getName}`);
      targetMain.classList.remove(...directionsList);
      targetMain.classList.add(direction);
      let xFuture = xNew + aroundElement;

      function getFuturePosition(i, j) {
        checkLimits(getName, xFuture + i, yNew + j)
        checkEmpty(getName, getType, xFuture + i, yNew + j);
      }
      targetAroundElement(getFuturePosition);
      xNew++;
    }
    if (key === "q") {
      direction = 'left';
      targetMain = targetMap.querySelector(`.x${xNew}.y${yNew} .main.${getName}`);
      targetMain.classList.remove(...directionsList);
      targetMain.classList.add(direction);
      let yFuture = yNew - aroundElement;

      function getFuturePosition(i, j) {
        checkLimits(getName, xNew + i, yFuture + j)
        checkEmpty(getName, getType, xNew + i, yFuture + j);
      }
      targetAroundElement(getFuturePosition);
      yNew--;
    }
    if (key === "d") {
      direction = 'right';
      console.log(getName)
      targetMain = targetMap.querySelector(`.x${xNew}.y${yNew} .main.${getName}`);
      //console.log(targetMain)
      targetMain.classList.remove(...directionsList);
      targetMain.classList.add(direction);
      let yFuture = yNew + aroundElement;

      function getFuturePosition(i, j) {
        checkLimits(getName, xNew + i, yFuture + j)
        checkEmpty(getName, getType, xNew + i, yFuture + j);
      }
      targetAroundElement(getFuturePosition);
      yNew++;
    }
    this.updatePosition(xNew, yNew, direction);
  }
  updatePosition(x, y, direction) {
    const oldX = this.x;
    const oldY = this.y;
    const getType = this.type;
    const getName = this.name;

    function removeInitialPosition(i, j) {
      // Code
      updatedMap[oldX + i][oldY + j] = ``;
      // DOM
      let item = targetMap.querySelector(
        `.x${oldX + i}.y${oldY + j} .${getName}`
      );
      item.remove();
    }

    function addNewPosition(i, j) {
      let addMainClass = ``;
      if (x + i === x && y + j === y) addMainClass = ` main`;
      // Code
      checkLimits(getName, x, y);
      updatedMap[x + i][y + j] = `${getName} ${getType}${addMainClass}`;
      // DOM
      let newItem = targetMap.querySelector(`.x${x + i}.y${y + j}`);

      addItem = document.createElement("div");
      addItem.className = `moving ${direction}`;
      addItem.className += ` ${getName} ${getType}${addMainClass}`;

      newItem.appendChild(addItem);
    }
    targetAroundElement(removeInitialPosition);
    targetAroundElement(addNewPosition);

    // Creates a timeout to remove the GIF 0.5seconds after the moove
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(function () {
      targetMap
        .querySelector(`.x${x}.y${y} .${getName}.main`)
        .classList.remove(`moving`);
    }, 500);

    this.x = x;
    this.y = y;

    if (x === mapWidth - aroundElement * 2 && y === mapHeight - aroundElement * 2) {
      youWon();
    }

    function youWon() {
      console.log("you won !");
    }
  }
}
// Defining a class for the doggy
class Doggy extends Movable {
  constructor(name, type, x, y, actionCount) {
    super(name, type, x, y);
    // We'll work with 3 but we can change if we want
    this.actionCount = actionCount;
  }
  bark() {
    let targetFront;
    let targetFrontDom;
    let xTarget = this.x;
    let yTarget = this.y;
    const targetFrontMain = targetMap.querySelector(`.x${this.x}.y${this.y} .main.${this.name}`)
    // updatedMap doesnt have the main info and the direction
    if (targetFrontMain.classList.contains('up')) {
      xTarget = this.x - aroundElement * 2 - 1;
    } else if (targetFrontMain.classList.contains('down')) {
      xTarget = this.x + aroundElement * 2 + 1;
    } else if (targetFrontMain.classList.contains('left')) {
      yTarget = this.y - aroundElement * 2 - 1;
    } else if (targetFrontMain.classList.contains('right')) {
      yTarget = this.y + aroundElement * 2 + 1;
    }
    checkLimits(this.name, xTarget, yTarget);
    targetFront = updatedMap[xTarget][yTarget];
    if (targetFront.includes('removable') && targetFront.includes('main')) {
      function removeTargetFront(i, j) {
        // code
        updatedMap[xTarget + i][yTarget + j] = ``;
        // DOM
        targetFrontDom = targetMap.querySelector(`.x${xTarget+i}.y${yTarget+j}`);
        targetFrontDom.innerHTML = ``;
      }
      targetAroundElement(removeTargetFront);

    }

  }
}

const player1 = new Doggy("Rex", "dog", 1, 1, 3);
const enemy1 = new Movable("Bad_cat", "enemy", 5, 5);
const rock = new MapElement("Rock", "obstacle", 11, 11);
const rock2 = new MapElement("Rock2", "obstacle", 15, 15);
const rock3 = new MapElement("Rock3", "obstacle", 20, 20);
const rock4 = new MapElement("Rock4", "obstacle", 8, 8);
const cat1 = new MapElement("cat1", "obstacle removable", 12, 2);
const cat2 = new MapElement("cat1", "obstacle removable", 18, 9);

const obstaclesList = [];
obstaclesList.push(rock, rock2, rock3, rock4, cat1, cat2);

const enemiesList = [];
enemiesList.push(enemy1)

function checkLimits(name, x, y) {
  if (
    x < 0 ||
    x > mapHeight - aroundElement ||
    y < 0 ||
    y > mapWidth - aroundElement
  ) {
    throw new Error(
      `${name} or ${name} action => out of map - coordinates must be between [${aroundElement}][${aroundElement}] and [${mapWidth}][${mapHeight}]`
    );
  }
  return true;
}

function checkEmpty(name, type, x, y) {
  if (updatedMap[x][y] === `` || updatedMap[x][y].includes(`${name}`)) {
    return true
  }
  throw new Error(
    `${name} tries to take a space already occupied by ${updatedMap[x][y]}`
  );
}


function addElement(hero, enemies, obstacles) {
  updatedMap = [...emptyMap];

  function addHero(i, j) {
    // check issue with 0 0 doggo not throwing error message
    checkLimits(hero.name, hero.x, hero.y);
    checkEmpty(hero.name, hero.type, hero.x + i, hero.y + j)
    updatedMap[hero.x + i][hero.y + j] = `${hero.name} ${hero.type}`;
    if (hero.x + i === hero.x && hero.y + j === hero.y)
      updatedMap[hero.x + i][hero.y + j] += ` main`;
  }
  targetAroundElement(addHero);

  function addEnemies(i, j) {
    enemies.forEach(enemy => {
      checkLimits(enemy.name, enemy.x, enemy.y);
      checkEmpty(enemy.name, enemy.type, enemy.x + i, enemy.y + j)
      updatedMap[enemy.x + i][enemy.y + j] = `${enemy.name} ${enemy.type}`;
      if (enemy.x + i === enemy.x && enemy.y + j === enemy.y)
        updatedMap[enemy.x + i][enemy.y + j] += ` main`;
    });

  }
  targetAroundElement(addEnemies);

  function addObstacles(i, j) {
    obstacles.forEach(obstacle => {
      checkLimits(obstacle.name, obstacle.x + i, obstacle.y + j);
      checkEmpty(obstacle.name, obstacle.type, obstacle.x + i, obstacle.y + j)
      updatedMap[obstacle.x + i][obstacle.y + j] = `${obstacle.name} ${obstacle.type}`;
      if (obstacle.x + i === obstacle.x && obstacle.y + j === obstacle.y)
        updatedMap[obstacle.x + i][obstacle.y + j] += ` main`;
    });

  }
  targetAroundElement(addObstacles);

  return updatedMap;
}
// adding all the elements
addElement(player1, enemiesList, obstaclesList);

console.log(updatedMap)
// Show the map on the website with DOM, using previously created emptyMap
function showMap() {
  let showMap = emptyMap.forEach((xRows, x) => {
    let mapRow = document.createElement("div");
    mapRow.className = `row`;
    targetMap.appendChild(mapRow);
    xRows.forEach((yRows, y) => {
      let addBlock = (mapRow.innerHTML += mapBlock);
      let getLastBlock = mapRow.querySelector("div.block:last-of-type");
      getLastBlock.classList.add(`x${x}`, `y${y}`);
      if (yRows) {
        addItem.className = yRows;
        getLastBlock.appendChild(addItem);
      }
      return addBlock;
    });
  });
  return showMap;
}
showMap();

// Force focus on the map
targetMap.focus();
targetMap.addEventListener("focusout", e => targetMap.focus());

// listening to keyboard event
targetMap.addEventListener("keydown", e => {
  e.preventDefault();
  // Mooving actions
  if (keyMoove.includes(e.key)) {
    player1.mooveTo(e.key);
  }
  // Spacebar action
  if (e.key === ` `) {
    player1.bark();
  }
});

function mooveEnemies() {
  setInterval(function () {
    let intervalID = setInterval(function () {
      enemy1.mooveTo('d');
    }, 500);
    setTimeout(function () {
      clearInterval(intervalID);
      intervalID = setInterval(function () {
        enemy1.mooveTo('s');
      }, 500);
      setTimeout(function () {
        clearInterval(intervalID);
        intervalID = setInterval(function () {
          enemy1.mooveTo('z');
        }, 500);
        setTimeout(function () {
          clearInterval(intervalID);
          intervalID = setInterval(function () {
            enemy1.mooveTo('q');
          }, 500);
          setTimeout(function () {
            clearInterval(intervalID);
          }, 5000);
        }, 3000);
      }, 3000);
    }, 5000);
  }, 16000)
}
mooveEnemies();