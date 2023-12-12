
# Project 1: Tetris ReadMe

## Description

The project is my take on Tetris. It was built as my first major project on the General Assembly Software Engineering Immersive course. The game is built entirely on JavaScript.

## Deployment link

[https://thstanton.github.io/tetris-project/](https://thstanton.github.io/tetris-project/)

## Getting Started/Code Installation

The code is accessible through my Github repo, here: [https://github.com/thstanton/tetris-project](https://github.com/thstanton/tetris-project)

## Timeframe & Working Team

This project was completed solo, in 1 week.

## Technologies Used

* JavaScript
* CSS
* HTML
* GIT
* Github
* Photoshop (to create the sprites)
* Google Fonts
* FontAwesome

## Brief
**Overview:**

Let's start out with something fun - a game! You will be working individually for this project, but we'll be guiding you along the process and helping as you go. Show us what you've got!

**Technical Requirements:**

Your app must:
* Render a game in the browser
* Be built on a grid: do not use HTML Canvas for this
* Design logic for winning & visually display which player won
* Include separate HTML / CSS / JavaScript files
* Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
* Use Javascript for DOM manipulation
* Deploy your game online, where the rest of the world can access it (we will do this together at the end of the project)
* Use semantic markup for HTML and CSS (adhere to best practices)

**Necessary Deliverables**
* A working game, built by you, hosted somewhere on the internet
* A link to your hosted working game in the URL section of your Github repo
* A git repository hosted on Github, with a link to your hosted game, and frequent commits dating back to the very beginning of the project
* A readme.md file with explanations of the technologies used, the approach taken, installation instructions, unsolved problems, etc. (completed post project)

## Planning

![Controls wireframe](/readme-images/image1.png)

## Build/Code Process

**Layout**

I began the project by using HTML and CSS to create the basic page layout. I wanted the page to be responsive to different browser windows, so I used a combination of flexboxes and specifying sizes in vmin to achieve this. By far the most challenging part of this was creating the large vertical TETRIS title, which I wanted to place alongside the game board and have it maintain the height of the board in different sizes. I had to try various implementations of transforming the text, using the writing mode: vertical-lr property, line-height, flexbox properties and font-sizes to achieve the desired effect.

**Creating and translating the tetrominoes**
```js
class Tpiece {
    constructor() {
        this.relativePosArr = [24, 23, 25, 34]
        this.actualPosArr = []
        this.cssClass = 't'
        this.rotationIdx = 0
        this.rotationOffsets = [
            [0, 1, width, -1],
            [0, width, -1, -width],
            [0, -1, -width, 1],
            [0, -width, 1, width]
        ]
        this.nextPieceGrid = npg3x3Cells
        this.nextPiecePos = [0, 1, 2, 4]
    }
}
```

I used JavaScript classes to create the tetrominoes, enabling me to store the information relative to each shape. Each shape consists of an array of 4 indices, which represent the starting position of each shape. The first index is the central point of the shape, which I have referred to as the anchor position throughout the code. The other 3 indices are the squares in order clockwise from the anchor position.

To implement rotation of the pieces, I created a nested array of 4 sets of offsets - which are added to or subtracted from to the piece’s current coordinates to make the shape appear to have rotated 90 degrees clockwise. There is a rotation index property, which specifies which rotation the shape is currently in.

The indices that are stored in the object are used to locate the indices of the relevant DOM nodes, and the render function adds the relevant class to those nodes - adding the corresponding background styling to those squares on the grid. These nodes are stored in the ‘actualPosArr’ property.

The ‘translate’ function takes a new anchor position and uses the offsets of the current rotation to map the positions of the other squares. The ‘rotate’ function takes a direction (clockwise or anticlockwise) and adjusts the rotation index of the active piece accordingly.

I initially created a set of basic controls to enable me to test the movement of the squares - this became more sophisticated later on in the process when I added the testing functions which tested whether moves are possible.

**Edge Detection**

With the movement of the pieces implemented, the next phase of the project was ensuring that the pieces could not move outside of the grid or into any squares which were occupied by ‘locked’ pieces. This was perhaps the most challenging part of the project (details below).

I created a pair of testing functions - one for translation and one for rotation - which take the potential position the player is trying to move a piece to and check that the position of every piece is possible within the rules of the game.

```js
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
        let modulusArray = potentialPosition.map((relativePos) => relativePos % width)
        console.log(modulusArray);
        return modulusArray.includes(9) 
    }
    // Check right bounds
    if (direction === 'right') {
        let modulusArray = potentialPosition.map((relativePos) => relativePos % width)
        return modulusArray.includes(0)
    }
    if (direction === 'down') {
        return potentialPosition.some((pos) => pos > cellCount - 1)
    }
}
```

The left and right tests use the modulus of the width to work out the indices’ position in the row and check that the potential positions do not exceed the bounds of the row. The downward test checks that none of the cells’ indices would be greater than the index of the last cell. The test function also checks that none of the cells are occupied - ie. have a class of ‘locked’.

```js
function testRotation(anchorPos, rotationIdx) {
    let potentialPosition = activePiece.rotationOffsets[rotationIdx].map((offset) => anchorPos + offset)

    if (activePiece.relativePosArr[0] % 10 < 6) {
        return testTranslation('left', potentialPosition[0], rotationIdx)    
    }

    if (activePiece.relativePosArr[0] % 10 > 5) {
        return testTranslation('right', potentialPosition[0], rotationIdx)    
    }
}
```

The rotation test sets the potential position with the new rotation and runs the left or right translation test based on whether the piece is towards the left or the right side of the board.

**Locking Pieces**

Once the pieces consistently stayed within bounds, I was then able to use setInterval to make the active pieces ‘fall’. I created separate movement functions for each type of movement (left, right, down, rotate clockwise and rotate anticlockwise) which call the test function and move the piece as long as the test passes. The moveDown function also calls a lockPiece function if the test fails.

```js
function lockPiece() {
    for (cell of activePiece.actualPosArr) {
        cell.classList.add('locked')
        renderPiece()
        cell.classList.remove('active')
    }
    if (gameOverCheck()) {
        gameOver()
        return
    }
    lockSound.currentTime = 0
    lockSound.play()
    let completedRowsNum = completedLineCheck().length
    let completeRows = completedLineCheck()
    if (completedRowsNum > 0) {
        increaseScore(completedRowsNum)
        removeComplete(completeRows)
    }
    activePiece = nextPiece
    nextPiece = addPiece(randomClass())
    renderNextPiece()
}
```

The lockPiece function is critical to the gameplay, and performs several important roles:

1. It adds a class of ‘locked’ to each square in the active piece
2. It calls renderPiece to render the piece in its final position
3. It removes the ‘active’ class from the piece
4. It calls a check whether the game is over and calls the game over function if necessary
5. It invokes the function which checks for completed lines and, if necessary, the function to remove them
6. It creates a new active piece

**Completed Lines**

With the moving, rotating, falling and locking, the next process to develop was the test for completed lines and the function to remove them. This was also a significant challenge - details below.

```js
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
    // Put them in numerical order
    completeRows.sort((a, b) => a - b);
    return completeRows
}
```

The function to check for completed lines creates an array of the final positions of the active piece and uses the modulus of the width to calculate the first cell of each row occupied, removes duplicates and checks whether every cell in the row contains a class of ‘locked’. It then returns an array of completed rows in numerical order.

```js
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
```

The removeComplete rows function then takes this array and, for each row, removes all classes (rendering the cells ‘empty’). It then, using a combination of a while loop and a for loop, checks each row above for ‘locked’ cells, storing each row that contains locked cells in another array. Finally, for each row in the array, it stores all classes for each cell in a variable, removes all classes from the cell and the cell below it in the grid, then adds the classes stored in the variable to the cell below.

**Game States**

With each of these functions complete, the core gameplay loop was complete (albeit with some bugs). I then needed to create the game states to enable the game to start and end. I created functions for starting the game and ending the game. I also created a game state variable - which enabled me to adjust the function of the controls depending on whether the game was active or not (eg. using the spacebar to ‘start’ the game).

When implementing the game over function, I realised my current game board posed a problem - as the pieces were ‘spawning’ in the top two rows of the board. This meant that a game over needed to be triggered 2 rows below the top, which did not feel quite right. Instead, I created an additional 4 hidden rows ‘above’ the top rows on the board. This enabled me to create new pieces ‘above’ the board to fall ‘into’ it. This meant that the top 2 rows could be used for play, pieces that locked ‘outside’ the grid could trigger game over and the pieces now appeared much more naturally.

**Scoring and Levelling Up**

I then implemented the scoring and levelling up functions, which allocated points for completed rows and checked for certain score thresholds, which would trigger the level (and falling speed) to increase - updating the scoreboard accordingly.

**Hard Drop and Ghost Piece**

Although pressing the down arrow key would cause the piece to fall faster than the fall speed, I did not yet have a ‘hard drop’ function - which would immediately drop the piece into place. I also wanted to have a ‘ghost piece’ which shows where the piece would land if dropped. I quickly realised that these could use the same code - as both would need to calculate the piece’s lowest possible position. I tried several ways to do this, before realising that my already existing test function could serve this purpose quite neatly. I created a function that uses a while loop to test each row below the piece until it finds an illegal move, and returns the lowest ‘legal’ position of the piece. The hard drop function moves the piece to this position instantly. A render ghost function continuously adds a ‘ghost’ class to this position, which has an opacity of 20%.

**Next piece grid**

I envisioned the next piece grid as a second grid that would use the same information as the piece classes to display a smaller version of the piece, however, I realised that with the pieces being different lengths it would not be possible to centre them all on the same grid. To mitigate this, I created 3 grids with dimensions to suit the pieces that were 2, 3 and 4 cells long respectively. These grids are hidden until revealed by the renderNextPiece function. As the squares are sized as proportions of the overall width, I also included some conditionals that resize the grid according to which of the 3 grids is being displayed so that the pieces appear the same size.

**Player messages**

I then switched my attention to the ‘messaging area’ to the bottom right of the board. I planned to use this area to render messages relevant to the game state and alerts to game events, such as scoring points, levelling up and achieving a new high score.

To implement this, I created a showMessage function, which adds children to the messaging area div. I realised that there were two different types of message to render:

1. Messages which related to the game state (eg. ‘Paused’) needed to be persistent, and only needed to be displayed one at a time.
2. Alerts to in-game events needed to be displayed for a short time, and more than one may need to be displayed at once (for example if a completed line led to a level up).

```js
// ? Show message - persistent(stays on screen until removed) or alert(stays on screen for set period)
function showMessage(text, type) {
    // Remove current persistent message if there is one
    let currentMessage = messagingEl.querySelector('.persistent')
    if (currentMessage) messagingEl.removeChild(currentMessage)
    
    // Create message
    const message = document.createElement('div')
    message.innerHTML = text
    message.classList.add(type, 'message')

    // Styling for specific messages
    if (text === "SINGLE") message.classList.add('single')
    if (text === "DOUBLE") message.classList.add('double')
    if (text === "TRIPLE") message.classList.add('triple')
    if (text === "TETRIS!") message.classList.add('tetris')

    // Add message to messaging area
    messagingEl.appendChild(message)

    // If message is an alert, set time out
    if (type === 'alert') setTimeout(() => messagingEl.removeChild(message), 3000)
}
```

The showMessage function takes 2 parameters, the first is the HTML of the message text and the second states whether the message is ‘persistent’ or an ‘alert’. The function first clears any persistent messages, then appends the new message - with a timeout of 3 seconds if the message is an ‘alert’. I subsequently added some controls to add classes for specific messages so that they could be styled differently.

**Polishing the user experience**

With the game mostly complete, I added a series of tweaks to improve the look and feel, specifically:

* Replacing the background colours with background images, giving the blocks a 3D look
* Adding sound effects to game events
* Changing all the cells to grey blocks at game over
* Adding keyframe animations to the messages
* Adding a coloured gradient to the bottom of the background, which changes colour when the player levels up
* Creating an overlaid menu which explains the controls and enables the user to toggle audio

**‘Wall kicks’**

The final feature I added to the game was what the official Tetris guideline refers to as ‘wall kicks’. These are a series of alternate positions that a piece can move to when attempting to rotate in a tight space. I implemented this as a series of additional tests that run if a rotation test fails. Essentially, if a piece cannot rotate in its current position, tests will also run on one space to the right or left, one space up and right and one space down and left. These tests do not apply to the square ‘O’ pieces, and slightly different tests apply to the long ‘I’ piece.

## Challenges

**Piece Placement and Rotation**

The conception of the pieces as classes and implementation of the rotation were very challenging at the beginning of the project. I had a clear idea from the outset of the idea of using an anchor cell, and I initially specified this cell in the class using offsets to specify the indices of the other cells. However, as soon as the object was created, these offsets ceased to be dynamic. I also initially envisioned the translate and rotate functions to be methods of the classes, as I thought that they would need to hold the information relevant to each piece’s movement. To help me to arrive at the final solution, I initially hard coded the T-piece’s 4 positions and observed how they changed as they moved around the grid. This helped me to realise that the piece’s ‘home’ rotation was no more significant than any of its other rotations and that the cells’ offset to the anchor point were the most useful way to maintain the correct formation of the piece as it translated and rotated. I also realised that I did not need to hold the anchor point as a separate variable, as if I kept it at the same index for every shape I could always access it through that shape’s relative position array - and that mapping that array to the DOM nodes with the same index would always enable me to access the correct cell in the grid.

**Complete Line Deletion and Movement Downwards**

My biggest challenge during this project was a bug I encountered with the line detection and removal functions. When testing the game, although most lines were being removed correctly, in certain cases some lines would not delete. This only happened when multiple lines were completed, and with only certain shapes in certain rotations. It took a long time to ascertain the exact circumstances which reproduced the bug and to work out the cause. I used the console to check the values of relevant variables at the times that the bug presented and had to temporarily remove the ‘falling’ function and random piece selection functions so that I could more easily select and move the pieces to check the function’s behaviour in different circumstances.

I eventually arrived at the solution while I was away from the computer, working through the requirements for the algorithm to be successful in my head. I realised that the logic of the function was sound, but relied on the lines being processed from top to bottom. Because my formulation for the pieces started in the central anchor position then clockwise from that point, the rows were being added to the array in the same order. This meant that in certain cases, the lines were not being processed top to bottom. A single line of code which sorted the completed lines array into numerical order fixed this bug - meaning that the line deletion and movement of the other locked cells into the empty space now worked consistently correctly. 

## Wins

**Messaging**

I am very pleased with the implementation of the messaging as it feels quite dynamic and fluid while playing. The formulation of the function made this very easy to plug into different trigger points in the gameplay, and the fact that it is able to handle multiple messages that can be triggered quite close to each other or at the same time was something I was not sure how to achieve at the outset. The animation of the messages adds to the look and feel of the game, adding a bit of polish to the interface, with the more fluid motion providing a counterpoint to the blockier movement of the game.

## Key Learnings/Takeaways

**Arrays**

Throughout this project I have become very confident with using and manipulating arrays and have gained a greater understanding of the wide variety of uses that they can have. To begin with, it was very difficult to conceive of a piece as an array of indices, within another array - and especially how to use mathematical operations to determine legal moves. Using combinations of for, for…of and while loops, as well as iterative methods such as .map and .filter have been at the heart of the core functionality of this game and it has been very satisfying to see how powerful they are in terms of performing the functions necessary to make the game work.

**Planning Functions**

I have learnt to break down functions into key components, using comments to help me to keep track of what I am doing and what I need the return of the function to be. The best examples of this process were the completeLine and removeComplete functions, which are probably the most complex functions in the game. Thinking through what needed to happen, and in which order, enabled me to work through each step and find the most effective ways to achieve them. This structured process also helped me to find the solution to the line deleting bug - when I realised that a crucial step was missing in order for the functions to work properly.

**Overall Structure**

Having not created a project this complex before, I learnt a lot about how to structure a project - grouping key types of statements together such as DOM elements, variables, functions and events. I also found it very useful thinking about testing functions, game state functions and rendering functions separately as they enabled me to think more clearly about the purposes of specific functions and test that they were working as intended.

## Bugs

The levelling up and game over functions are not completely working as intended. Sometimes at Game Over the interval is not cleared and pieces continue to fall. The speed of the pieces falling is not reset at game over, and is not increasing during the game. I think that this is due to the timing of the interval being cleared.

**Future Improvements**

* Refine the wall kick system to be more specific to the rotation of the piece and more predictable in tight spaces
* Add a ‘lock timer’ that enables the player to keep moving the piece to prevent it from locking - making play at faster speeds possible
* Refine the difficulty curve - how quickly the speed increases and by which increments
* More animation, including an animation for removing lines - I began implementing this on the final day of the project, but it caused a bug where the ghost piece cells would remain in their original position.
* Add more options - such as turning the ghost piece on or off, setting the difficulty level
