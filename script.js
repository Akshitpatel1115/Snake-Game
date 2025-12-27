// select elements
const board = document.querySelector('.board')
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

// grid block size
const blockWidth = 30
const blockHeight = 30

let highScore = localStorage.getItem("highScore") || 0
let score = 0
let time = `00-00`

highScoreElement.innerText = highScore

// cal grid
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null
let timerIntervalId = null

// locate fruit at random loc
let fruit = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

const blocks = []
let snake = [{ x: 8, y: 3 }]
let direction = 'up'

// create grid blocks 
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block // storing address of all block in blocks
    }
}

// render snake
function render() {
    let head = null

    blocks[`${fruit.x}-${fruit.y}`].classList.add("fruit")

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // Game Over Logic
    if (head.x == -1 || head.x >= rows || head.y == -1 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"
        return;
    }

    // Fruit Eat Logic
    if (head.x == fruit.x && head.y == fruit.y) {
        blocks[`${fruit.x}-${fruit.y}`].classList.remove("fruit")
        fruit = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${fruit.x}-${fruit.y}`].classList.add("fruit")

        snake.unshift(head)
        score += 10
        scoreElement.innerText = score
        if (score > highScore) {
            highScore = score
            localStorage.setItem("highScore", highScore.toString())
            highScoreElement.innerText = highScore
        }
    }

    // remove snake every time when fruit eat
    snake.forEach(segment => {
        const block = blocks[`${segment.x}-${segment.y}`]
        block.classList.remove("snake-head")
        block.classList.remove("snake-body")
        block.classList.remove("snake-tail")
    })

    snake.unshift(head)
    snake.pop()

    // update snake every time when fruit eat 
    snake.forEach((segment, index) => {
        const block = blocks[`${segment.x}-${segment.y}`]
        if (index === 0) {
            block.classList.add("snake-head")
        } else if (index === snake.length - 1) {
            block.classList.add("snake-tail")
        } else {
            block.classList.add("snake-body")
        }
    })
}

// start button logic
startButton.addEventListener("click", () => {
    modal.style.display = 'none'
    intervalId = setInterval(() => { render() }, 300)
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)

        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }
        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000)
})

// restart game logic
restartButton.addEventListener("click", restartGame)
function restartGame() {

    blocks[`${fruit.x}-${fruit.y}`].classList.remove("fruit")
    snake.forEach(segment => {
        const block = blocks[`${segment.x}-${segment.y}`]
        block.classList.remove("snake-head")
        block.classList.remove("snake-body")
        block.classList.remove("snake-tail")
    })

    score = 0
    time = `00-00`
    scoreElement.innerText = score
    highScoreElement.innerText = highScore
    timeElement.innerText = time

    modal.style.display = "none"
    snake = [{ x: 8, y: 3 }]
    fruit = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    intervalId = setInterval(() => { render() }, 300)
}

// control snake by using arrow keys
addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        direction = "up"
    } else if (event.key == "ArrowLeft") {
        direction = "left"
    } else if (event.key == "ArrowDown") {
        direction = "down"
    } else if (event.key == "ArrowRight") {
        direction = "right"
    }
})

// touch control in mobile

let touchStartX = 0
let touchStartY = 0

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
})

document.addEventListener("touchend", (e) => {
    let touchEndX = e.changedTouches[0].clientX
    let touchEndY = e.changedTouches[0].clientY

    let diffX = touchEndX - touchStartX
    let diffY = touchEndY - touchStartY

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && direction !== "left") {
            direction = "right"
        } else if (diffX < 0 && direction !== "right") {
            direction = "left"
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && direction !== "up") {
            direction = "down"
        } else if (diffY < 0 && direction !== "down") {
            direction = "up"
        }
    }
})


