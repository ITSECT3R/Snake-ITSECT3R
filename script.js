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

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`


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
    // console.log(e);
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === "ArrowLeft" && velocityX != 1 ){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === "ArrowRight" && velocityX != -1 ){
        velocityX = 1;
        velocityY = 0;
    }
    // initGame();

    
}


const initGame = () => {
    if(isPaused) return;
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX,foodY])
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore )
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
