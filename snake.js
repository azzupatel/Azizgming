const startGameButton = document.getElementById("startGameButton");
const homePage = document.getElementById("homePage");
const gamePage = document.getElementById("gamePage");
const gameOverDialog = document.getElementById("gameOverDialog");
const restartButton = document.getElementById("restartButton");
const closeButton = document.getElementById("closeButton");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameArea = document.getElementById("gameArea");

const gridSize = 20;
const rows = 25;
const cols = 30;
let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = null;
let foodElement = null;
let score = 0;
let gameOver = false;
let gameInterval;
let gameSpeed = 200;

const eatSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
const gameOverSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

startGameButton.addEventListener("click", () => {
  homePage.style.display = "none";
  gamePage.style.display = "block";
  startGame();
});

restartButton.addEventListener("click", () => {
  gameOverDialog.style.display = "none";
  startGame();
});

closeButton.addEventListener("click", () => {
  window.location.reload();
});

function createGrid() {
  gameArea.innerHTML = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.width = `${gridSize}px`;
      div.style.height = `${gridSize}px`;
      div.style.top = `${row * gridSize}px`;
      div.style.left = `${col * gridSize}px`;
      div.style.border = '1px solid rgba(255,255,255,0.05)';
      gameArea.appendChild(div);
    }
  }
}

function renderSnake() {
  document.querySelectorAll('.snake').forEach(el => el.remove());
  snake.forEach(segment => {
    const snakeEl = document.createElement('div');
    snakeEl.classList.add('snake');
    snakeEl.style.transform = `translate(${segment.x * gridSize}px, ${segment.y * gridSize}px)`;
    gameArea.appendChild(snakeEl);
  });
}

function createFood() {
  const x = Math.floor(Math.random() * cols);
  const y = Math.floor(Math.random() * rows);
  food = { x, y };
  if (foodElement) foodElement.remove();
  foodElement = document.createElement('div');
  foodElement.classList.add('food');
  foodElement.style.transform = `translate(${x * gridSize}px, ${y * gridSize}px)`;
  gameArea.appendChild(foodElement);
}

function moveSnake() {
  const head = { ...snake[0] };
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    eatSound.play();
    createFood();
  } else {
    snake.pop();
  }

  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
      snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
    gameOver = true;
    gameOverSound.play();
    clearInterval(gameInterval);
    finalScore.textContent = score;
    gameOverDialog.style.display = "block";
  }

  scoreDisplay.textContent = `Score: ${score}`;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Swipe gesture for mobile
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < -30 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 30 && direction !== "UP") direction = "DOWN";
    else if (dy < -30 && direction !== "DOWN") direction = "UP";
  }
});

// Mobile control buttons
function setDirection(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  gameOver = false;
  gameSpeed = 200;
  clearInterval(gameInterval);
  createGrid();
  createFood();
  renderSnake();
  gameInterval = setInterval(() => {
    if (!gameOver) {
      moveSnake();
      renderSnake();
    }
  }, gameSpeed);
}

window.addEventListener("resize", () => {
  createGrid();
  renderSnake();
  if (food) createFood();
});
