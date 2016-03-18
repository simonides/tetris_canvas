var sizeX = 1920;
var sizeY = 1080;

function init(){    
    resizeCanvas();         //resize the canvas-Element
    window.onresize = function()  { resizeCanvas(); }
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






function GameRunner(_context){
    "use strict";
    var self = this;
    var context = _context;
    

    function construct() {
    }


    construct();
}


