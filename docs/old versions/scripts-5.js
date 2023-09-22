// ! Variables & Elements
// ? DOM Elements
const board = document.querySelector('.board')
const scoreEl = document.querySelector('.score')
const highScoreEl = document.querySelector('.high-score')
const levelEl = document.querySelector('.level')
const npGridEl = document.querySelector('.next-piece-grid')

// ? Variables
// Board config
const width = 10
const height = 24
const hiddenRows = 4
const cellCount = width * height
let cells = []

// Next piece grid config
const npgWidth = 4
const npgHeight = 4
const npgCellCount = npgWidth * npgHeight

// Piece classes
class Tpiece {
    constructor() {
        this.relativePosArr = [24, 23, 25, 34]
        this.actualPosArr = []
        this.cssClass = 't'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, 1, 10, -1],
            [0, 10, -1, -10],
            [0, -1, -10, 1],
            [0, -10, 1, 10]
        ]
    }
}

class Spiece {
    constructor() {
        this.relativePosArr = [34, 24, 25, 33]
        this.actualPosArr = []
        this.cssClass = 's'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, -10, -9, -1],
            [0, 1, 11, -10],
            [0, 10, 9, 1],
            [0, -1, -11, 10]
        ]
    }
}

class Zpiece {
    constructor() {
        this.relativePosArr = [34, 24, 23, 35]
        this.actualPosArr = []
        this.cssClass = 'z'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, -10, -11, 1],
            [0, 1, -9, 10],
            [0, 10, -1, 11],
            [0, -1, -10, 9]
        ]
    }
}

class Lpiece {
    constructor() {
        this.relativePosArr = [24, 14, 35, 34]
        this.actualPosArr = []
        this.cssClass = 'l'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, -10, 11, 10],
            [0, 1, 9, -1],
            [0, 10, -11, -10],
            [0, -1, -9, 1]
        ]
    }
}

class Jpiece {
    constructor() {
        this.relativePosArr = [24, 14, 34, 33]
        this.actualPosArr = []
        this.cssClass = 'j'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, -10, 10, 9],
            [0, 1, -1, -11],
            [0, 10, -10, -9],
            [0, -1, 1, 11]
        ]
    }
}

class Opiece {
    constructor() {
        this.relativePosArr = [34, 24, 25, 35]
        this.actualPosArr = []
        this.cssClass = 'o'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, -10, -9, 1],
            [0, -10, -9, 1],
            [0, -10, -9, 1],
            [0, -10, -9, 1]
        ]
    }
}

class Ipiece {
    constructor() {
        this.relativePosArr = [35, 36, 33, 34]
        this.actualPosArr = []
        this.cssClass = 'i'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, 1, -2, -1],
            [0, 10, -20, -10],
            [0, -1, 2, 1],
            [0, -10, 20, 10]
        ]
    }
}

const pieceClasses = [Tpiece, Spiece, Zpiece, Lpiece, Jpiece, Opiece, Ipiece]

// Game status - inactive, active or paused
let gameStatus = 'inactive'

// Game speed
let speed = 500
const speedDecrement = 50

// Scoring
let score = 0
let highScore = 10000
const singleScore = 100
const points = [singleScore, singleScore * 3, singleScore * 5, singleScore * 8]

// Levels
let level = 1
const levelThresholds = [500, 1000, 5000, 10000, 16000, 20000]

// First active piece
let activePiece = addPiece(randomClass())
let fallingPiece

// ! Functions
// ? Create board cells
function buildBoard() {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        // Add index to div element
        // cell.innerText = i
        // Add index as an attribute
        cell.dataset.index = i
        // Add height & width to each grid cell dynamically
        cell.style.height = `${100 / (height - hiddenRows)}%`
        cell.style.width = `${100 / width}%`

        // Add cell to grid
        board.appendChild(cell)
        // Add newly created div cell to cells array
        cells.push(cell)
    }
    const hiddenCells = cells.filter((cell, idx) => idx < hiddenRows * width)
    hiddenCells.map((cell) => cell.style.display = 'none')
}

// ? Create next piece cells
function nextPieceGrid() {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
    }
}

// ? Create new piece
function addPiece(pieceClass) {
    return new pieceClass()
}

// ? Translate piece
// Remaps the relative array according to the new anchor position
// Adjusts according to current rotation
function translate(anchorPos) {
    activePiece.relativePosArr = activePiece.rotationOffsets[activePiece.rotationIdx].map((offset) => anchorPos + offset)
}

// ? Rotate piece
// Changes the rotation index clockwise or antiClockwise by 1, then runs translate
function rotate(direction) {
    if (direction === 'clockwise') activePiece.rotationIdx !== 3 ? activePiece.rotationIdx++ : activePiece.rotationIdx = 0
    if (direction === 'anticlockwise') activePiece.rotationIdx !== 0 ? activePiece.rotationIdx-- : activePiece.rotationIdx = 3
    translate(activePiece.relativePosArr[0])
}

// ? Ghost piece position
function ghostPosition() {
    return activePiece.rotationOffsets[activePiece.rotationIdx].map((offset) => findLowest() + offset)
}

// ? Move left
function moveLeft() {
    if (!testTranslation('left', activePiece.relativePosArr[0] - 1, activePiece.rotationIdx)) {
        translate(activePiece.relativePosArr[0] -= 1)
    }
}

// ? Move right
function moveRight() {
    if (!testTranslation('right', activePiece.relativePosArr[0] + 1, activePiece.rotationIdx)) {
        translate(activePiece.relativePosArr[0] += 1)
    }
}

// ? Move down
function moveDown() {
    if (!testTranslation('down', activePiece.relativePosArr[0] + 10, activePiece.rotationIdx)) {
        translate(activePiece.relativePosArr[0] += 10)
    } else {
        lockPiece()
    }
}

// ? Rotate Clockwise
function rotateClockwise() {
    let testRotationIdx = activePiece.rotationIdx !== 0 ? activePiece.rotationIdx - 1 : 3
    if (!testRotation(testRotationIdx)) {
        rotate('clockwise')
    }
}

// ? Rotate Anticlockwise
function rotateAnticlockwise() {
    let testRotationIdx = activePiece.rotationIdx !== 0 ? activePiece.rotationIdx - 1 : 3
    if (!testRotation(testRotationIdx)) {
        rotate('anticlockwise')
    }
}

// ? Drop piece
function dropPiece() {
    translate(findLowest())
}

// ? Test whether movement is possible
// Direction params - left, right, down, rotateClockwise, rotateAnticlockwise
function testTranslation(direction, anchorPos, rotationIdx) {

    // Get new potential position
    let potentialPosition = activePiece.rotationOffsets[rotationIdx].map((offset) => anchorPos + offset)

    // Check none of the positions exceed the cell count
    if (potentialPosition.some((pos) => pos > cellCount - 1)) return true

    // Get an array of the potential cells
    let potentialCells = potentialPosition.map((pos) => cells[pos])

    // Check that none of them are locked
    for (cell of potentialCells) {
        if (cell.classList.contains('locked')) return cell
    }

    // Check left bounds
    if (direction === 'left') {
        let modulusArray = potentialPosition.map((relativePos) => relativePos % 10)
        return modulusArray.includes(9) 
    
    // Check right bounds
    } else if (direction === 'right') {
        let modulusArray = potentialPosition.map((relativePos) => relativePos % 10)
        return modulusArray.includes(0)

    } else if (direction === 'down') {
        return potentialPosition.some((pos) => pos > cellCount - 1)
    }
}

// Rotations
function testRotation(rotationIdx) {
    let potentialPosition = activePiece.rotationOffsets[rotationIdx].map((offset) => activePiece.relativePosArr[0] + offset)

    if (activePiece.relativePosArr[0] % 10 < 6) {
        return testTranslation('left', potentialPosition[0], rotationIdx)    
    }

    if (activePiece.relativePosArr[0] % 10 > 5) {
        return testTranslation('right', potentialPosition[0], rotationIdx)    
    }
}

// ? Find lowest possible position
function findLowest() {
    let anchorPos = activePiece.relativePosArr[0] + width
    let test = false
    while (test === false) {
        test = testTranslation('down', anchorPos, activePiece.rotationIdx)
        anchorPos += width
    }
    return anchorPos - (2 * width)
}

// ? Lock piece and generate a new one
function lockPiece() {
    for (cell of activePiece.actualPosArr) {
        cell.classList.add('locked')
        renderPiece()
        cell.classList.remove('active')
    }
    if (gameOverCheck()) gameOver()
    increaseScore(completedLineCheck().length)
    removeComplete(completedLineCheck())
    activePiece = addPiece(randomClass())
}

// ? Check whether game is over
function gameOverCheck() {
    return !activePiece.relativePosArr.every((pos) => pos > cellCount - (cellCount - hiddenRows * width))
}

// ? Check for completed lines
function completedLineCheck() {
    // Get rows to check
    let rowPositions = activePiece.relativePosArr.map((relativePos) => relativePos % 10)
    let rows = activePiece.relativePosArr.map((relativePos, idx) => relativePos - rowPositions[idx])
    // Remove duplicates
    let uniqueRows = [...new Set(rows)]
    // Check whether each cell in each row is locked
    let completeRows = []
    for (num of uniqueRows) {
        let lockedCount = 0
        for (let i = 0; i < width; i++) {
            if (cells[num + i].classList.contains('locked')) lockedCount++
        }
        if (lockedCount === 10) completeRows.push(num)
    }
    return completeRows
}

// ? Remove completed lines and shift remaining locked pieces down
function removeComplete(rows) {
    for (rowNum of rows) {
        // Remove piece and locked classes from row
        for (let i = 0; i < width; i++) {
            cells[rowNum + i].className = ''
        }
        // Find rows with locked cells above the row
        let currentRow = rowNum - width
        let lockedRows = []
        while (currentRow >= 0) {
            for (let i = 0; i < width; i++) {
                if (cells[currentRow + i].classList.contains('locked')) {
                    lockedRows.push(currentRow)
                    break
                }
            }
            currentRow -= width
        }
        // Remove locked and piece classes from each cell in the row, and add them to the cell below
        for (rowNum of lockedRows) {
            for (let i = 0; i < width; i++) {
                let classList = [...cells[rowNum + i].classList]
                // Remove classes from current element
                cells[rowNum + i].className = ''
                // Remove classes from target element
                cells[rowNum + i + width].className = ''
                // Add classes to target element
                classList.forEach((element) => cells[rowNum + i + width].classList.add(element))   
            }
               
        }
    }
} 

// ? Increase Score
function increaseScore(numRows) {
    if (numRows > 0) score += points[numRows - 1]
    if (score >= levelThresholds[level - 1]) increaseLevel()
    renderScoreboard()
}

function increaseLevel() {
    level++
    speed -= speedDecrement
    renderScoreboard()
}

// ? Select random piece class
function randomClass() { 
    return pieceClasses[Math.floor(Math.random() * 7)] 
}

// ? Falling
function fall() {
    removePiece()
    moveDown()
    renderPiece()
}

// ! Init function
function init() {
    buildBoard()
    renderScoreboard()
}

// ! Game state functions
// ? Game Start
function gameStart() {
    gameStatus = 'active'
    activePiece = addPiece(randomClass())
    renderPiece()
    fallingPiece = setInterval(fall, speed)
    level = 1
    score = 0
    renderScoreboard()
    resetBoard()
}

// ? Game Over
function gameOver() {
    gameStatus = 'inactive'
    clearInterval(fallingPiece)
    console.log("Game Over");
    resetBoard()
    cells.map((cell) => cell.classList.add('gameover'))
}

// ? Pause
function pauseGame() {
    gameStatus = 'paused'
    clearInterval(fallingPiece)
    console.log("Pause");
}

// ? Resume
function resumeGame() {
    gameStatus = 'active'
    // Render first piece
    renderPiece()
    fallingPiece = setInterval(fall, speed)
}

// ! Render functions
// ? Render piece
function renderPiece() {
    // Target cells with indices that match relativePosArr
    activePiece.actualPosArr = activePiece.relativePosArr.map((relativePos) => cells[relativePos])
    // Add the relevant CSS class to each cell
    for (element of activePiece.actualPosArr) {
        element.classList.add(activePiece.cssClass, 'active')
    }
    renderGhost()
}

// ? Remove piece
function removePiece() {
    // Remove the relevant CSS class from each cell
    for (cell of activePiece.actualPosArr) {
        cell.classList.remove(activePiece.cssClass, 'active')    
    }
    removeGhost()
}

// ? Render ghost piece
function renderGhost() {
    let ghostCells = ghostPosition().map((pos) => cells[pos])
    for (cell of ghostCells) {
        if (!cell.classList.contains('active')) cell.classList.add(activePiece.cssClass, 'ghost')
    }
}

function removeGhost() {
    let ghostCells = ghostPosition().map((pos) => cells[pos])
    for (cell of ghostCells) {
        cell.classList.remove(activePiece.cssClass, 'ghost')
    }
}

function renderScoreboard() {
    scoreEl.innerHTML = score
    levelEl.innerHTML = level
}

function resetBoard() {
    cells.map((cell) => cell.className = '')
}

// ! Controls
function controls(event) {
    const key = event.keyCode

    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32
    const z = 90
    const x = 88
    const p = 80

    if (gameStatus === 'active') {
        // Remove piece from current position, before moving to new position
        removePiece()

        if (key === down) moveDown()
        if (key === left) moveLeft()
        if (key === right) moveRight()
        if (key === z || key === up) rotateClockwise()
        if (key === x) rotateAnticlockwise()
        if (key === space) dropPiece()
        if (key === p) pauseGame()

        // Render piece in new position
        renderPiece()
    } 
    if (gameStatus === 'inactive') {
        if (key === space) gameStart()
    }
    if (gameStatus === 'paused') {
        if (key === space) resumeGame()
    }
}

// ! Events
document.addEventListener('keydown', controls)

// ! Page load
init()



