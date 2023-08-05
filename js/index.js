const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score--value");
const scoreFull = document.querySelector(".score")
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const btnPlay = document.querySelector(".btn-play");
const audio = new Audio("assets/assets_audio.mp3");

const size = 30
let snake = [{x: 270, y: 270}]
let direction = "right", loopId;

const incremmentScore = () => {
    score.innerHTML = +score.innerHTML + 10;
}

const randonNumber = (min, max) => {
    return (Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randonNumber(0, (canvas.width - size))
    return (Math.round(number / 30) * 30);
}

const randdomColor = () => {
    const red = randonNumber(0, 255);
    const green = randonNumber(0, 255);
    const blue = randonNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randdomColor()
}

const drawFood = () => {

    const {x, y, color} = food

    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0;
}

const drawSnake = () => {
    ctx.fillStyle = "white"
    snake.forEach((el, index) => {

        if ( index === snake.length - 1) {
            ctx.fillStyle = "#a9a9a9"
        }

    ctx.fillRect(el.x, el.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "white"

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i,600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(600,i)
        ctx.stroke()
    }

  
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        snake.push(head)
        audio.play()
        incremmentScore();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randdomColor();
    }

}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const headIndex = snake.length - 2;
    canvasLimit = canvas.width - size;
    const wallColision = head.x > canvasLimit || head.x < 0 || head.y < 0 || head.y > canvasLimit;
    const selfColision = snake.find((position, index) =>  index < headIndex && position.x == head.x && position.y == head.y)
    if (wallColision || selfColision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;
    menu.style.display = "flex"
    finalScore.innerHTML = score.innerHTML
    scoreFull.style.display = "none"
    canvas.style.filter = "blur(2px)"
}

gameLoop = () => {
    clearInterval(loopId);
    ctx.clearRect(0, 0, 600, 600);

    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setInterval(() => {
        gameLoop()
    }, 300)
}

gameLoop();

document.addEventListener("keydown", ( {key} ) => {
    if (key === "ArrowRight" && (direction != "left")) direction = "right";
    if (key === "ArrowLeft" && (direction != "right")) direction = "left";
    if (key === "ArrowDown" && (direction != "up")) direction = "down";
    if (key === "ArrowUp" && (direction != "down")) direction = "up";
})

btnPlay.addEventListener("click", () => {
    score.innerHTML = "00"
    scoreFull.style.display = "flex"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake = [{x: 270, y: 270}]
})
