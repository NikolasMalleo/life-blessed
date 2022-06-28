var blessed = require('blessed')
  , program = blessed.program();

const current = '\033[35m ▩\033[0m';
const dead = '  ';
let gameBoard = [];
let currentGame;
let sizeBoard = 40;
let alive = aliveRand((sizeBoard ** 2) / 2);

const screen = blessed.screen({
    fastCSR: true
});

const box = blessed.box({
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    content: 'init',
    tags: true,
    style: {
      fg: 'white',
      bg: 'black'
    }
});

screen.append(box);

screen.on('keypress', function (data, key) {
    if (key.name === 'q') {
      program.clear();
      program.disableMouse();
      program.showCursor();
      program.normalBuffer();
      process.exit(0);
    }
});

box.key('1', function(ch, key) {
    screen.render();
    cleanScreen()
    screen.render();
    
    const fs = require('fs'); 
    let rawdata = fs.readFileSync('1.json'); 
    alive = JSON.parse(rawdata)
    setBoard(alive)
    box.setContent(currentGame)
    screen.render();
});


box.key('2', function(ch, key) {
    screen.render();
    cleanScreen()
    screen.render();
    
    const fs = require('fs'); 
    let rawdata = fs.readFileSync('2.json'); 
    alive = JSON.parse(rawdata)
    setBoard(alive)
    box.setContent(currentGame)
    screen.render();
});


box.key('3', function(ch, key) {
    screen.render();
    cleanScreen()
    screen.render();
    
    const fs = require('fs'); 
    let rawdata = fs.readFileSync('3.json'); 
    alive = JSON.parse(rawdata)
    setBoard(alive)
    box.setContent(currentGame)
    screen.render();
});


function aliveRand(number){
	let arr = new Array();
	for(let x = 0; x < number; x+=1){
		arr[x] = [Math.floor(Math.random() * (sizeBoard - 2) + 1), Math.floor(Math.random() * (sizeBoard - 2) + 1)]
	}
	return {'current': arr}
}

let makeGamebox = () => {
    for (let x = 0; x < sizeBoard; x++) {
      let tempArray = [];
      for (let y = 0; y < sizeBoard; y++) {
        if (y === sizeBoard - 1) {
          tempArray.push('\n');
        } else {
        tempArray.push(dead);
       }
      }
      gameBoard.push(tempArray);
    }
    setBoard(alive);
};

let setBoard = (pattern) => {
    let cells = pattern['current'];
    for (let x = 0; x < cells.length; x++) {
      let postX = cells[x][0];
      let postY = cells[x][1];
  
      gameBoard[postX][postY] = current;
    }
    currentGame = JSON.parse(JSON.stringify(gameBoard));
    joinArray(currentGame);
}

function changeBoard(board){
    let currentBoard = JSON.parse(JSON.stringify(board));
    for (let x = 1; x < currentBoard.length-1; x++) {
        for ( let y = 1; y < currentBoard.length-1; y++) {
            let total = 0;

            total += isAlive(currentBoard[x - 1][y - 1]);
            total += isAlive(currentBoard[x - 1][y]); 
            total += isAlive(currentBoard[x - 1][y + 1]);
            total += isAlive(currentBoard[x + 1][y - 1]);
            total += isAlive(currentBoard[x + 1][y]);
            total += isAlive(currentBoard[x + 1][y + 1]);
            total += isAlive(currentBoard[x][y - 1]);
            total += isAlive(currentBoard[x][y + 1]);

            if (currentBoard[x][y] === current) {
                if (total <= 1 || total >= 4) {
                gameBoard[x][y] = dead;
                } 
                else {
                gameBoard[x][y] = current;
                }
            }

            if (total === 3) {
                board[x][y] = current;
            }
        }
    }
}

function isAlive(str){
    if (str === current) {
      return 1;
    } else {
      return 0;
    }
}

function cleanScreen(){
    for(let i=0; i<sizeBoard-1; i++){
        for(let j=0; j<sizeBoard-1; j++){
            gameBoard[i][j] = dead
        }
    }
    currentGame = JSON.parse(JSON.stringify(gameBoard));
    joinArray(currentGame);
}

function joinArray(board){
    for (let x = 0; x < board.length; x++) {
      board[x] = board[x].join('');
    }
    currentGame = board.join('');
}

const StartGame = () => {
    makeGamebox();
    box.setContent(currentGame);
    screen.render();
    currentGame = gameBoard.slice(0);
    joinArray(currentGame);
}
  
StartGame();
  
setInterval(() => {
    changeBoard(gameBoard);
    currentGame = gameBoard.slice(0);
    joinArray(currentGame);
    box.setContent(currentGame);
    screen.render();
},200)