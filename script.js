const startBtn = document.getElementById('startBtn');
const grid = document.getElementById('grid');
const message = document.getElementById('message');
let gridSize = 5;
let currentLevel = 1;
let highlightedCells = [];
let userClicks = [];

function createGrid(size) {
    grid.innerHTML = '';
    grid.style.width = size * 50 + 'px';
    grid.style.height = size * 50 + 'px';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', onCellClick);
        grid.appendChild(cell);
    }
}

function onCellClick(e) {
    const index = parseInt(e.target.dataset.index);

    if (highlightedCells.includes(index)) {
        e.target.classList.add('highlighted');
        userClicks.push(index);

        if (userClicks.length === highlightedCells.length) {
            if (arraysEqual(userClicks, highlightedCells)) {
                message.textContent = 'Correct! Next level!';
                currentLevel++;
                setTimeout(startGame, 2000);
            } else {
                message.textContent = 'Incorrect! Try again!';
                setTimeout(startGame, 2000);
            }
        }
    } else {
        message.textContent = 'Incorrect! Try again!';
        setTimeout(startGame, 2000);
    }
}

function startGame() {
    gridSize = 5;
    createGrid(gridSize);
    message.textContent = '';
    startBtn.disabled = true;

    const patternSize = Math.floor(gridSize * gridSize / 2);
    highlightedCells = generateRandomPattern(gridSize, patternSize);
    showPattern(highlightedCells).then(() => {
        startBtn.disabled = false;
        userClicks = [];
    });
}


function generateRandomPattern(gridSize, count) {
    const pattern = new Set();
    while (pattern.size < count) {
        const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
        pattern.add(randomIndex);
    }
    return Array.from(pattern);
}

function showPattern(pattern) {
    const cells = grid.querySelectorAll('.grid-cell');
    const delay = 1000;

    return new Promise((resolve) => {
        pattern.forEach((index, i) => {
            setTimeout(() => {
                cells[index].classList.add('highlighted');
            }, delay * i);
        });

        setTimeout(() => {
            cells.forEach((cell) => cell.classList.remove('highlighted'));
            resolve();
        }, delay * pattern.length);
    });
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

startBtn.addEventListener('click', startGame);
