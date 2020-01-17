// Map
Array of an array (roverlike);
each element of the array is a squared block (empty string), defining a part of the map any object can be attributed to

// List of object with coordinates
Main character
removableObstacles
nonRemovableObstacles
Mooving Obstacles (ennemies) => always the same moove to start
BonusItems

// List of actions
moove // usable by character or obstacles ?
removeObstacle
dance (optionnal)

// List of var
var alive = true;
var actionNumber = 3;

// List of functions ?
startGame(difficulty);
Moove(direction);
removeObstacle(facing); // return the decremented action number
incrementBonusScore(bonusValue);
youreDead(score);

// Ideas
Level 1 = easy = one row, destroy one obstacle to access the exit and finish => victory
addingObstacle() // an ennemy can put back an obstacle
Fontawesome for the icons (Attack/Heart/Logo)

// Help

- How will animation work on an array ? if ennemy mooves on you while you moove on him ? Will it be fluid
- Careful of the limitation (length-1, or nonremovable obstacles)
- DOM the array of an array

// Todo order

- thinking
- prototype enough HTML / CSS / JS to run an ugly game with essential action (mooving and finishing by example)
- Basic design
- Finishing the game
- Finishing the design
- Extra ideas

// Game Steps (AJAX ?)

Intro -> Rules -> Rules
-> Play -> Difficulty -> Game(difficulty) -> Result Win : bonus = /3 || Loose

// Links
Fonts :
https://www.dafont.com/fr/lazy-dog.font
https://www.dafont.com/fr/cats-and-dogs.font
https://www.dafont.com/fr/hot-dog-2.font

Images :
dog + bones
https://opengameart.org/content/dog-walk-sprite-and-bone

cat
https://opengameart.org/content/cat-sprites

both
https://opengameart.org/content/lpc-cats-and-dogs

<i class="fas fa-paw"></i>
<i class="fas fa-dog"></i>
<i class="fas fa-bone"></i>
<i class="fas fa-cat"></i>
<i class="fas fa-cloud"></i>
<i class="fas fa-crow"></i>
<i class="fas fa-dove"></i>
<i class="fas fa-heart"></i>
<i class="fas fa-wind"></i>
