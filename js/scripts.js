// ! Constants
// const pieceClasses = [Tpiece, Spiece, Zpiece, Lpiece, Jpiece, Opiece, Ipiece]
const moveSound = new Audio('./assets/mixkit-game-ball-tap-2073.wav')

// ! Variables & Elements
// ? Elements
// Create board
const board = document.querySelector('.board')

// ? Variables
// Board config
const width = 10
const height = 20
const cellCount = width * height
let cells = []

// Piece config
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

// Active piece
let activePiece = addPiece(Ipiece)

// ! Functions
// ? Create board cells
function buildBoard() {
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div')
        // // Add index to div element
        // cell.innerText = i
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

// ? Create piece
function addPiece(pieceClass) {
    return new pieceClass()
}

// ? Render piece
function renderPiece() {
    //
    activePiece.actualPosArr = activePiece.relativePosArr.map((relativePos) => cells[relativePos])
    // Add the relevant CSS class to each cell
    for (element of activePiece.actualPosArr) {
        element.classList.add(activePiece.cssClass)
    }
}

// ? Remove piece
function removePiece() {
    // Remove the relevant CSS class from each cell
    for (element of activePiece.actualPosArr) {
        element.classList.remove(activePiece.cssClass)    
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
    if (direction === 'antiClockwise') activePiece.rotationIdx !== 0 ? activePiece.rotationIdx-- : activePiece.rotationIdx = 3
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

    if (key === down) translate(activePiece.relativePosArr[0] += 10)
    if (key === left) translate(activePiece.relativePosArr[0] -= 1)
    if (key === right) translate(activePiece.relativePosArr[0] += 1)
    if (key === up) translate(activePiece.relativePosArr[0] -= 10)
    if (key === z) rotate('antiClockwise')
    if (key === x) rotate('clockwise')

    moveSound.play()
    // Render piece in new position
    renderPiece()
}

// Detect collision and return true/false
function detectCollision() {
    function leftSide() {

    }
    function rightSide() {

    }
    function bottom() {

    }
}

// // ? Select random piece class
// function randomClass() { 
//     return pieceClasses[Math.floor(Math.random() * 7)] 
// }

// ! Events
document.addEventListener('keydown', handleMovement)

// ! Page load
buildBoard()
renderPiece()
