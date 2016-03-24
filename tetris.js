var gameSpeed = 1000;       // defines the time that is waited until the next tick happens
var gameFinished = false;

function init(){
    "use strict";
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

    var timingHandler;


    function construct() {
        nextStoneType = gameContext.randomStone();
        timingHandler = new TimingHandler();

        $(document).keydown(function(e) {

            if(e.which == 'r'){
                gameFinished = false;
            }
            if(gameFinished){
                e.preventDefault();
                return;
            }
            switch(e.which) {
                case 37: left();  break;
                case 39: right(); break;
                case 40: down();  break;
                case 67: rotateLeft(); break;   // c
                case 38:                        // up
                case 86:
                case 32: rotateRight(); break;  // v, space
                default: return;
            }
            e.preventDefault();
            //board.printBoard();
            //board.checkBoardForRowsToDelete();
        });
        console.log("consruct*******************************");
        previewContext.placeStone({x: 0, y: 0}, nextStoneType);
        nextStone();

        preview.update();
        board.update();

        scheduler();
    }


    function scheduler() {
        console.log("tick");
        timingHandler.setTimeout(gameSpeed, scheduler);
        down();
    }







    function nextStone() {
        console.log("Next stone!");
        previewContext.removeStone({x: 0, y: 0}, nextStoneType);

        currentStone = nextStoneType;
        nextStoneType = gameContext.randomStone();

        previewContext.placeStone({x: 0, y: 0}, nextStoneType);
        preview.update();

        stonePos = {x: 3, y: 0};
        if(!gameContext.canPlaceStone(stonePos, currentStone)) {
            gameContext.placeStone(stonePos, currentStone);

            console.log("Game Over");
            timingHandler.clearTimeout();
            gameFinished = true;
            return false;
        }
        gameContext.placeStone(stonePos, currentStone);
        board.update();
        return true;
    }



    function down() {
        var dir = {x: 0, y: 1};
        if(!gameContext.canMoveStone(stonePos, currentStone, dir)) {
            handleFullRows(function(){
                nextStone();
            });
            return;
        }
        stonePos = gameContext.moveStone(stonePos, currentStone, dir);
        board.update();
        // board.printBoard();

        timingHandler.restartTimeout();
    }

    function handleFullRows(cb_func) {
        var fullRows = board.getRowsForDeletion();
        console.log("Full rows: ", fullRows);
        //TODO: calculate score and line count here; also increase speed depending on score
        if(fullRows.length == 0){
            cb_func();
            return;
        }
        timingHandler.clearTimeout();
        toggleFullRows(fullRows, 6, function(){
            board.deleteRows(fullRows);
            timingHandler.restartTimeout();
            cb_func();
        });
    }

    function toggleFullRows(fullRows, toggleCount, cb_func) {
        var timing = 75;

        board.toggleRows(fullRows, 1);
        board.update();
        setTimeout(function(){
            board.toggleRows(fullRows, 0);
            board.update();

            setTimeout(function(){
                --toggleCount;
                if(toggleCount == 0) {
                    cb_func();
                } else {
                    toggleFullRows(fullRows, toggleCount, cb_func);
                }
            }, timing)
        }, timing)
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

function TimingHandler() {
    "use strict";
    var self = this;
    var timeout = null;
    var timeoutInMillis = 0;
    var timeoutFunction = null;

    self.setTimeout = function(_timeoutInMillis, _func) {
        if(timeout !== null) {
            self.clearTimeout();
        }
        timeoutInMillis = _timeoutInMillis;
        timeoutFunction = _func;
        timeout = setTimeout(timeoutFunction, timeoutInMillis);
    }

    self.increaseTimeoutOnce = function(_timeoutInMillis) {
        self.clearTimeout();
        self.setTimeout(_timeoutInMillis, timeoutFunction);
    }

    self.restartTimeout = function() {
        if(timeoutInMillis === 0 || timeoutFunction === null){
            console.error("Unable to restart non-existing timeout");
        }
        self.clearTimeout();
        self.setTimeout(timeoutInMillis, timeoutFunction);
    }

    self.clearTimeout = function() {
        clearTimeout(timeout);
        timeout = null;
    }
}


// function Template(_canvas) {
//     "use strict";
//     var self = this;
//     var canvas = _canvas

//     function construct() {
//     }

//     construct();
// }