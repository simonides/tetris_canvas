
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
                          { left:   x * fieldSize.x +2,
                            top:    y * fieldSize.y +2,
                            width:  fieldSize.x -4,
                            height: fieldSize.y -4,
                            fill:   color
                        })
                }
                canvas.add(board[y][x].rect);
            }
        }

        window.b = self;
    }

    function getColor(field) {
        if(field === " ") {
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

    self.setFieldWithColor = function (pos, field, color) {
        board[pos.y][pos.x].field = field;
        board[pos.y][pos.x].rect.set('fill', color);
    }

    self.setField = function(pos, field) {
        // console.log("field: " + field);
        board[pos.y][pos.x].field = field;
        board[pos.y][pos.x].rect.set('fill', getColor(field));
    }

    self.update = function() {
        canvas.renderAll();     //Note: internally, the library manages all changes. If there aren't many, it only makes partial redraws.
    }

   /* self.checkBoardForRowsToDelete = function () {
        for (var row = 0; row < boardSize.y; ++row ){
            if(self.checkRow(row)){
                console.log("remove line: " + row);
                self.deleteRow(row, 150, true, this);
            }
        }
    }*/

    self.resetBoard = function () {
        var boardPos = {
            'x': 0,
            'y': 0
        };
        for(var row = 0 ; row < boardSize.y ; ++row){
            boardPos.y = row;
            for (var col = 0; col < boardSize.x; ++col){
                boardPos.x = col;
                self.setField( boardPos,' ');
            }
        }
    }

    self.getRowsForDeletion = function () {
        var fullRows = [];
        for (var row = 0; row < boardSize.y; ++row ){
            if(isRowFull(row)){
                fullRows.push(row)
            }
        }
        return fullRows;
    }

    // check if a row should be deleted
    function isRowFull(row) {
        var clearLine = true;
        for (var x = 0; x < boardSize.x; ++x) {
            if (board[row][x].field === ' ') {
                clearLine = false;
                break;
            }
        }
        return clearLine;
    }

    self.toggleRows = function (rows, colorTypeEmpty) {
        for(var i=0; i<rows.length; ++i) {
            toggleSingleRow(rows[i], colorTypeEmpty);
        }
    }

    function toggleSingleRow(row, colorTypeEmpty) {
        var boardPos = {
            'x': 0,
            'y': row
        };

        var color = colorTypeEmpty ? "#000" : "#090";
        for (var x = 0; x < boardSize.x; ++x) {
            boardPos.x = x;
            self.setFieldWithColor(boardPos, 0, color);
        }
    }

    self.deleteRows = function (rows) {
        // console.log("=== BEFORE ==============================================");
        // self.printBoard();
        rows.sort();
        for(var i=0; i<rows.length; ++i) {
            deleteSingleRow(rows[i]);
        }
        // console.log("=== AFTER ==============================================");
        // self.printBoard();
    }

    function deleteSingleRow(row) {
        for(var currentRow = row; currentRow > 0 ; --currentRow){
            moveRowDown(currentRow);
        }
    }

    function moveRowDown(row){
        var oldBoardPos = {'x': 0, 'y': row-1};
        var newBoardPos = {'x': 0, 'y': row};

        for (var x = 0; x < boardSize.x; ++x) {
            var fieldType = board[row - 1][x].field;
            oldBoardPos.x = x;
            newBoardPos.x = x;

            self.setField(oldBoardPos, ' ');
            self.setField(newBoardPos, fieldType);
        }
    }

    self.printBoard = function () {
        for(var y = 0; y < boardSize.y; ++y) {
            var line = y + ( y < 10 ? '  #' : ' #');

            for (var x = 0; x < boardSize.x; ++x) {
                if(board[y][x].field === ' '){
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


