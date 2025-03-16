const startGameButton = document.getElementById("startGameButton");
const homePage = document.getElementById("homePage");
const gamePage = document.getElementById("gamePage");
const gameOverDialog = document.getElementById("gameOverDialog");
const restartButton = document.getElementById("restartButton");
const closeButton = document.getElementById("closeButton");
const scoreDisplay = document.getElementById("score");  // This is outside the grid
const finalScore = document.getElementById("finalScore");
const gameArea = document.getElementById("gameArea");

const gridSize = 20;  // Each grid block will be 20px
const rows = 25;  // Number of rows
const cols = 30;  // Number of columns
let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = null;
let foodElement = null;  // Store reference to food element
let score = 0;
let gameOver = false;
let gameInterval;
let gameSpeed = 200;  // Medium speed (200ms interval)

// Sound Effects
const eatSound = new Audio("https://www.soundjay.com/button/beep-07.wav");
const gameOverSound = new Audio("https://www.soundjay.com/button/beep-10.wav");

// Home Page: Start Game
startGameButton.addEventListener("click", () => {
    homePage.style.display = "none";
    gamePage.style.display = "block";
    startGame();
});

// Game Over Dialog: Restart or Close Game
restartButton.addEventListener("click", () => {
    gameOverDialog.style.display = "none";
    startGame();
});

closeButton.addEventListener("click", () => {
    window.location.reload();  // Reload the page (close the game)
});

// Create the game grid
function createGrid() {
    gameArea.innerHTML = ''; // Clear the game area
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

// Render the snake
function renderSnake() {
    const snakeElements = document.querySelectorAll('.snake');
    snakeElements.forEach(element => element.remove()); // Remove previous snake
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        snakeElement.style.transform = `translate3d(${segment.x * gridSize}px, ${segment.y * gridSize}px, 0)`;
        gameArea.appendChild(snakeElement);
    });
}

// Create food
function createFood() {
    // Random position for the food
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    food = { x, y };

    // Remove old food if it exists
    if (foodElement) {
        foodElement.remove();
    }

    // Create new food element
    foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.transform = `translate3d(${food.x * gridSize}px, ${food.y * gridSize}px, 0)`;
    gameArea.appendChild(foodElement);
}

// Move the snake
function moveSnake() {
    const head = { ...snake[0] };
    
    // Move the snake in the current direction
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    snake.unshift(head);  // Add new head to the snake

    // Check if the snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;  // Increase score by 10
        eatSound.play();  // Play eat sound
        createFood();  // Create new food
    } else {
        snake.pop();  // Remove last part of snake if no food eaten
    }

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        gameOverSound.play();  // Play game over sound
        clearInterval(gameInterval);  // Stop the game
        showGameOverDialog();
    }

    // Update the score display
    scoreDisplay.textContent = `Score: ${score}`;

    // Increase speed as score increases (difficulty level)
    if (score % 50 === 0 && gameSpeed > 100) {
        gameSpeed -= 10;  // Increase speed, but keep it reasonable
        clearInterval(gameInterval);  // Stop the previous interval
        startGame();  // Restart the game with new speed
    }
}

// Show Game Over Dialog
function showGameOverDialog() {
    finalScore.textContent = score;
    gameOverDialog.style.display = "block";
}

// Listen for keyboard events to control snake direction
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Start the game
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
    }, gameSpeed);  // Start the game with the current speed
    createGrid();
    createFood();
}
