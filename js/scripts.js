// ! Constants
// const pieceClasses = [Tpiece, Spiece, Zpiece, Lpiece, Jpiece, Opiece, Ipiece]

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
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos + 1, this.anchorPos + 10, this.anchorPos - 1]
        this.actualPosArr = []
        this.cssClass = 't'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos + 1, this.anchorPos + 10, this.anchorPos - 1]
        this.actualPosArr = this.relativePosArr.map((relativePos) => cells[relativePos])
    }
}

class Spiece {
    constructor() {
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos - 9, this.anchorPos - 1]
        this.cssClass = 's'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos - 9, this.anchorPos - 1]
    }
}

class Zpiece {
    constructor() {
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos + 1, this.anchorPos - 11]
        this.cssClass = 'z'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos + 1, this.anchorPos - 11]
    }
}

class Lpiece {
    constructor() {
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos + 11, this.anchorPos + 10]
        this.cssClass = 'l'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos + 11, this.anchorPos + 10]
    }
}

class Jpiece {
    constructor() {
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos + 10, this.anchorPos + 9]
        this.cssClass = 'j'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos - 10, this.anchorPos + 10, this.anchorPos + 9]
    }
}

class Opiece {
    constructor() {
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos + 10, this.anchorPos + 11, this.anchorPos + 1]
        this.cssClass = 'o'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos + 10, this.anchorPos + 11, this.anchorPos + 1]
    }
}

class Ipiece {
    constructor() {
        this.anchorPos = 0
        this.relativePosArr = [this.anchorPos, this.anchorPos + 1, this.anchorPos - 1, this.anchorPos - 2]
        this.cssClass = 'i'
    }
    translate(anchorPos) {
        this.anchorPos = anchorPos
        this.relativePosArr = [this.anchorPos, this.anchorPos + 1, this.anchorPos - 1, this.anchorPos - 2]
    }
}

// Active piece
let activePiece = addPiece(Tpiece)

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

// ? Create piece
function addPiece(pieceClass) {
    return new pieceClass()
}

// ? Render piece in specified position
function renderPiece(anchorPos) {
    activePiece.translate(anchorPos)
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

    if (key === down) renderPiece(activePiece.anchorPos += 10)
    if (key === left) renderPiece(activePiece.anchorPos -= 1)
    if (key === right) renderPiece(activePiece.anchorPos += 1)
    if (key === up) renderPiece(activePiece.anchorPos -= 10)
}

// Detect collision and return true/false
function detectCollision() {
    function leftSide() {

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
renderPiece(14)
