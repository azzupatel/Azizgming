const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameOverDialog = document.getElementById("gameOverDialog");
const restartButton = document.getElementById("restartButton");
const closeButton = document.getElementById("closeButton");

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
  let validPosition = false;
  while (!validPosition) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!snake.some(part => part.x === x && part.y === y)) {
      food = { x, y };
      validPosition = true;
    }
  }

  if (foodElement) foodElement.remove();
  foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.left = `${food.x * gridSize}px`;
  foodElement.style.top = `${food.y * gridSize}px`;
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

  if (
    head.x < 0 || head.x >= cols ||
    head.y < 0 || head.y >= rows ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    createFood();
  } else {
    snake.pop();
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
  document.body.focus();
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

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Swipe gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

document.addEventListener("touchend", function (e) {
  const touch = e.changedTouches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;
  handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < -30 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 30 && direction !== "UP") direction = "DOWN";
    else if (dy < -30 && direction !== "DOWN") direction = "UP";
  }
}

startGame();
