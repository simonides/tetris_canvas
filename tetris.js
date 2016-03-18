
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

    var nextStone;
    var currentStone;

    function construct() {
        nextStone = gameContext.randomStone();
        currentStone = gameContext.randomStone();

        previewContext.placeStone({x: 0, y: 0}, nextStone);
        gameContext.placeStone({x: 3, y: 0}, currentStone);

        preview.update();
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