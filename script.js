const grid = document.getElementById('grid');
const message = document.getElementById('message');
const startBtn = document.getElementById('start');

let gridSize;
let currentLevel = 1;
let highlightedCells;
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
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (userClicks.includes(index)) {
        return;
    }

    userClicks.push(index);
    cell.classList.add('selected');

    if (userClicks.length === highlightedCells.length) {
        if (checkUserInput()) {
            currentLevel++;
            message.textContent = 'Correct! Proceeding to the next level.';
            setTimeout(startGame, 2000);
        } else {
            message.textContent = 'Incorrect! Try again.';
            setTimeout(startGame, 2000);
        }
    }
}


function startGame() {
    gridSize = 5;
    createGrid(gridSize);
    message.textContent = `Level ${currentLevel}`;
    startBtn.disabled = true;

    const patternSize = currentLevel;
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
        pattern.forEach((index) => {
            cells[index].classList.add('highlighted');
        });

        setTimeout(() => {
            cells.forEach((cell) => cell.classList.remove('highlighted'));
            resolve();
        }, delay);
    });
}

function checkUserInput() {
    const userClicksSet = new Set(userClicks);
    const highlightedCellsSet = new Set(highlightedCells);

    if (userClicksSet.size !== highlightedCellsSet.size) {
        return false;
    }

    for (const cell of highlightedCellsSet) {
        if (!userClicksSet.has(cell)) {
            return false;
        }
    }

    return true;
}

startBtn.addEventListener('click', startGame);
