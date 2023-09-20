// ! Variables & Elements
// ? Elements
// Create board
const board = document.querySelector('.board')
const scoreEl = document.querySelector('.score')
const highScoreEl = document.querySelector('.high-score')
const levelEl = document.querySelector('.level')

// ? Variables
// Board config
const width = 10
const height = 20
const cellCount = width * height
let cells = []

// Piece classes
class Tpiece {
    constructor() {
        this.relativePosArr = [4, 3, 5, 14]
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
        this.relativePosArr = [14, 4, 5, 13]
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
        this.relativePosArr = [14, 4, 3, 15]
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
        this.relativePosArr = [14, 4, 25, 24]
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
        this.relativePosArr = [14, 4, 24, 23]
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
        this.relativePosArr = [14, 4, 5, 15]
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
        this.relativePosArr = [15, 16, 13, 14]
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

// First active piece
let activePiece = addPiece(randomClass())

// Game speed
let speed = 1000
let level = 1
let score = 0
let highScore = 10000

// ! Functions
// ? Create board cells
function buildBoard() {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        // Add index to div element
        cell.innerText = i
        // Add index as an attribute
        cell.dataset.index = i
        // Add height & width to each grid cell dynamically
        cell.style.height = `${100 / height}%`
        cell.style.width = `${100 / width}%`

        // Add cell to grid
        board.appendChild(cell)
        // Add newly created div cell to cells array
        cells.push(cell)
    }
}

// ? Create new piece
function addPiece(pieceClass) {
    return new pieceClass()
}

// ? Render piece
function renderPiece() {
    //
    activePiece.actualPosArr = activePiece.relativePosArr.map((relativePos) => cells[relativePos])
    // Add the relevant CSS class to each cell
    for (element of activePiece.actualPosArr) {
        element.classList.add(activePiece.cssClass, 'active')
    }
}

// ? Remove piece
function removePiece() {
    // Remove the relevant CSS class from each cell
    for (cell of activePiece.actualPosArr) {
        cell.classList.remove(activePiece.cssClass)    
    }
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

// ? Handle movement
function handleMovement(event) {
    const key = event.keyCode

    const up = 38
    const down = 40
    const left = 37
    const right = 39
    const space = 32
    const z = 90
    const x = 88

    // Remove piece from current position, before moving to new position
    removePiece()

    if (key === down) moveDown()
    if (key === left) moveLeft()
    if (key === right) moveRight()
    if (key === up) translate(activePiece.relativePosArr[0] -= 10)
    if (key === z) rotateClockwise()
    if (key === x) rotateAnticlockwise()

    // Render piece in new position
    renderPiece()
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
        return potentialPosition.some((pos) => pos > 199)
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

// ? Lock piece and generate a new one
function lockPiece() {
    for (cell of activePiece.actualPosArr) {
        cell.classList.remove('active')
        cell.classList.add('locked')
        renderPiece()
    }
    removeComplete(completedLineCheck())
    activePiece = addPiece(randomClass())
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
            cells[rowNum + i].classList.remove('i', 'o', 's', 'z', 't', 'j', 'l', 'locked')
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
                cells[rowNum + i].classList.remove('i', 'o', 's', 'z', 't', 'j', 'l', 'locked')
                // Remove classes from target element
                cells[rowNum + i + width].classList.remove('i', 'o', 's', 'z', 't', 'j', 'l', 'locked')
                // Add classes to target element
                classList.forEach((element) => cells[rowNum + i + width].classList.add(element))   
            }
               
        }
    }
} 

// ? Score


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

// ! Events
document.addEventListener('keydown', handleMovement)

// ! Page load
buildBoard()
renderPiece()
setInterval(fall, 500)

