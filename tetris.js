
function init(){    
    var canvasHolder = new CanvasHolder('canvas', {x: 10, y: 20}, true);
    var previewHolder = new CanvasHolder('previewCanvas', {x: 4, y: 4}, false);

    var board = canvasHolder.getBoard();
    var preview = previewHolder.getBoard();

    var gameContext = new TetrisContext(board);
    var previewContext = new TetrisContext(preview)

    var tetris = new Tetris(board, preview, gameContext, previewContext);

}


function Tetris(_board, _preview, _gameContext, _previewContext) {
    "use strict";
    var self = this;
    var board = _board;
    var preview = _preview;
    var gameContext = _gameContext;
    var previewContext = _previewContext;

    var nextStoneType;
    var currentStone;
    var stonePos;

    function construct() {
        nextStoneType = gameContext.randomStone();
       
        $(document).keydown(function(e) {


            switch(e.which) {
                case 37: left();  break;
                //case 38: up();    break;
                case 39: right(); break;
                case 40: down();  break;
                case 67: rotateLeft(); break;   // c
                case 86:
                case 32: rotateRight(); break;  // v, space
                default: return;
            }
            e.preventDefault();
            board.printBoard();

        });

        previewContext.placeStone({x: 0, y: 0}, nextStoneType);
        nextStone();

        preview.update();
        board.update();
    }

    function nextStone() {
        previewContext.removeStone({x: 0, y: 0}, nextStoneType);
        
        currentStone = nextStoneType;
        nextStoneType = gameContext.randomStone();
       
        previewContext.placeStone({x: 0, y: 0}, nextStoneType);
        preview.update();

        stonePos = {x: 3, y: 0};
        if(!gameContext.canPlaceStone(stonePos, currentStone)) {
            console.log("Game Over");
            return false;
        }
        gameContext.placeStone(stonePos, currentStone);
        return true;
    }

    

    function down() {
        var dir = {x: 0, y: 1};
        if(!gameContext.canMoveStone(stonePos, currentStone, dir)) {
            nextStone();
            return;
        }
        stonePos = gameContext.moveStone(stonePos, currentStone, dir);
        board.update();
    }

    function rotateRight() {
        rotate(true);
    }

    function rotateLeft() {
        rotate(false);
    }

    function rotate(direction) {
        if(!gameContext.canRotateStone(stonePos, currentStone, direction)) {
           return;
        }
        currentStone = gameContext.rotateStone(stonePos, currentStone, direction);
        board.update();
    }

    function left() {
       sideways(-1);
    }

    function right() {
       sideways(1);
    }

    function sideways(side) {
        var dir = {x: side, y: 0};
        if(!gameContext.canMoveStone(stonePos, currentStone, dir)) {
            return;
        }
        stonePos = gameContext.moveStone(stonePos, currentStone, dir);
        board.update();
    }


    construct();
}





// function Template(_canvas) {
//     "use strict";
//     var self = this;
//     var canvas = _canvas

//     function construct() {
//     }

//     construct();
// }