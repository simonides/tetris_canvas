
function init(){    
    var canvasHolder = new CanvasHolder();
    var board = canvasHolder.getBoard();
    var gameContext = new GameContext(board);
    var tetris = new Tetris(board, gameContext);
}


function Tetris(_board, _gameContext) {
    "use strict";
    var self = this;
    var board = _board
    var gameContext = _gameContext

    function construct() {
        gameContext.placeStone({x: 2, y: 3}, gameContext.randomStone());
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