const targetMap = document.getElementById('map');
const addItem = document.createElement('div');
const mapBlock = `<div class="block"></div>`;
const keyMoove = ['z', 'q', 's', 'd'];

let title = document.getElementById('map_title');
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
            emptyMap[i].push('');
        }
    }
    title.textContent = name;
    return emptyMap;
}
createMap('DogGo', 50, 50);
//createMap('map2', 30, 30);

// Defining a class for all map element
class MapElement {
    constructor(name, type, x, y) {
        this.name = name;
        this.type = type;
        this.x = x
        this.y = y
    }
    /*     getPosition() {
            let positionArray = []
            positionArray.push(this.x)
            positionArray.push(this.y)
            return positionArray
        } */
}
// Defining a class for all movable elements
class Movable extends MapElement {
    constructor(name, type, x, y) {
        super(name, type, x, y);
    }
    mooveTo(key) {
        let xNew = this.x;
        let yNew = this.y;
        let item = targetMap.querySelector(`.x${this.x}.y${this.y} .${this.type}`);

        if (key === 'z') {
            direction = "up";
            if (xNew !== 0) xNew--;
        }
        if (key === 's') {
            direction = "down";
            if (xNew !== mapHeight - 1) xNew++;
        }
        if (key === 'q') {
            direction = "left";
            if (yNew !== 0) yNew--;
        }
        if (key === 'd') {
            direction = "right";
            if (yNew !== mapWidth - 1) yNew++;
        }
        if (xNew !== this.x || yNew !== this.y) this.updatePosition(xNew, yNew, item, direction);


    }
    updatePosition(x, y, item, direction) {
        updatedMap[this.x][this.y] = ``;
        item.remove();
        //
        updatedMap[x][y] = this.type;
        let moveItem = targetMap.querySelector(`.x${x}.y${y}`);
        addItem.className = `moving ${direction}`;
        addItem.className += ` ${this.type}`;
        setTimeout(function () {
            addItem.classList.remove(`moving`);
        }, 1000);

        moveItem.appendChild(addItem);

        this.x = x;
        this.y = y;

        if (x === mapWidth - 1 && y === mapHeight - 1) {
            youWon();
        }

        function youWon() {
            console.log('you won !');
        }
    }
}
// Defining a class for the doggy
class Doggy extends Movable {
    constructor(name, type, x, y, actionCount) {
        super(name, type, x, y);
        // 3 actions
        this.actionCount = actionCount;
    }
}

const player1 = new Doggy('Rex', 'dog', 0, 0, 3);
//const player2 = new Doggy('Good boy', 'dog', 9, 0, 3);
//const player3 = new Doggy('pépère', 'dog', 5, 7, 3);
//const player4 = new Doggy('toutou', 'dog', 2, 4, 3);

//console.log(player1);


function addElement(hero, ennemies, obstacles) {
    updatedMap = [...emptyMap];

    function addHero() {
        console.log()
        updatedMap[hero.x].splice(hero.x, 1, hero.type);

    }
    addHero();
    return updatedMap;
}

addElement(player1, 0, 0);


// DOMing the map 

/* 
    showMap should use updatedMap 
    in the mapRow.innerHTML should be another one => element would be inside the new div created (dog, bush, cat,...)

*/
// Show the map on the website with DOM, using previously created emptyMap
function showMap() {
    let showMap = emptyMap.forEach((xRows, x) => {
        let mapRow = document.createElement('div');
        mapRow.className = `row`;
        targetMap.appendChild(mapRow);
        xRows.forEach((yRows, y) => {
            let addBlock = mapRow.innerHTML += mapBlock;
            let getLastBlock = mapRow.querySelector('div.block:last-of-type');
            getLastBlock.classList.add(`x${x}`, `y${y}`);
            if (yRows) {
                addItem.className = yRows;
                getLastBlock.appendChild(addItem);
            }
            return addBlock;
        })
    })
    return showMap;
}
showMap();

// Force focus on the map
targetMap.focus();
targetMap.addEventListener('focusout', (e) => targetMap.focus());

// listening to keyboard event
targetMap.addEventListener('keydown', (e) => {
    e.preventDefault()
    // Mooving actions
    if (keyMoove.includes(e.key)) {
        player1.mooveTo(e.key)
    }
    // Spacebar action
    if (e.key === ` `) {

    }
});