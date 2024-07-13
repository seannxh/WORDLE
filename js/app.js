import {realDictionary} from './dictionary.js';

const jsConfetti = new JSConfetti()

const dictionarys = realDictionary.map(word => word.toUpperCase());
let guessedWords = new Set();
let word = "";
let row = 0;
let col = 0;
let gameOver = false;
const height = 6;
const width = 5;
let score = 0;

window.onload = function() {
  initializeGame();
};

function initializeGame() {
  word = dictionarys[Math.floor(Math.random() * dictionarys.length)];
  console.log(word);
  row = 0;
  col = 0;
  gameOver = false;
  guessedWords.clear();
  clearBoard();
  resetKeyboard()
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("answer").classList.add("hidden");

  for (let i = 0; i < height; i++) {
    for (let x = 0; x < width; x++) {
      let tile = document.createElement("span");
      tile.id = i.toString() + "-" + x.toString();
      tile.classList.add("tile");
      tile.innerHTML = " ";
      document.getElementById("board").appendChild(tile);
    }
  }

  setupEventListeners();
}

function restartInit() {
  document.getElementById('score').innerText = `Score: ${score}`;
  word = dictionarys[Math.floor(Math.random() * dictionarys.length)];
  console.log(word);
  row = 0;
  col = 0;
  gameOver = false;
  guessedWords.clear();
  score = 0;
  updateScore();
  clearBoard();
  resetKeyboard()
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("answer").classList.add("hidden");

  for (let i = 0; i < height; i++) {
    for (let x = 0; x < width; x++) {
      let tile = document.createElement("span");
      tile.id = i.toString() + "-" + x.toString();
      tile.classList.add("tile");
      tile.innerHTML = " ";
      document.getElementById("board").appendChild(tile);
    }
  }

  setupEventListeners();
}

function isWordValid(word) {
  return dictionarys.includes(word);
}
function clearBoard() {
  const board = document.getElementById("board");
  board.innerHTML = '';
}

function setupEventListeners() {
  document.querySelectorAll('[data-key]').forEach(button => {
    button.removeEventListener('click', handleButtonClick);
  });

  document.querySelectorAll('[data-key]').forEach(button => {
    button.addEventListener('click', handleButtonClick);
  });
}

function handleButtonClick() {
  if (gameOver) return;

  let key = this.getAttribute('data-key');
  if (key === 'enter') {
    handleEnterPress();
  } else if (key === 'del') {
    handleDeletePress();
  } else {
    handleVirtualKeyboardInput(key.toUpperCase());
  }
}

function handleDeletePress() {
  if (col > 0) {
    col -= 1;
    let currentTile = document.getElementById(row.toString() + '-' + col.toString());
    currentTile.innerText = "";
  }
}

function handleEnterPress() {
  let formedWord = "";
  let rowFill = true;
  for (let x = 0; x < width; x++) {
    let currentTile = document.getElementById(row.toString() + '-' + x.toString());
    let letter = currentTile.innerText;
    formedWord += letter;
    if (letter === "") {
      rowFill = false;
    }
  }
  if (!rowFill) {
    document.getElementById("feedback").innerText = "PLEASE FILL IN THE REST OF THE BOX";
    document.getElementById("feedback").classList.remove("hidden");
  } else if (rowFill && isWordValid(formedWord)) {
    if (!guessedWords.has(formedWord)) {
      guessedWords.add(formedWord);
      update(formedWord);
      if (formedWord === word) {
        gameOver = true;
        score += 1;
        updateScore();
        document.getElementById("answer").innerText = `CONGRATULATIONS! YOU'VE GOT THE WORD CORRECT!: ${word}`;
        document.getElementById("answer").classList.remove("hidden");

      }
      row += 1;
      col = 0;
    } else {
      document.getElementById("feedback").innerText = "YOU'VE ALREADY GUESSED THAT WORD! OOPS!";
      document.getElementById("feedback").classList.remove("hidden");
    }
  } else {
    document.getElementById("feedback").innerText = "INVALID WORD NOT IN THE DICTIONARY! TRY NEW WORD";
    document.getElementById("feedback").classList.remove("hidden");
  }

  if (!gameOver && row === height) {
    gameOver = true;
    score -= 1;
    updateScore();
    document.getElementById("answer").innerText = `WORDLE WAS ${word}! BETTER LUCK NEXT TIME!`;
    document.getElementById("answer").classList.remove("hidden");
  }
}

function handleVirtualKeyboardInput(key) {
  if (col < width) {
    let currentTile = document.getElementById(row.toString() + '-' + col.toString());
    if (currentTile.innerText == "") {
      currentTile.innerText = key;
      col += 1;
    }
  }
}
function updateKeyboard(letter, status) {
  let key = document.querySelector(`[data-key="${letter.toLowerCase()}"]`);
  if (key) {
    key.classList.remove("correct", "half", "incorrect");
    key.classList.add(status);
  }
}
function resetKeyboard() {
  document.querySelectorAll('.key').forEach(key => {
    key.classList.remove('correct', 'half', 'incorrect');
  });
}

function update() {
  let correct = 0;
  let letterCount = {};
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    if (letterCount[letter]) {
      letterCount[letter] += 1;
    } else {
      letterCount[letter] = 1;
    }
  }

  for (let x = 0; x < width; x++) {
    document.getElementById("feedback").classList.add("hidden");
    let currentTile = document.getElementById(row.toString() + '-' + x.toString());
    let letter = currentTile.innerText;
    if (word[x] === letter) {
      currentTile.classList.add("correct");
      updateKeyboard(letter, 'correct')
      correct += 1;
      letterCount[letter] -= 1;
    }
    if (correct === width) {
      gameOver = true;
      jsConfetti.addConfetti({
        confettiColors: [
          '#E6E6FA', '#D8BFD8', '#DDA0DD', '#DA70D6', '#9370DB', '#FFFFFF'
        ]
    })
    }
    currentTile.classList.add('animated');
  }

  for (let x = 0; x < width; x++) {
    document.getElementById("feedback").classList.add("hidden");
    let currentTile = document.getElementById(row.toString() + '-' + x.toString());
    let letter = currentTile.innerText;
    if (!currentTile.classList.contains("correct")) {
      if (word.includes(letter) && letterCount[letter] > 0) {
        currentTile.classList.add("half");
        updateKeyboard(letter, 'half')
        letterCount[letter] -= 1;
      } else {
        currentTile.classList.add("incorrect");
        updateKeyboard(letter, 'incorrect')
      }
    }
    currentTile.classList.add('animated');
  }
}


function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
}

let giveup = document.getElementById('giveupButton');
  giveup.addEventListener('click', () => {
    let formedWord = "";
    for (let x = 0; x < width; x++) {
      let currentTile = document.getElementById(row.toString() + '-' + x.toString());
      let letter = currentTile.innerText;
      formedWord += letter;
    }
    if (formedWord === word) return;
    document.getElementById('score').innerText = `Score: ${score}`;
    word = dictionarys[Math.floor(Math.random() * dictionarys.length)];
    console.log(word);
    row = 0;
    col = 0;
    gameOver = true;
    guessedWords.clear();
    score -= 1;
    updateScore();
    resetKeyboard()
    document.getElementById("answer").innerText = `WORDLE WAS ${word}! CLICK NEW WORD TO TRY AGAIN!`;
    document.getElementById("answer").classList.remove("hidden");
    document.getElementById("feedback").classList.add("hidden");
  });


document.getElementById('restartButton').addEventListener('click', () => restartInit());
document.getElementById('newwordButton').addEventListener('click', () => initializeGame());
