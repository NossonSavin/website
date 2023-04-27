const board = document.querySelector('#board');
const apple = document.querySelector('.apple');
const highScoreBoard = document.querySelector('#highScore');
const gameOverMsg = document.querySelector('#gameOverMsg');
const highScoreMsg = document.querySelector('#highScoreMsg');
const scoreBoard = document.querySelector('#score');
const CELLSIZE = 20;
const BOARDSIZE = 600;
const APPLE_VALUE = 10;
let snake = [];
let applePos;
let isGameOver = false;
let isSnakeGrow = false;
let direction;
let score = 0;
let highScore;

const head = document.createElement('div');
head.id = 'innerHead';
head.innerHTML = "<div id='leftEye' class='eye'></div><div id='rightEye' class='eye'></div>";

const tail = document.createElement('div');
tail.innerHTML = "<div id='tailOuter' ><div id='tail'></div></div>";

document.querySelector('body').addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            direction = { func: moveUp, dir: 'up' };
            break;

        case 'ArrowDown':
            direction = { func: moveDown, dir: 'down' };
            break;

        case 'ArrowRight':
            direction = { func: moveRight, dir: 'right' };
            break;

        case 'ArrowLeft':
            direction = { func: moveLeft, dir: 'left' };
            break;

        case 'Enter':
            if (isGameOver) {
                isGameOver = false;
                start();
            }
            break;
    }
})

let moveToPos = { x: 0, y: 0 };

function moveRight() {
    moveToPos = { ...snake[snake.length - 1].pos };
    moveToPos.x += CELLSIZE;
}

function moveLeft() {
    moveToPos = { ...snake[snake.length - 1].pos };
    moveToPos.x -= CELLSIZE;
}

function moveUp() {
    moveToPos = { ...snake[snake.length - 1].pos };
    moveToPos.y -= CELLSIZE;
}

function moveDown() {
    moveToPos = { ...snake[snake.length - 1].pos };
    moveToPos.y += CELLSIZE;
}

function pushAndShift() {
    if (isGameOver) {
        return;
    }

    snake[snake.length - 1].elem.id = '';

    if (isSnakeGrow) {
        isSnakeGrow = false;
        makeSnakeCell({ moveToPos });
        snake[snake.length - 1].elem.className = "snake eat";
    } else {
        snake[0].elem.className = "snake";
        snake.push(snake.shift());
    }

    setTailAndHead();

    if (snake[0].pos.x > snake[1].pos.x && snake[0].pos.y === snake[1].pos.y) {
        snake[0].elem.className = "snake tail left";
    }
    else if (snake[0].pos.x < snake[1].pos.x && snake[0].pos.y === snake[1].pos.y) {
        snake[0].elem.className = "snake tail right";
    }
    else if (snake[0].pos.y > snake[1].pos.y && snake[0].pos.x === snake[1].pos.x) {
        snake[0].elem.className = "snake tail up";
    }
    else if (snake[0].pos.y < snake[1].pos.y && snake[0].pos.x === snake[1].pos.x) {
        snake[0].elem.className = "snake tail down";
    }
}

function moveSnake() {
    snake[snake.length - 1].pos.x = moveToPos.x;
    snake[snake.length - 1].pos.y = moveToPos.y;

    snake.forEach(i => {
        i.elem.style.left = i.pos.x + 'px';
        i.elem.style.top = i.pos.y + 'px';
    })
}

function checkMovePos(pos) {
    if (pos.x >= BOARDSIZE || pos.x < 0 || pos.y >= BOARDSIZE || pos.y < 0) {
        return isGameOver = true;
    }

    else if (pos.x === applePos.x && pos.y === applePos.y) {
        score += APPLE_VALUE;
        scoreBoard.innerText = score;
        moveApple();
        isSnakeGrow = true;
    }

    snake.forEach(e => {
        if (e.pos.x === pos.x && e.pos.y === pos.y) {
            isGameOver = true;
        }
    });
}

function makeSnakeCell(pos) {
    const cell = document.createElement('div');
    cell.className = "snake";
    board.appendChild(cell);
    cell.style.left = pos.x + 'px';
    cell.style.top = pos.y + 'px';

    snake.push({ elem: cell, pos: pos });
}

function setTailAndHead() {
    snake[snake.length - 1].elem.id = 'head';
    head.className = direction.dir;
    snake[snake.length - 1].elem.appendChild(head);
    snake[0].elem.appendChild(tail);
}

function moveApple() {
    let badApple = true;
    while (badApple) {
        applePos = {
            x: Math.floor((Math.random() * (BOARDSIZE / CELLSIZE))) * CELLSIZE,
            y: Math.floor((Math.random() * (BOARDSIZE / CELLSIZE))) * CELLSIZE
        }

        badApple = false;

        snake.forEach(e => {
            if (e.pos.x === applePos.x && e.pos.y === applePos.y) {
                badApple = true;
            }
        });
    }

    apple.style.left = applePos.x + 'px';
    apple.style.top = applePos.y + 'px';
}

async function start() {
    try {
        const response = await fetch('/score');
        const data = await response.json();
        highScore = data.score;
    } catch (error) {
        highScore = 0;
    }

    score = 0;
    scoreBoard.innerText = score;
    highScoreBoard.innerText = highScore;
    gameOverMsg.style.display = 'none';
    highScoreMsg.style.display = 'none';

    snake.forEach(i => i.elem.remove());
    snake = [];

    makeSnakeCell({ x: 0, y: 0 });
    makeSnakeCell({ x: 20, y: 0 });
    makeSnakeCell({ x: 40, y: 0 });
    moveApple();
    direction = { func: moveRight, dir: 'right' };

    snake[0].elem.className = "snake tail right";
    setTailAndHead();

    const intervalId = setInterval(() => {
        direction.func();
        checkMovePos(moveToPos);
        pushAndShift();

        if (isGameOver) {
            clearInterval(intervalId);
            if (score > highScore) {
                try {
                    fetch('/setScore', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: `{ "newScore": ${score} }`
                    });
                } catch (error) {
                    console.log(error)
                }

                highScore = score;
                highScoreMsg.style.display = 'block';
            } else {
                gameOverMsg.style.display = 'block';
            }
            return;
        }

        moveSnake();
    }, 100);
}

start();