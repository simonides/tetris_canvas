
function TetrisContext(_board) {
    "use strict";
    var self = this;
    var board = _board

    var stones = [
        "    "+
        "    "+
        " XX "+
        " XX ",
        
        "    "+
        "  X "+
        "  X "+
        " xX ",
        
        "    "+
        " X  "+
        " X  "+
        " XX ",
        
        "    "+
        "  X "+
        " XX "+
        " X  ",
        
        "    "+
        " X  "+
        " XX "+
        "  X ",
        
        "  X "+
        "  X "+
        "  X "+
        "  X "
    ];

    function construct() {
        addRotatedBlocks();
        addRotatedBlocks();
        console.log("Number of available stones: ", stones.length);
    }

    function addRotatedBlocks() {
        var stoneCount = stones.length;
        for(var i=0; i<stoneCount; ++i) {
            var newStone = "";
                for(var x = 0; x<4; ++x) {
            for(var y = 0; y<4; ++y) {
                    if(isStoneSolid(i, x, y)){
                        newStone = newStone + 'X';
                    } else {
                         newStone = newStone + ' ';
                    }
                }
            }
            stones.push(newStone);
        }
    }





    self.randomStone = function() {
        return Math.floor(Math.random() * stones.length);
    }

    function isStoneSolid(stoneIdx, x, y) {
        return (stones[stoneIdx][y*4+x] != ' ');
    }

    self.placeStone = function(position, stoneIdx) {
        for(var y = 0; y<4; ++y) {
            for(var x = 0; x<4; ++x) {
                if(isStoneSolid(stoneIdx, x, y)) {
                    var boardPos = {
                        'x': x+position.x,
                        'y': y+position.y
                    };
                    board.setField(boardPos, stoneIdx);
                }
            }
        }
    }

    function removeStone(position, stoneIdx) {
        placeStone(position, stoneIdx, ' ');
    }

    self.moveStone = function(position, stoneIdx, vector) {
        removeStone(position, stoneIdx);
        placeStone(add(position, vector), stoneIdx)
        board.update();
    }

    self.canPlaceStone = function(position, stoneIdx) {
        for(var y = 0; y<4; ++y) {
            for(var x = 0; x<4; ++x) {
                if(isStoneSolid(stoneIdx, x, y)) {
                    var boardPos = {
                        'x': x+position.x,
                        'y': y+position.y
                    };
                    if(!board.isValidPos(boardPos)){
                        return false;
                    }
                    if(board.getField(boardPos) != ' ') {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    self.canMoveStone = function(position, stoneIdx, vector) {
        alert("Not implemented yet");
       //return canPlaceStone(add(position, vector), stoneIdx);
    }

    construct();
}

function add(pos1, pos2) {
    return {
        x: pos1.x + pos2.x,
        y: pos1.y + pos2.y,        
    };
}

