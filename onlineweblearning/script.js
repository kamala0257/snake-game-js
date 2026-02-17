// ================= GAME CONSTANTS =================
let inputDir = { x: 0, y: 0 };
const moveSound = new Audio("snakeprojectjs/assets/Snake-game-food.mp3");
const foodSound = new Audio("snakeprojectjs/assets/Snake-game-food.mp3");
const gameSound = new Audio("snakeprojectjs/assets/Snake-game-food.mp3");

let speed = 5;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let lastPaintTime = 0;
let score = 0;

// DOM elements
let playArea = document.getElementById("playArea");
let scorebox = document.getElementById("scorebox");
let hiscorebox = document.getElementById("hiscorebox");


// ================= MAIN GAME LOOP =================
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;

    lastPaintTime = ctime;
    gameEngine();
}


// ================= COLLISION CHECK =================
function collide(snake) {

    // self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // wall collision
    if (snake[0].x <= 0 || snake[0].x >= 18 || snake[0].y <= 0 || snake[0].y >= 18) {
        return true;
    }

    return false;
}


// ================= GAME ENGINE =================
function gameEngine() {

    // game over check
    if (collide(snakeArr)) {
        gameSound.play();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any arrow key to start again.");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scorebox.innerHTML= "Score: 0 "; 
    }

    // food eaten
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {

        foodSound.play();
        score++;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscorebox.innerHTML = "High Score: " + hiscoreval;
        }

        scorebox.innerHTML = "Score: " + score;

        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    // ================= RENDER =================
    playArea.innerHTML = "";

    // draw snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake");
        }

        playArea.appendChild(snakeElement);
    });

    // draw food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    playArea.appendChild(foodElement);
}


// ================= HIGH SCORE =================
let hiscore = localStorage.getItem("hiscore");

if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
}

hiscorebox.innerHTML = "High Score: " + hiscoreval;


// ================= START GAME =================
window.requestAnimationFrame(main);


// ================= CONTROLS =================
window.addEventListener("keydown", e => {

    moveSound.play();
    inputDir = { x: 0, y: 1 };

    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    }
});
