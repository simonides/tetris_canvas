
function TetrisContext(_board) {
    "use strict";
    var self = this;
    var board = _board

    var stones = [
        "    "+
        " XX "+
        " XX "+
        "    ",
        
        " X  "+
        " X  "+
        "XX  "+
        "    ",
                
        "  X "+
        "  X "+
        "  XX"+
        "    ",
        
        "  X "+
        " XX "+
        " X  "+
        "    ",
        
        " X  "+
        " XX "+
        "  X "+
        "    ",
        
        " X  "+
        "XX  "+
        " X  "+
        "    ",
        
        " X  "+
        " X  "+
        " X  "+
        " X  "
    ];

    function construct() {
        addRotatedBlocks();
    }

    function addRotatedBlocks() {
        var stoneCount = stones.length;
        var stoneOffset = 0;
        for(var o = 0; o<3; ++o) {
            for(var i=0; i<stoneCount; ++i) {
                var newStone = rotatedStoneString(stones[i + stoneOffset]);
                if(i%7 != 0 && i%7 != 6) {                    
                    while(newStone.lastIndexOf("    ", 0) === 0) {
                        newStone = newStone.substring(4, 16) + "    ";
                    }   
                }
                stones.push(newStone);
            }
            stoneOffset += stoneCount;
        }
    }

    function rotatedStoneString(stoneString) {
        var newStone = "";
        for(var x = 0; x<4; ++x) {
            for(var y = 3; y>=0; --y) {
                newStone = newStone + stoneString[y*4+x];
            }
        }  

        var empty = 0;
        for(var y = 0; y<4; ++y) {
            if(newStone[y*4 + 1] == ' ') {
                ++empty;
            }
        }
        if(empty == 4) {
            var nStone = "";
            for(var y = 0; y<4; ++y) {
                nStone += " " + newStone[y*4 + 2] + newStone[y*4 + 3] + " ";
            }
            newStone = nStone;
        }
        return newStone;
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
    }

    self.rotateStone = function(position, stoneIdx, rotateRight) {
        var newStoneIndex = rotatedStoneIndex(stoneIdx);
        removeStone(position, stoneIdx);
        placeStone(add(position, vector), newStoneIndex)
        return newStoneIndex;
    }

    function rotatedStoneIndex(stoneIdx, rotateRight) {
        var rotatedStoneIdx = stoneIdx + (rotateRight ? 7 : -7);
        rotatedStoneIdx %= 7;
        if(rotatedStoneIdx < 0) {
            rotatedStoneIdx += 7;
        }
        return rotatedStoneIdx;
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
        self.removeStone(position, stoneIdx);
        var possible = canPlaceStone(add(position, vector), stoneIdx);
        self.placeStone(position, stoneIdx);
        return possible;
    }

    self.canRotateStone = function(position, stoneIdx, rotateRight) {
        self.removeStone(position, stoneIdx);
        var nextStone = rotatedStoneIndex(stoneIdx);
        var possible = canPlaceStone(position, nextStone);        
        self.placeStone(position, stoneIdx);
        return possible;        
    }

    construct();
}

function add(pos1, pos2) {
    return {
        x: pos1.x + pos2.x,
        y: pos1.y + pos2.y,        
    };
}

