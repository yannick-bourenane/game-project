const targetMap = document.getElementById("map");
let addItem = document.createElement("div");
const mapBlock = `<div class="block"></div>`;
const keyMoove = ["z", "q", "s", "d"];

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
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
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
    let xNew = this.x;
    let yNew = this.y;

    if (key === "z") {
      direction = "up";
      if (xNew !== 0) {
        if (updatedMap[xNew - 1][yNew] !== `obstacle`) xNew--;
      }
    }
    if (key === "s") {
      direction = "down";
      if (xNew !== mapHeight - 1) {
        if (updatedMap[xNew + 1][yNew] !== `obstacle`) xNew++;
      }
    }
    if (key === "q") {
      direction = "left";
      if (yNew !== 0) {
        if (updatedMap[xNew][yNew - 1] !== `obstacle`) yNew--;
      }
    }
    if (key === "d") {
      direction = "right";
      if (yNew !== mapWidth - 1) {
        if (updatedMap[xNew][yNew + 1] !== `obstacle`) yNew++;
      }
    }
    // do an if xy is empty
    if (xNew !== this.x || yNew !== this.y) {
      this.updatePosition(xNew, yNew, direction);
    }
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
        `.x${oldX + i}.y${oldY + j} .${getType}`
      );
      item.remove();
    }

    function addNewPosition(i, j) {
      // Code
      checkLimits(getName, x, y);
      updatedMap[x + i][y + j] = getType;
      // DOM
      let newItem = targetMap.querySelector(`.x${x + i}.y${y + j}`);

      addItem = document.createElement("div");
      addItem.className = `moving ${direction}`;
      addItem.className += ` ${getType}`;
      if (x + i === x && y + j === y) addItem.className += ` main`;

      newItem.appendChild(addItem);
    }
    targetAroundElement(removeInitialPosition);
    targetAroundElement(addNewPosition);

    // Creates a timeout to remove the GIF 0.5seconds after the moove
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(function() {
      targetMap
        .querySelector(`.x${x}.y${y} .${getType}.main`)
        .classList.remove(`moving`);
    }, 500);

    this.x = x;
    this.y = y;

    if (x === mapWidth - 3 && y === mapHeight - 3) {
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
}

const player1 = new Doggy("Rex", "dog", 1, 1, 3);
const rock = new MapElement("Rock", "obstacle", 15, 15);

function checkLimits(name, x, y) {
  if (x < 1 || x > mapHeight - 1 || y < 1 || y > mapWidth - 1) {
    throw new Error(`${name} is out of map`);
  }
  return true;
}

function addElement(hero, ennemies, obstacles) {
  updatedMap = [...emptyMap];

  checkLimits(hero.name, hero.x, hero.y);

  function addHero(i, j) {
    updatedMap[hero.x + i][hero.y + j] = `${hero.type}`;
    if (hero.x + i === hero.x && hero.y + j === hero.y)
      updatedMap[hero.x + i][hero.y + j] += ` main`;
  }
  targetAroundElement(addHero);

  function addObstacles(i, j) {
    updatedMap[obstacles.x + i][obstacles.y + j] = `${obstacles.type}`;
    if (obstacles.x + i === obstacles.x && obstacles.y + j === obstacles.y)
      updatedMap[obstacles.x + i][obstacles.y + j] += ` main`;
  }
  targetAroundElement(addObstacles);

  return updatedMap;
}

addElement(player1, 0, rock);

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
  }
});
