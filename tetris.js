var gameSpeed = 1000;       // defines the time that is waited until the next tick happens
var gameSpeedMax = gameSpeed;
var gameSpeedMin = 250;
var rowsToPassLevel = 10;
var decreaseTimeout = 70;
var gameFinished = false;
var endscreen = null;
var gameScore = 0;
var restartBtn;
var level = 0;


$( document ).ready(function() {
    endscreen = $('#endScreen_div');
    restartBtn = $('#restartBtn');
    restartBtn.click(function () {
        //console.log("restart game from button");
        restartGame();
    });

    endscreen.hide();



});

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

    var allowUserInput = true;

    function construct() {
        nextStoneType = gameContext.randomStone();
        timingHandler = new TimingHandler();

        $(document).keydown(function(e) {

            if(e.which == 82){ // button r restart the game
                //console.log("restart the game..");
                restartGame();
            }
            if(!allowUserInput) {
                return;
            }
            if(gameFinished){
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
        //console.log("consruct*******************************");
        previewContext.placeStone({x: 0, y: 0}, nextStoneType);
        nextStone();

        preview.update();
        board.update();

        timingHandler.setNewTimeout(gameSpeed);
        timingHandler.setTimeout(scheduler);
        setScore(0);
        setLevel();
    }


    function scheduler() {
        //console.log("tick");
        timingHandler.setTimeout(scheduler);
        down();
    }




    window.restartGame = function restartGame() {
        gameFinished = false;
        setScore(0);
        setLevel();

        board.resetBoard();
        board.update();

        timingHandler.setNewTimeout(gameSpeed);
        timingHandler.setTimeout(scheduler);
        hideEndScreen();

    }


    function nextStone() {
        //console.log("Next stone!");
        previewContext.removeStone({x: 0, y: 0}, nextStoneType);

        currentStone = nextStoneType;
        nextStoneType = gameContext.randomStone();

        previewContext.placeStone({x: 0, y: 0}, nextStoneType);
        preview.update();

        stonePos = {x: 3, y: 0};
        if(!gameContext.canPlaceStone(stonePos, currentStone)) {
            gameContext.placeStone(stonePos, currentStone);

            //console.log("Game Over");
            timingHandler.clearTimeout();
            gameFinished = true;
            showEndscreen();
            return false;
        }
        gameContext.placeStone(stonePos, currentStone);
        board.update();
        return true;
    }

    function showEndscreen() {
        endscreen.show();
    }
    function hideEndScreen() {
        endscreen.hide();
    }


    function setScore(score) {
        gameScore = score;
        $("#score").text("Score: "+ gameScore);
    }

    function setLevel() {

        level = Math.floor((gameScore / rowsToPassLevel)) + 1;
        $("#level").text("Level: "+ level);
    }

    function down() {
        var dir = {x: 0, y: 1};
        if(!gameContext.canMoveStone(stonePos, currentStone, dir)) {
            allowUserInput = false;
            handleFullRows(function(){
                nextStone();
                allowUserInput = true;
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
        //console.log("Full rows: ", fullRows);
        setScore(gameScore + fullRows.length);
        setLevel();
        if(fullRows.length == 0){
            var speed = gameSpeed - (decreaseTimeout* (level-1));
            speed = clamp(speed, gameSpeedMin, gameSpeedMax);
            //console.log("speed: " + speed);
            timingHandler.setNewTimeout(speed);
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
    var timeoutInMillis = 1000;
    var timeoutFunction = null;

    self.setTimeout = function(_func) {
        if(timeout !== null) {
            self.clearTimeout();
        }
        timeoutFunction = _func;
        //console.log("timeout: " + timeoutInMillis);
        timeout = setTimeout(timeoutFunction, timeoutInMillis);
    }

    self.setNewTimeout = function(_timeoutInMillis) {
        timeoutInMillis = _timeoutInMillis;
        self.clearTimeout();
        self.setTimeout(timeoutFunction);
    }

    self.restartTimeout = function() {
        if(timeoutInMillis === 0 || timeoutFunction === null){
            console.error("Unable to restart non-existing timeout");
        }
        self.clearTimeout();
        self.setTimeout(timeoutFunction);
    }

    self.clearTimeout = function() {
        clearTimeout(timeout);
        timeout = null;
    }
}

function clamp( val,  min,  max) {
    return Math.max(min, Math.min(max, val));
}

// function Template(_canvas) {
//     "use strict";
//     var self = this;
//     var canvas = _canvas

//     function construct() {
//     }

//     construct();
// }
