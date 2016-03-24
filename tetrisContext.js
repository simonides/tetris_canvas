
function TetrisContext(_board) {
    "use strict";
    var self = this;
    var board = _board

    var stones = [
        // 0 Degrees
        " X  "+
        " X  "+
        " X  "+
        " X  ",
        
        "    "+
        " XX "+
        " XX "+
        "    ",
                
        "XX  "+
        " X  "+
        " X  "+
        "    ",
        
        " XX "+
        " X  "+
        " X  "+
        "    ",
        
        " X  "+
        "XXX "+
        "    "+
        "    ",
        
        " X  "+
        "XX  "+
        "X   "+
        "    ",
        
        "X   "+
        "XX  "+
        " X  "+
        "    ",

        // 90 Degrees
        "    "+
        "XXXX"+
        "    "+
        "    ",

        "    "+
        " XX "+
        " XX "+
        "    ",

        "  X "+
        "XXX "+
        "    "+
        "    ",

        "    "+
        "XXX "+
        "  X "+
        "    ",

        " X  "+
        " XX "+
        " X  "+
        "    ",

        "XX  "+
        " XX "+
        "    "+
        "    ",

        " XX "+
        "XX  "+
        "    "+
        "    ",

        // 180 Degrees
        "  X "+
        "  X "+
        "  X "+
        "  X ",

        "    "+
        " XX "+
        " XX "+
        "    ",

        " X  "+
        " X  "+
        " XX "+
        "    ",

        " X  "+
        " X  "+
        "XX  "+
        "    ",

        "    "+
        "XXX "+
        " X  "+
        "    ",

        "  X "+
        " XX "+
        " X  "+
        "    ",

        " X  "+
        " XX "+
        "  X "+
        "    ",

        // 270 Degrees
        "    "+
        "    "+
        "XXXX"+
        "    ",

        "    "+
        " XX "+
        " XX "+
        "    ",

        "    "+
        "XXX "+
        "X   "+
        "    ",

        "X   "+
        "XXX "+
        "    "+
        "    ",

        " X  "+
        "XX  "+
        " X  "+
        "    ",

        "    "+
        "XX  "+
        " XX "+
        "    ",

        "    "+
        " XX "+
        "XX  "+
        "    "
    ];

    function construct() {
    }


    self.randomStone = function() {
        return 1;
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

    self.removeStone = function(position, stoneIdx) {
        for(var y = 0; y<4; ++y) {
            for(var x = 0; x<4; ++x) {
                if(isStoneSolid(stoneIdx, x, y)) {
                    var boardPos = {
                        'x': x+position.x,
                        'y': y+position.y
                    };
                    board.setField(boardPos, ' ');
                }
            }
        }
    }

    self.moveStone = function(position, stoneIdx, vector) {
        self.removeStone(position, stoneIdx);
        var newPos = add(position, vector);
        self.placeStone(newPos, stoneIdx)
        return newPos;
    }

    self.rotateStone = function(position, stoneIdx, rotateRight) {
        var newStoneIndex = rotatedStoneIndex(stoneIdx, rotateRight);
        self.removeStone(position, stoneIdx);
        self.placeStone(position, newStoneIndex)
        return newStoneIndex;
    }

    function rotatedStoneIndex(stoneIdx, rotateRight) {
        var rotatedStoneIdx = stoneIdx + (rotateRight ? 7 : -7);
        rotatedStoneIdx %= 28;
        if(rotatedStoneIdx < 0) {
            rotatedStoneIdx += 28;
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
        var possible = self.canPlaceStone(add(position, vector), stoneIdx);
        self.placeStone(position, stoneIdx);
        return possible;
    }

    self.canRotateStone = function(position, stoneIdx, rotateRight) {
        self.removeStone(position, stoneIdx);
        var nextStone = rotatedStoneIndex(stoneIdx,rotateRight);
        var possible = self.canPlaceStone(position, nextStone);        
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

