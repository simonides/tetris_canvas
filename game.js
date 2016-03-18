
function CanvasHolder(){
        "use strict";
        var self = this;
        var sizeX = 1000;
        var sizeY = 2000;

        var canvas;

        function construct() {
            window.onresize = function()  { resizeCanvas(); }
            canvas = new fabric.StaticCanvas('canvas');
            resizeCanvas();         //resize the canvas-Element
            window.c = canvas;

            new TetrisBoard(canvas, {x: 10, y: 20});
        }

        function resizeCanvas() {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;

            var cv = document.getElementsByTagName("canvas")[0];
            //var cc = document.getElementsByClassName("canvas-container")[0];      //In case of non-Static Canvas will be used
            var cc = document.getElementById("canvasWrapper");

            var cx,cy;                  //The size of the canvas-Element
            var cleft=0;                //Offset to the left border (to center the canvas-element, if there are borders on the left&right)
            if(x/y > sizeX/sizeY){      //x-diff > y-diff   ==> black borders left&right
                cx = (y*sizeX/sizeY);
                cy = y;
                cleft = (x-cx)/2;
            }else{                      //y-diff > x-diff   ==> black borders top&bottom
                cx = x;
                cy = (x*sizeY/sizeX);
            }
            cc.setAttribute("style", "width:"+x+"px;height:"+y+"px;");                                          //canvas-content = fullscreen
            cv.setAttribute("style", "width:"+cx+"px;height:"+cy+"px;position: relative; left:"+cleft+"px");    //canvas: 16:9, as big as possible, horizintally centered
        }

        construct();
}


function TetrisBoard(_canvas, boardSize) {
    "use strict";
    var self = this;
    var canvas = _canvas
    var board;

    function construct() {
        initEmptyBoard();
    }

    function initEmptyBoard() {
        var rainbow    = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666"];
        var getRandomInt = fabric.util.getRandomInt;
        var rainbowEnd = rainbow.length - 1;


        var fieldSize = {
            x: canvas.width / boardSize.x,
            y: canvas.height / boardSize.y,
        }
        board = [];
        for(var y = 0; y<boardSize.y; ++y) {
            board[y] = [];
            for(var x = 0; x<boardSize.x; ++x) {
                board[y][x] = new fabric.Rect(
                  { left:   x * fieldSize.x,
                    top:    y * fieldSize.y,
                    width:  fieldSize.x,
                    height: fieldSize.y,
                    fill:   rainbow[getRandomInt(0, rainbowEnd)]
                })
                canvas.add(board[y][x]);
            }
        }
    }

    construct();
}


// function test(canvas) {
    

//     fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
//     fabric.Object.prototype.transparentCorners = false;

//     for(var i=0; i<100;++i) {
//         getRandomInt = fabric.util.getRandomInt,
//             rainbow    = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666"],
//             rainbowEnd = rainbow.length - 1;

//             dot = new fabric.Circle({
//               left:   getRandomInt(0, 1000),
//               top:    getRandomInt(0, 2000),
//               radius: 10,
//               fill:   rainbow[getRandomInt(0, rainbowEnd)]
//             });
//             canvas.add(dot);


//             canvas.add(
//                new fabric.Rect({ top: 100, left: 100, width: 50, height: 50, fill: '#f55' }),
//                new fabric.Circle({ top: 140, left: 230, radius: 75, fill: 'green' }),
//                new fabric.Triangle({ top: 300, left: 210, width: 100, height: 100, fill: 'blue' })
//              );

//             //canvas.renderAll();
//     }
// }








function Template(_canvas) {
    "use strict";
    var self = this;
    var canvas = _canvas

    function construct() {
    }

    construct();
}