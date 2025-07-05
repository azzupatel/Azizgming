const startGameButton = document.getElementById("startGameButton");
const homePage = document.getElementById("homePage");
const gamePage = document.getElementById("gamePage");
const gameOverDialog = document.getElementById("gameOverDialog");
const restartButton = document.getElementById("restartButton");
const closeButton = document.getElementById("closeButton");
const scoreDisplay = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const gameArea = document.getElementById("gameArea");

// Mobile control buttons
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const mobileControls = document.getElementById("mobileControls");

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

// Sound Effects
const eatSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
const gameOverSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

// Start Game
startGameButton.addEventListener("click", () => {
    homePage.style.display = "none";
    gamePage.style.display = "block";

    // Show mobile controls only on smaller screens
    if (window.innerWidth <= 768) {
        mobileControls.style.display = "flex";
    } else {
        mobileControls.style.display = "none";
    }

    startGame();
});

// Restart or Close
restartButton.addEventListener("click", () => {
    gameOverDialog.style.display = "none";
    startGame();
});

closeButton.addEventListener("click", () => {
    window.location.reload();
});

// Create grid
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
            div.style.border = '1px solid #ccc';
            gameArea.appendChild(div);
        }
    }
}

// Render snake
function renderSnake() {
    const snakeElements = document.querySelectorAll('.snake');
    snakeElements.forEach(element => element.remove());
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        snakeElement.style.transform = `translate3d(${segment.x * gridSize}px, ${segment.y * gridSize}px, 0)`;
        gameArea.appendChild(snakeElement);
    });
}

// Create food
function createFood() {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    food = { x, y };

    if (foodElement) foodElement.remove();

    foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.transform = `translate3d(${food.x * gridSize}px, ${food.y * gridSize}px, 0)`;
    gameArea.appendChild(foodElement);
}

// Move snake
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

    if (
        head.x < 0 || head.x >= cols ||
        head.y < 0 || head.y >= rows ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
        gameOverSound.play();
        clearInterval(gameInterval);
        showGameOverDialog();
    }

    scoreDisplay.textContent = `Score: ${score}`;

    if (score % 50 === 0 && gameSpeed > 100) {
        gameSpeed -= 10;
        clearInterval(gameInterval);
        startGame();
    }
}

// Show game over
function showGameOverDialog() {
    finalScore.textContent = score;
    gameOverDialog.style.display = "block";
}

// Keyboard control (desktop)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Button control (mobile)
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

// Start game
function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    score = 0;
    gameOver = false;
    gameInterval = setInterval(() => {
        if (!gameOver) {
            moveSnake();
            renderSnake();
        }
    }, gameSpeed);
    createGrid();
    createFood();
}
