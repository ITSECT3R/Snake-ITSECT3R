const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const pauseButton = document.querySelector(".pause-button");


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0,velocityY = 0;
let setIntervalId;
let score = 0;
let isPaused = false;
let directionQueue = [];
const MAX_QUEUE_LENGTH = 2;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;


const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert(`Game Over! Your score: ${score}`);
    resetGame();
}

const resetGame = () => {
    snakeX = 5;
    snakeY = 10;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;
    directionQueue = []; // Clear the direction queue
    changeFoodPosition();
    setIntervalId = setInterval(initGame, 125);
}

const togglePause = () => {
    if(velocityX === 0 && velocityY === 0) return;
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(setIntervalId);
        pauseButton.textContent = "Resume"; // Changes button text
    } else {
        setIntervalId = setInterval(initGame, 125);
        pauseButton.textContent = "Pause"; // Changes button text
    }
}

const changeDirection = (e) => {
    if(isPaused) return; // Don't change direction if paused

    const newDirection = {
        velocityX: 0,
        velocityY: 0
    };

    // Determine new direction based on key press
    switch(e.key) {
        case "ArrowUp":
            if(velocityY != 1) {
                newDirection.velocityY = -1;
                newDirection.velocityX = 0;
            }
            break;
        case "ArrowDown":
            if(velocityY != -1) {
                newDirection.velocityY = 1;
                newDirection.velocityX = 0;
            }
            break;
        case "ArrowLeft":
            if(velocityX != 1) {
                newDirection.velocityX = -1;
                newDirection.velocityY = 0;
            }
            break;
        case "ArrowRight":
            if(velocityX != -1) {
                newDirection.velocityX = 1;
                newDirection.velocityY = 0;
            }
            break;
        default:
            return;
    }

    // Only add to queue if it's a valid direction change
    if (newDirection.velocityX !== 0 || newDirection.velocityY !== 0) {
        // Don't add if it's the same as the last direction in queue
        if (directionQueue.length > 0) {
            const lastDirection = directionQueue[directionQueue.length - 1];
            if (lastDirection.velocityX === newDirection.velocityX && 
                lastDirection.velocityY === newDirection.velocityY) {
                return;
            }
        }
        
        directionQueue.push(newDirection);
        if (directionQueue.length > MAX_QUEUE_LENGTH) {
            directionQueue.shift();
        }
    }
}


const initGame = () => {
    if(isPaused) return;
    if(gameOver) return handleGameOver();

    // Process next direction from queue
    if (directionQueue.length > 0) {
        const nextDirection = directionQueue[0];
        // Only change direction if it's valid
        if ((nextDirection.velocityY === -1 && velocityY !== 1) ||
            (nextDirection.velocityY === 1 && velocityY !== -1) ||
            (nextDirection.velocityX === -1 && velocityX !== 1) ||
            (nextDirection.velocityX === 1 && velocityX !== -1)) {
            velocityX = nextDirection.velocityX;
            velocityY = nextDirection.velocityY;
        }
        directionQueue.shift();
    }

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([snakeX, snakeY])
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore );
        scoreElement.innerHTML = `Score: ${score}`;

        highScoreElement.innerHTML = `High Score: ${highScore}`
    }

    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody [i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30 ){
        gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++){
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0]  === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125)
pauseButton.addEventListener("click", togglePause);
document.addEventListener("keydown",changeDirection);
document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" || e.key === "p" || e.key === "P"){ 
        togglePause();
    }
});
