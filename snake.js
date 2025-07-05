const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameOverDialog = document.getElementById("gameOverDialog");
const restartButton = document.getElementById("restartButton");
const closeButton = document.getElementById("closeButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const gridSize = 20;
const cols = 30;
const rows = 25;
let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = null;
let foodElement = null;
let score = 0;
let gameOver = false;
let gameInterval;
let gameSpeed = 200;

function createFood() {
  const x = Math.floor(Math.random() * cols);
  const y = Math.floor(Math.random() * rows);
  food = { x, y };

  if (foodElement) foodElement.remove();
  foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.left = `${x * gridSize}px`;
  foodElement.style.top = `${y * gridSize}px`;
  gameArea.appendChild(foodElement);
}

function renderSnake() {
  document.querySelectorAll(".snake").forEach(el => el.remove());
  snake.forEach(part => {
    const el = document.createElement("div");
    el.classList.add("snake");
    el.style.left = `${part.x * gridSize}px`;
    el.style.top = `${part.y * gridSize}px`;
    gameArea.appendChild(el);
  });
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
    createFood();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= cols ||
    head.y < 0 || head.y >= rows ||
    snake.slice(1).some(part => part.x === head.x && part.y === head.y)
  ) {
    endGame();
  }

  scoreDisplay.textContent = score;
  renderSnake();
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  gameOver = false;
  createFood();
  renderSnake();
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    if (!gameOver) moveSnake();
  }, gameSpeed);
}

function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  finalScore.textContent = score;
  gameOverDialog.style.display = "block";
}

restartButton.addEventListener("click", () => {
  gameOverDialog.style.display = "none";
  startGame();
});

closeButton.addEventListener("click", () => {
  window.location.reload();
});

// Direction controls
upButton.addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
downButton.addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
leftButton.addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
rightButton.addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

startGame();
document.body.focus();
