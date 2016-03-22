
function CanvasHolder(canvasId, size, autoResize){
    "use strict";
    var self = this;
    var logicalSize = size;
    var coordSize = {
        x: size.x * 100,
        y: size.y * 100,        
    }

    var canvas;
    var board;

    function construct() {
        if(autoResize) {
            window.onresize = function()  { resizeCanvas(); }
        }
        canvas = new fabric.StaticCanvas(canvasId);
        if(autoResize) {
            resizeCanvas();         //resize the canvas-Element
        }
        board = new TetrisBoard(canvas, logicalSize);
        window.c = canvas;
    }

    function resizeCanvas() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        var cv = document.getElementById(canvasId);
        //var cc = document.getElementsByClassName("canvas-container")[0];      //In case of non-Static Canvas will be used
        var cc = document.getElementById("canvasWrapper");

        var cx,cy;                  //The size of the canvas-Element
        var cleft=0;                //Offset to the left border (to center the canvas-element, if there are borders on the left&right)
        if(x/y > coordSize.x/coordSize.y){      //x-diff > y-diff   ==> black borders left&right
            cx = (y*coordSize.x/coordSize.y);
            cy = y;
            cleft = (x-cx)/2;
        }else{                      //y-diff > x-diff   ==> black borders top&bottom
            cx = x;
            cy = (x*coordSize.y/coordSize.x);
        }
        cc.setAttribute("style", "width:"+x+"px;height:"+y+"px;");                                          //canvas-content = fullscreen
        cv.setAttribute("style", "width:"+cx+"px;height:"+cy+"px;position: relative; left:"+cleft+"px");    //canvas: 16:9, as big as possible, horizintally centered
    }

    self.getBoard = function() {
        return board;
    }

    construct();
}


function TetrisBoard(_canvas, boardSize) {
    "use strict";
    var self = this;
    var canvas = _canvas
    var size = boardSize;
    var board;

    function construct() {
        initEmptyBoard();
    }

    function initEmptyBoard() {
        var defaultField = " ";
        var color = getColor(defaultField);

        var fieldSize = {
            x: canvas.width / boardSize.x,
            y: canvas.height / boardSize.y,
        }
        board = [];
        for(var y = 0; y<boardSize.y; ++y) {
            board[y] = [];
            for(var x = 0; x<boardSize.x; ++x) {
                board[y][x] = {
                    field: defaultField,
                    rect: new fabric.Rect(
                          { left:   x * fieldSize.x,
                            top:    y * fieldSize.y,
                            width:  fieldSize.x,
                            height: fieldSize.y,
                            fill:   color
                        })
                }
                canvas.add(board[y][x].rect);
            }
        }

        window.b = self;
    }

    function getColor(field) {
        if(field == " ") {
            return "#000";
        }
        switch(field % 7) {
            case 0:   return "#f00"; 
            case 1:   return "#0f0"; 
            case 2:   return "#00f"; 
            case 3:   return "#ff0"; 
            case 4:   return "#f0f"; 
            case 5:   return "#f70";
            case 6:   return "#0f7";
            default:
            console.log("Error: unknown field ", field%7);
            return "#fff";
        }
    }

    self.getSize = function() {
        return size;
    }

    self.isValidPos = function(pos) {
        if(pos.x < 0 || pos.y < 0){
            return false;
        }
         if(pos.x >= size.x || pos.y >= size.y){
            return false;
        }
        return true;
    }

    self.getField = function(pos) {
        return board[pos.y][pos.x].field;
    }

    self.setField = function(pos, field) {
        board[pos.y][pos.x].field = field;
        board[pos.y][pos.x].rect.set('fill', getColor(field));
    }

    self.update = function() {
        canvas.renderAll();     //Note: internally, the library manages all changes. If there aren't many, it only makes partial redraws.
    }

    self.checkBoardForRowsToDelete = function () {
        for (var row = 0; row < boardSize.y; ++row ){
            if(self.checkRow(row)){
                console.log("remove line: " + row);
                self.deleteRow(row);
            }
        }
    }

    // check if a row should be deleted
    self.checkRow = function (row) {
        var clearLine = true;
        for (var x = 0; x < boardSize.x; ++x) {
            if (board[row][x].field == ' ') {
                clearLine = false;
                break;
            }
        }
        return clearLine;
    }

    self.deleteRow = function (row) {
        //TODO

    }


    self.printBoard = function () {
        console.log("Board:");
        for(var y = 0; y < boardSize.y; ++y) {


            var line = y + ( y < 10 ? '  #' : ' #');


            for (var x = 0; x < boardSize.x; ++x) {
                if(board[y][x].field == ' '){
                    line += ' ';
                }else{
                    line += 'X';
                }
            }
            line += '#';
            console.log(line);
        }
    }



    construct();
}

