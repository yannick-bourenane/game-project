const contentMain = document.getElementById("ajaxbox");

(function() {
  axios
    .get(`/intro.html`)
    .then(res => {
      contentMain.innerHTML = res.data;
      document
        .querySelectorAll("#ajaxbox .link")
        .forEach(link => (link.onclick = loadPage));
    })
    .catch(err => {
      console.error(err);
    });
})();

function loadPage(e) {
  let loadGame = false;
  const page = e.target.getAttribute("data-page");
  console.log(page);
  axios
    .get(`/${page}.html`)
    .then(res => {
      contentMain.innerHTML = res.data;
      if (page === `game`) {
        startGame();
      }
      document.querySelectorAll("#ajaxbox .link").forEach(link => {
        link.onclick = loadPage;
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function startGame() {
  const audioBark = document.getElementById("audio_bark");
  const audioBackground = document.getElementById("audio_background");
  const audioCatWakingUp = document.getElementById("audio_cat_waking_up");
  const audioCatAngry = document.getElementById("audio_cat_angry");
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
  // for now it needs to be a square
  createMap("DogGo", 48, 48);

  audioBackground.play();
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
      const directionsList = ["up", "down", "left", "right"];

      if (key === "z") {
        direction = "up";
        targetMain = targetMap.querySelector(
          `.x${xNew}.y${yNew} .main.${getName}`
        );
        targetMain.classList.remove(...directionsList);
        targetMain.classList.add(direction);
        let xFuture = xNew - aroundElement;

        function getFuturePosition(i, j) {
          checkLimits(getName, xFuture + i, yNew + j);
          checkEmpty(getName, getType, xFuture + i, yNew + j);
        }
        targetAroundElement(getFuturePosition);
        xNew--;
      }
      if (key === "s") {
        direction = "down";
        targetMain = targetMap.querySelector(
          `.x${xNew}.y${yNew} .main.${getName}`
        );
        targetMain.classList.remove(...directionsList);
        targetMain.classList.add(direction);
        let xFuture = xNew + aroundElement;

        function getFuturePosition(i, j) {
          checkLimits(getName, xFuture + i, yNew + j);
          checkEmpty(getName, getType, xFuture + i, yNew + j);
        }
        targetAroundElement(getFuturePosition);
        xNew++;
      }
      if (key === "q") {
        direction = "left";
        targetMain = targetMap.querySelector(
          `.x${xNew}.y${yNew} .main.${getName}`
        );
        targetMain.classList.remove(...directionsList);
        targetMain.classList.add(direction);
        let yFuture = yNew - aroundElement;

        function getFuturePosition(i, j) {
          checkLimits(getName, xNew + i, yFuture + j);
          checkEmpty(getName, getType, xNew + i, yFuture + j);
        }
        targetAroundElement(getFuturePosition);
        yNew--;
      }
      if (key === "d") {
        direction = "right";
        targetMain = targetMap.querySelector(
          `.x${xNew}.y${yNew} .main.${getName}`
        );
        targetMain.classList.remove(...directionsList);
        targetMain.classList.add(direction);
        let yFuture = yNew + aroundElement;

        function getFuturePosition(i, j) {
          checkLimits(getName, xNew + i, yFuture + j);
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
      /*       let stopMoove = false; */

      function removeInitialPosition(i, j) {
        // DOM
        let item = targetMap.querySelector(
          `.x${oldX + i}.y${oldY + j} .${getName}`
        );
        /*         if (item.classList.contains("stop")) {
          console.log("stop detected");
          return (stopMoove = true);
        } */
        // Code
        updatedMap[oldX + i][oldY + j] = ``;
        item.remove();
      }

      function addNewPosition(i, j) {
        /*         if (stopMoove) {
          return;
        } */
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
      this.timeoutID = setTimeout(function() {
        targetMap
          .querySelector(`.x${x}.y${y} .${getName}.main`)
          .classList.remove(`moving`);
      }, 400);

      this.x = x;
      this.y = y;

      if (
        x === mapWidth - aroundElement * 2 &&
        y === mapHeight - aroundElement * 2
      ) {
        victory();
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
      const targetFrontMain = targetMap.querySelector(
        `.x${this.x}.y${this.y} .main.${this.name}`
      );
      audioBark.play();
      targetFrontMain.classList.add("bark");
      clearTimeout(this.timeoutBark);
      this.timeoutBark = setTimeout(function() {
        targetMap;
        targetFrontMain.classList.remove(`bark`);
      }, 400);

      if (targetFrontMain.classList.contains("up")) {
        xTarget = this.x - aroundElement * 2 - 1;
      } else if (targetFrontMain.classList.contains("down")) {
        xTarget = this.x + aroundElement * 2 + 1;
      } else if (targetFrontMain.classList.contains("left")) {
        yTarget = this.y - aroundElement * 2 - 1;
      } else if (targetFrontMain.classList.contains("right")) {
        yTarget = this.y + aroundElement * 2 + 1;
      }
      checkLimits(this.name, xTarget, yTarget);
      targetFront = updatedMap[xTarget][yTarget];
      if (targetFront.includes("removable") && targetFront.includes("main")) {
        function removeTargetFront(i, j) {
          targetFrontDom = targetMap.querySelector(
            `.x${xTarget + i}.y${yTarget + j}`
          );
          targetFrontDom.querySelector(`.removable`).classList.add("waking_up");
          audioBark.play();
          setTimeout(function() {
            audioCatWakingUp.play();
          }, 500);
          //clearTimeout(timeoutWakingUp);
          setTimeout(function() {
            // code
            targetFrontDom = targetMap.querySelector(
              `.x${xTarget + i}.y${yTarget + j}`
            );
            updatedMap[xTarget + i][yTarget + j] = ``;
            targetFrontDom.innerHTML = ``;
          }, 1800);
        }
        targetAroundElement(removeTargetFront);
      }
    }
  }

  class Enemy extends Movable {
    constructor(name, type, x, y, mooveSequence) {
      super(name, type, x, y);
      // We'll work with 3 but we can change if we want
      this.mooveSequence = mooveSequence;
    }
    mooveEnemies() {
      const mooveSequence = this.mooveSequence;
      const getEnemy = this;
      const mooveInterval = 500;
      let sequenceTotal = mooveSequence.length * mooveInterval;

      function doSetTimeout(i) {
        setTimeout(function() {
          getEnemy.mooveTo(mooveSequence[i]);
        }, i * mooveInterval);
      }

      function loopMooves() {
        for (let i = 0; i < mooveSequence.length; i++) {
          doSetTimeout([i]);
        }
      }
      loopMooves();
      setInterval(function() {
        loopMooves();
      }, sequenceTotal);
    }
  }
  // Size of an element is currently 3*3
  const player1 = new Doggy("Rex", "dog", 1, 1, 3);

  const rock0 = new MapElement("Rock", "obstacle", 4, 1);
  const rock1 = new MapElement("Rock2", "obstacle", 4, 10);
  const rock2 = new MapElement("Rock3", "obstacle", 7, 13);
  const rock3 = new MapElement("Rock4", "obstacle", 13, 1);
  const rock4 = new MapElement("Rock1", "obstacle", 13, 7);
  const rock5 = new MapElement("Rock1", "obstacle", 13, 10);
  const rock6 = new MapElement("Rock1", "obstacle", 13, 13);

  const cat1 = new MapElement("cat1", "obstacle removable", 1, 10);
  const cat2 = new MapElement("cat2", "obstacle removable", 10, 10);
  const cat3 = new MapElement("cat3", "obstacle removable", 13, 4);

  const enemy1 = new Enemy("Bad_cat", "enemy", 7, 1, "dddddddddqqqqqqqqq");
  const enemy2 = new Enemy("Bad_cat2", "enemy", 25, 25, "zzzzzsssss");

  const obstaclesList = [];
  obstaclesList.push(
    rock0,
    rock1,
    rock2,
    rock3,
    rock4,
    rock5,
    rock6,
    cat1,
    cat2,
    cat3
  );

  const enemiesList = [];
  enemiesList.push(enemy1, enemy2);

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
      return true;
    } else if (
      updatedMap[x][y].includes(`enemy`) ||
      updatedMap[x][y].includes(`dog`)
    ) {
      // if enemy meets dog, or dog meets enemy
      audioCatAngry.play();
      let targetDog = targetMap.querySelector(`.main.dog`);
      targetDog.classList.add(`defeat`);
      /*let targetEnemy = targetMap.querySelector(`.x${x}.y${y} .enemy`);
      if (targetDog) targetDog.classList.add("stop");
      if (targetEnemy) targetEnemy.classList.add("stop"); */

      setTimeout(function() {
        defeat();
      }, 1500);
      //defeat();

      return;
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
      checkEmpty(hero.name, hero.type, hero.x + i, hero.y + j);
      updatedMap[hero.x + i][hero.y + j] = `${hero.name} ${hero.type}`;
      if (hero.x + i === hero.x && hero.y + j === hero.y)
        updatedMap[hero.x + i][hero.y + j] += ` main`;
    }
    targetAroundElement(addHero);

    function addEnemies(i, j) {
      enemies.forEach(enemy => {
        checkLimits(enemy.name, enemy.x, enemy.y);
        checkEmpty(enemy.name, enemy.type, enemy.x + i, enemy.y + j);
        updatedMap[enemy.x + i][enemy.y + j] = `${enemy.name} ${enemy.type}`;
        if (enemy.x + i === enemy.x && enemy.y + j === enemy.y)
          updatedMap[enemy.x + i][enemy.y + j] += ` main`;
      });
    }
    targetAroundElement(addEnemies);

    function addObstacles(i, j) {
      obstacles.forEach(obstacle => {
        checkLimits(obstacle.name, obstacle.x + i, obstacle.y + j);
        checkEmpty(
          obstacle.name,
          obstacle.type,
          obstacle.x + i,
          obstacle.y + j
        );
        updatedMap[obstacle.x + i][
          obstacle.y + j
        ] = `${obstacle.name} ${obstacle.type}`;
        if (obstacle.x + i === obstacle.x && obstacle.y + j === obstacle.y)
          updatedMap[obstacle.x + i][obstacle.y + j] += ` main`;
      });
    }
    targetAroundElement(addObstacles);

    return updatedMap;
  }
  // adding all the elements
  addElement(player1, enemiesList, obstaclesList);
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

  enemy1.mooveEnemies();
  enemy2.mooveEnemies();

  function victory() {
    (function() {
      axios
        .get(`/victory.html`)
        .then(res => {
          contentMain.innerHTML = res.data;
          document
            .querySelectorAll("#ajaxbox .link")
            .forEach(link => (link.onclick = loadPage));
        })
        .catch(err => {
          console.error(err);
        });
    })();
  }
  function defeat() {
    // kill the startGame function
    //audioCatAngry.play();
    function loadDefeat() {
      axios
        .get(`/defeat.html`)
        .then(res => {
          contentMain.innerHTML = res.data;
          document
            .querySelectorAll("#ajaxbox .link")
            .forEach(link => (link.onclick = loadPage));
        })
        .catch(err => {
          console.error(err);
        });
    }
    loadDefeat();
  }
}
