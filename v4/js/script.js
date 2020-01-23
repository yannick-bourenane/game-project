const contentMain = document.getElementById("ajaxbox");

(function () {
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
  let targetBarkCount = document.getElementById("bark_count");
  let score;
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
  createMap("DogGo", 51, 51);

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
        checkLimits(getName, x + i, y + j);
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
    showActionScore() {
      score = this.actionCount;
      targetBarkCount.textContent = score;
    }
    bark() {
      let targetBarkCountP = document.getElementById("bark_count");

      decrementScore(score);

      if (this.actionCount > 0) {
        targetBarkCount.className = "positive";
      }
      if (this.actionCount === 0) {
        targetBarkCount.className = "zero";
      }
      if (this.actionCount < 0) {
        targetBarkCount.className = "negative";
      }

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
      this.timeoutBark = setTimeout(function () {
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
          setTimeout(function () {
            audioCatWakingUp.play();
          }, 500);
          //clearTimeout(timeoutWakingUp);
          setTimeout(function () {
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
        setTimeout(function () {
          getEnemy.mooveTo(mooveSequence[i]);
        }, i * mooveInterval);
      }

      function loopMooves() {
        for (let i = 0; i < mooveSequence.length; i++) {
          doSetTimeout([i]);
        }
      }
      loopMooves();
      setInterval(function () {
        loopMooves();
      }, sequenceTotal);
    }
  }
  // Size of an element is currently 3*3
  const player1 = new Doggy("Rex", "dog", 45, 45, 3);
  const tree = {};
  const cat = {};
  const enemy = {};
  tree[0] = new MapElement("Tree", "obstacle", 4, 1);
  tree[1] = new MapElement("Tree", "obstacle", 4, 4);
  tree[2] = new MapElement("Tree", "obstacle", 4, 10);
  tree[3] = new MapElement("Tree", "obstacle", 4, 13);
  tree[4] = new MapElement("Tree", "obstacle", 4, 16);
  tree[5] = new MapElement("Tree", "obstacle", 4, 19);
  tree[6] = new MapElement("Tree", "obstacle", 4, 22);
  tree[7] = new MapElement("Tree", "obstacle", 4, 28);
  tree[8] = new MapElement("Tree", "obstacle", 4, 34);
  tree[9] = new MapElement("Tree", "obstacle", 4, 40);
  tree[10] = new MapElement("Tree", "obstacle", 4, 49);
  tree[11] = new MapElement("Tree", "obstacle", 7, 13);
  tree[12] = new MapElement("Tree", "obstacle", 7, 16);
  tree[13] = new MapElement("Tree", "obstacle", 7, 19);
  tree[14] = new MapElement("Tree", "obstacle", 7, 22);
  tree[15] = new MapElement("Tree", "obstacle", 7, 28);
  tree[16] = new MapElement("Tree", "obstacle", 7, 31);
  tree[17] = new MapElement("Tree", "obstacle", 7, 34);
  tree[18] = new MapElement("Tree", "obstacle", 7, 40);
  tree[19] = new MapElement("Tree", "obstacle", 7, 43);
  tree[20] = new MapElement("Tree", "obstacle", 7, 49);
  tree[21] = new MapElement("Tree", "obstacle", 10, 19);
  tree[22] = new MapElement("Tree", "obstacle", 10, 22);
  tree[23] = new MapElement("Tree", "obstacle", 10, 28);
  tree[24] = new MapElement("Tree", "obstacle", 10, 40);
  tree[25] = new MapElement("Tree", "obstacle", 10, 49);
  tree[26] = new MapElement("Tree", "obstacle", 13, 1);
  tree[27] = new MapElement("Tree", "obstacle", 13, 7);
  tree[28] = new MapElement("Tree", "obstacle", 13, 10);
  tree[29] = new MapElement("Tree", "obstacle", 13, 19);
  tree[30] = new MapElement("Tree", "obstacle", 13, 22);
  tree[31] = new MapElement("Tree", "obstacle", 13, 40);
  tree[32] = new MapElement("Tree", "obstacle", 16, 1);
  tree[33] = new MapElement("Tree", "obstacle", 16, 7);
  tree[34] = new MapElement("Tree", "obstacle", 16, 10);
  tree[35] = new MapElement("Tree", "obstacle", 16, 13);
  tree[36] = new MapElement("Tree", "obstacle", 16, 28);
  tree[37] = new MapElement("Tree", "obstacle", 16, 40);
  tree[38] = new MapElement("Tree", "obstacle", 19, 1);
  tree[39] = new MapElement("Tree", "obstacle", 19, 13);
  tree[40] = new MapElement("Tree", "obstacle", 19, 22);
  tree[41] = new MapElement("Tree", "obstacle", 19, 25);
  tree[42] = new MapElement("Tree", "obstacle", 19, 31);
  tree[43] = new MapElement("Tree", "obstacle", 19, 43);
  tree[44] = new MapElement("Tree", "obstacle", 19, 46);
  tree[45] = new MapElement("Tree", "obstacle", 22, 7);
  tree[46] = new MapElement("Tree", "obstacle", 22, 13);
  tree[47] = new MapElement("Tree", "obstacle", 22, 31);
  tree[48] = new MapElement("Tree", "obstacle", 22, 46);
  tree[49] = new MapElement("Tree", "obstacle", 25, 4);
  tree[50] = new MapElement("Tree", "obstacle", 25, 13);
  tree[51] = new MapElement("Tree", "obstacle", 25, 19);
  tree[52] = new MapElement("Tree", "obstacle", 25, 25);
  tree[53] = new MapElement("Tree", "obstacle", 25, 31);
  tree[54] = new MapElement("Tree", "obstacle", 25, 40);
  tree[55] = new MapElement("Tree", "obstacle", 28, 25);
  tree[56] = new MapElement("Tree", "obstacle", 28, 37);
  tree[57] = new MapElement("Tree", "obstacle", 28, 43);
  tree[58] = new MapElement("Tree", "obstacle", 28, 46);
  tree[59] = new MapElement("Tree", "obstacle", 31, 1);
  tree[60] = new MapElement("Tree", "obstacle", 31, 13);
  tree[61] = new MapElement("Tree", "obstacle", 31, 31);
  tree[62] = new MapElement("Tree", "obstacle", 31, 34);
  tree[63] = new MapElement("Tree", "obstacle", 34, 1);
  tree[64] = new MapElement("Tree", "obstacle", 34, 13);
  tree[65] = new MapElement("Tree", "obstacle", 34, 19);
  tree[66] = new MapElement("Tree", "obstacle", 34, 22);
  tree[67] = new MapElement("Tree", "obstacle", 34, 25);
  tree[68] = new MapElement("Tree", "obstacle", 34, 28);
  tree[69] = new MapElement("Tree", "obstacle", 34, 34);
  tree[70] = new MapElement("Tree", "obstacle", 34, 43);
  tree[71] = new MapElement("Tree", "obstacle", 34, 46);
  tree[72] = new MapElement("Tree", "obstacle", 34, 49);
  tree[73] = new MapElement("Tree", "obstacle", 37, 1);
  tree[74] = new MapElement("Tree", "obstacle", 37, 7);
  tree[75] = new MapElement("Tree", "obstacle", 37, 10);
  tree[76] = new MapElement("Tree", "obstacle", 37, 13);
  tree[77] = new MapElement("Tree", "obstacle", 37, 34);
  tree[78] = new MapElement("Tree", "obstacle", 37, 37);
  tree[79] = new MapElement("Tree", "obstacle", 40, 25);
  tree[80] = new MapElement("Tree", "obstacle", 40, 28);
  tree[81] = new MapElement("Tree", "obstacle", 40, 40);
  tree[82] = new MapElement("Tree", "obstacle", 40, 43);
  tree[83] = new MapElement("Tree", "obstacle", 40, 46);
  tree[84] = new MapElement("Tree", "obstacle", 43, 13);
  tree[85] = new MapElement("Tree", "obstacle", 43, 16);
  tree[86] = new MapElement("Tree", "obstacle", 43, 19);
  tree[87] = new MapElement("Tree", "obstacle", 43, 22);
  tree[88] = new MapElement("Tree", "obstacle", 43, 31);
  tree[89] = new MapElement("Tree", "obstacle", 46, 13);
  tree[90] = new MapElement("Tree", "obstacle", 46, 40);
  tree[91] = new MapElement("Tree", "obstacle", 49, 40);
  tree[92] = new MapElement("Tree", "obstacle", 1, 49);

  cat[0] = new MapElement("cat", "obstacle removable", 1, 10);
  cat[1] = new MapElement("cat", "obstacle removable", 4, 25);
  cat[2] = new MapElement("cat", "obstacle removable", 4, 43);
  cat[3] = new MapElement("cat", "obstacle removable", 10, 10);
  cat[4] = new MapElement("cat", "obstacle removable", 10, 37);
  cat[5] = new MapElement("cat", "obstacle removable", 13, 4);
  cat[6] = new MapElement("cat", "obstacle removable", 16, 19);
  cat[7] = new MapElement("cat", "obstacle removable", 16, 49);
  cat[8] = new MapElement("cat", "obstacle removable", 19, 7);
  cat[9] = new MapElement("cat", "obstacle removable", 22, 25);
  cat[10] = new MapElement("cat", "obstacle removable", 25, 1);
  cat[11] = new MapElement("cat", "obstacle removable", 25, 46);
  cat[12] = new MapElement("cat", "obstacle removable", 28, 13);
  cat[13] = new MapElement("cat", "obstacle removable", 28, 31);
  cat[14] = new MapElement("cat", "obstacle removable", 31, 25);
  cat[15] = new MapElement("cat", "obstacle removable", 34, 16);
  cat[16] = new MapElement("cat", "obstacle removable", 37, 4);
  cat[17] = new MapElement("cat", "obstacle removable", 40, 13);
  cat[18] = new MapElement("cat", "obstacle removable", 40, 34);
  cat[19] = new MapElement("cat", "obstacle removable", 40, 49);
  cat[20] = new MapElement("cat", "obstacle removable", 43, 40);
  cat[21] = new MapElement("cat", "obstacle removable", 49, 13);

  enemy[0] = new Enemy("cat_black", "enemy", 7, 1, "dddddddddqqqqqqqqq");
  enemy[1] = new Enemy(
    "cat_black",
    "enemy",
    1,
    40,
    "qqqqqqqqqqqqqqqqqqdddddddddddddddddd"
  );
  enemy[2] = new Enemy(
    "cat_black",
    "enemy",
    1,
    43,
    "dddssssssssssssdddqqqzzzzzzzzzzzzqqq"
  );
  enemy[3] = new Enemy(
    "cat_black",
    "enemy",
    16,
    22,
    "dddzzzzzzzzzsssssssssqqq"
  );
  enemy[4] = new Enemy(
    "cat_black",
    "enemy",
    13,
    31,
    "dddsssdddsssssssssqqqssszzzdddzzzzzzzzzqqqzzzqqq"
  );
  enemy[5] = new Enemy(
    "cat_black",
    "enemy",
    34,
    10,
    "zzzzzzzzzzzzzzzsssssssssssssss"
  );
  enemy[6] = new Enemy(
    "cat_black",
    "enemy",
    22,
    16,
    "sssssssssddddddzzzzzzzzzqqqqqq"
  );
  enemy[7] = new Enemy(
    "cat_black",
    "enemy",
    49,
    1,
    "zzzdddzzzdddzzzdddqqqsssqqqsssqqqsss"
  );
  enemy[8] = new Enemy(
    "cat_black",
    "enemy",
    46,
    19,
    "dddddddddsssddddddzzzzzzdddzzzsssqqqssssssqqqqqqzzzqqqqqqqqq"
  );

  const obstaclesList = [];
  const enemiesList = [];

  // Pushing 91 obstacles

  function pushElements(element, number, arr) {
    for (let i = 0; i < number; i++) {
      element[i].name += i;
      arr.push(element[i]);
    }
  }

  pushElements(tree, 93, obstaclesList);
  pushElements(cat, 21, obstaclesList);
  pushElements(enemy, 9, enemiesList);

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
      if (targetDog) targetDog.classList.add(`defeat`);
      /*let targetEnemy = targetMap.querySelector(`.x${x}.y${y} .enemy`);
      if (targetDog) targetDog.classList.add("stop");
      if (targetEnemy) targetEnemy.classList.add("stop"); */

      setTimeout(function () {
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
      checkLimits(hero.name, hero.x + i, hero.y + j);
      checkEmpty(hero.name, hero.type, hero.x + i, hero.y + j);
      updatedMap[hero.x + i][hero.y + j] = `${hero.name} ${hero.type}`;
      if (hero.x + i === hero.x && hero.y + j === hero.y)
        updatedMap[hero.x + i][hero.y + j] += ` main`;
    }
    targetAroundElement(addHero);

    function addEnemies(i, j) {
      enemies.forEach(enemy => {
        checkLimits(enemy.name, enemy.x + i, enemy.y + j);
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
  // Show the map on the website with DOM
  function showMap() {
    let showMap = updatedMap.forEach((xRows, x) => {
      let mapRow = document.createElement("div");
      mapRow.className = `row`;
      targetMap.appendChild(mapRow);
      xRows.forEach((yRows, y) => {
        let addBlock = (mapRow.innerHTML += mapBlock);
        let getLastBlock = mapRow.querySelector("div.block:last-of-type");
        getLastBlock.classList.add(`x${x}`, `y${y}`);
        const itemDom = document.createElement("div");
        if (yRows) {
          itemDom.className = yRows;
          getLastBlock.appendChild(itemDom);
        }

        return addBlock;
      });
    });
    return showMap;
  }
  showMap();
  player1.showActionScore();

  function decrementScore(number) {
    number--;
    score = number;
    targetBarkCount.textContent = score;
    return score
  }
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
  for (let i = 0; i < 9; i++) {
    enemy[i].mooveEnemies();
  }

  function victory() {
    (function () {
      axios
        .get(`/victory.html`)
        .then(res => {
          contentMain.innerHTML = res.data;
          document
            .querySelectorAll("#ajaxbox .link")
            .forEach(link => (link.onclick = loadPage));
          //document.querySelectorAll('#victoire').forEach(element => element.innerHTML = "<p>test</p>")
          console.log(document)
          showScore();
        })
        .catch(err => {
          console.error(err);
        });
    })();

  }

  function showScore() {
    const targetVictoryScore = document.querySelector('#score strong');
    targetVictoryScore.textContent = score;
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