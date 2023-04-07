const playBoard = document.querySelector(".playboard");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highscore");
const controls = document.querySelectorAll(".controls i");
const gameOverModal = document.getElementById("gameover");
const closeModal = document.getElementsByClassName("close")[0];

let gameOver = false;
let foodX, foodY;
let snakeX = 7,
  snakeY = 4;
let snakeBody = [];
let directX = 0,
  directY = 0;
let setIntervalId;
let score = 0;

// Getting high score from local storage
let highScore = localStorage.getItem("highscore") || 0;
highScoreElement.innerText = `High-score: ${highScore}`;

const changeFoodPosition = () => {
  // Passing a random number (1 - 30) for position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  gameOverModal.style.display = "block";
  clearInterval(setIntervalId);
  closeModal.onclick = function () {
    gameOverModal.style.display = "none";
    location.reload();
  };
  window.onclick = function (e) {
    if (e.target == gameOverModal) {
      gameOverModal.style.display = "none";
      location.reload();
    }
  };
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && directY != 1) {
    directX = 0;
    directY = -1;
  } else if (e.key === "ArrowDown" && directY != -1) {
    directX = 0;
    directY = 1;
  } else if (e.key === "ArrowLeft" && directX != 1) {
    directX = -1;
    directY = 0;
  } else if (e.key === "ArrowRight" && directX != -1) {
    directX = 1;
    directY = 0;
  }
  initGame();
};

controls.forEach((key) => {
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Check if the snake ate food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++; // increment score

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("highscore", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High-score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Elongate snake body
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // Set first element of snake body to current position

  // Update snake head position, based on current direction
  snakeX += directX;
  snakeY += directY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
