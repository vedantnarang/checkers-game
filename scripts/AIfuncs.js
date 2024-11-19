
//JSON.parse(JSON.stringify(object))
//AI player 1 red
//board object
let INFINITY = 10000;
let NEG_INFINITY = -10000;

const positionValuesPlayer = [
    [0, 6, 0, 6, 0, 6, 0, 6],
    [4, 0, 4, 0, 4, 0, 4, 0],
    [0, 3, 0, 1, 0, 2, 0, 4],
    [4, 0, 2, 0, 1, 0, 3, 0],
    [0, 3, 0, 1, 0, 2, 0, 4],
    [4, 0, 2, 0, 2, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 4],
    [4, 0, 6, 0, 6, 0, 6, 0]
];
const positionValuesAI = [
    [0, 7, 0, 7, 0, 7, 0, 5],
    [7, 0, 3, 0, 3, 0, 3, 0],
    [0, 4, 0, 2, 0, 2, 0, 7],
    [7, 0, 2, 0, 1, 0, 3, 0],
    [0, 3, 0, 1, 0, 2, 0, 7],
    [7, 0, 2, 0, 1, 0, 3, 0],
    [0, 4, 0, 3, 0, 3, 0, 7],
    [4, 0, 4, 0, 5, 0, 5, 0]
];

function AInextMove() {

    //cloning
    var simulated_board = JSON.parse(JSON.stringify(currBoard.board));
    var simulated_kings = JSON.parse(JSON.stringify(currBoard.kingsList));

    var alpha = NEG_INFINITY;
    var beta = INFINITY;
    var available_moves = findMovesAI(simulated_board, simulated_kings, 1);
    console.log(available_moves.length);
    var max_move = null;
    if(available_moves.length > 1){
        var max = alpha_beta(simulated_board, simulated_kings, available_moves, 9, alpha, beta, 1);

    //all moves that have max value
    var best_moves = [];
    var max_move = null;
    for (var i = 0; i < available_moves.length; i++) {
        var next_move = available_moves[i];

        if (next_move.score == max) {
            max_move = next_move;
            best_moves.push(next_move);
        }
    }

    //random selection, if theres more than one move wi the same value
    //console.log("is  " + available_moves.length);

    if (best_moves.length > 1) {
        var index = Math.floor(Math.random() * (best_moves.length - 1));
        max_move = best_moves[index];
    }
   

    }
    else max_move = available_moves[0];
     // console.log("move  " + max_move.score);
    return max_move;
}


function evaluate_position(x, y) {
    if (x == 0 || x == 7 || y == 0 || y == 7) {
        return 5;
    }
    else {
        return 3;
    }
}

// function evaluate(board, kings) { //usign  15F

//     var AI_pieces = 0;
//     var AI_kings = noKings(kings, 1);
//     var player_pieces = 0;
//     var player_kings = noKings(kings, 2);
//     var AI_safe_sum = 0;
//     var player_safe_sum = 0;
//     var eval = 0;
//     var AI_in_danger = 0;
//     var player_in_danger = 0;
//     AIScore = 0;
//     playerScore = 0;

//     for (let row in board) {
//         for (let col in board[row]) {
//             if (board[row][col] == 1) {
//                 AI_pieces++;
//                 AI_safe_sum += evaluate_position(col, row);
//                 AIScore += positionValuesAI[row][col];
//                 //AI_in_danger += in_danger(board, kings, 1, row, col);
//             }
//             else if (board[row][col] == 2) {
//                 player_pieces++;
//                 player_safe_sum += evaluate_position(col, row);
//                 playerScore += positionValuesPlayer[row][col];
//                 //player_in_danger = in_danger(board, kings, 2, row, col);
//             }
//         }
//     }

//     var piece_diff = (AI_pieces - player_pieces);
//     var king_diff = (AI_kings - player_kings);

//     if (player_pieces === 0) {
//         player_pieces = 0.00001;
//     }

//     if (AI_pieces === 0) {
//         AI_pieces = 0.00001;
//     }

//     var avg_safe_diff = (AI_safe_sum / AI_pieces) - (player_safe_sum / player_pieces);
//     //+ (AI_in_danger/AI_pieces)-(player_in_danger/player_pieces)
//     eval = (100 * piece_diff) + (10 * king_diff) + (avg_safe_diff) + 100 * (AIScore - playerScore);

//     console.log("eval  " + eval);
//     return eval;
// }

function evaluate(board, kings) {

    var AI_pieces = 0;
    var AI_kings = noKings(kings, 1);
    var player_pieces = 0;
    var player_kings = noKings(kings, 2);
    var AI_safe_sum = 0;
    var player_safe_sum = 0;
    var eval = 0;
    var AI_in_danger = 0;
    var player_in_danger = 0;
    AIScore = 0;
    playerScore = 0;

    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == 1) {
                AI_pieces++;
                // AI_safe_sum += evaluate_position(col, row);
                // AIScore += positionValuesAI[row][col];
                AI_safe_sum += safeAndMayKill(board, kings, 1, row, col);
                AI_in_danger += inDanger(board, kings, 1, row, col);
            }
            else if (board[row][col] == 2) {
                player_pieces++;
                // player_safe_sum += evaluate_position(col, row);
                // playerScore += positionValuesPlayer[row][col];
                player_safe_sum = safeAndMayKill(board, kings, 2, row, col);
                player_in_danger = inDanger(board, kings, 2, row, col);
            }
        }
    }

    var piece_diff = (AI_pieces - player_pieces);
    var king_diff = (AI_kings - player_kings);
    var avg_safe_diff = ((AI_safe_sum) - (player_safe_sum)) - 3*((AI_in_danger) - (player_in_danger));

    eval = (10 * piece_diff) + (8 * king_diff) + (20 * avg_safe_diff);

    return eval;
}

function alpha_beta(board, kings, moves, depth, alpha, beta, player) {
    //make move
    //board is a list of the piece 0 1 2
    //kings row hold [player, [row,col]]
    if (depth <= 0 || noMoreMoves(board, kings, player)) {
        return evaluate(board, kings);
        //return new_eval(player, board, kings);
    }
    simulated_board = JSON.parse(JSON.stringify(board));
    simulated_kings = JSON.parse(JSON.stringify(kings));
    if (player == 1) {
        var max = NEG_INFINITY;
        for (var i = 0; i < moves.length; i++) {
            //move computer piece
            var AI_move = moves[i];
            makeMoveAI(simulated_board, simulated_kings, AI_move, 1);
            //get available moves for human
            var player_moves = findMovesAI(simulated_board, simulated_kings, 2);
            //get min value for this move
            var min_score = alpha_beta(simulated_board, simulated_kings, player_moves, depth - 1, alpha, beta, 2);
            moves[i].score = min_score;
            //compare to min and update, if necessary
            if (min_score > max) {
                max = min_score;
            }
            if (max >= beta) {
                break;
            }
            if (max > alpha) {
                alpha = max;
            }
        }
        return max;
    }
    else if (player == 2) {
        var min = INFINITY;
        for (var i = 0; i < moves.length; i++) {
            //move human piece
            var player_move = moves[i];
            makeMoveAI(simulated_board, simulated_kings, player_move, 2);

            //get available moves for computer
            var AI_moves = findMovesAI(simulated_board, simulated_kings, 1);

            //get max value for this move
            var max_score = alpha_beta(simulated_board, simulated_kings, AI_moves, depth - 1, alpha, beta, 1);

            //compare to min and update, if necessary
            if (max_score < min) {
                min = max_score;
            }
            moves[i].score = min;
            if (min <= alpha) {
                break;
            }
            if (min < beta) {
                beta = min;
            }
        }
        return min;
    }
}

// function in_danger(board, kings, player, row, col) {
//     let opp = (player == 1 ? 2 : 1);
//     if (row == 0 || row == 7 || col == 0 || col == 7) {
//         //if stuck
//         if ((row == 0 && col == 7)) {
//             return 0;
//         }
//         return 1;
//     }
//     else if ((board[parseInt(row) + 1][parseInt(col) - 1] == opp) && (board[parseInt(row) - 1][parseInt(col) + 1] == 0)) {
//         return 0;
//     }
//     else if ((board[parseInt(row) + 1][parseInt(col) + 1] == opp) && (board[parseInt(row) - 1][parseInt(col) - 1] == 0)) {
//         return 0;
//     }
//     if (isKing(opp, [parseInt(row) - 1, parseInt(col) + 1], kings) && (board[parseInt(row) + 1][parseInt(col) - 1] == 0)
//         && (board[parseInt(row) - 1][parseInt(col) + 1] == opp)) {
//         return 0;
//     }
//     else if (isKing(opp, [parseInt(row) - 1, parseInt(col) - 1], kings) && (board[parseInt(row) + 1][parseInt(col) + 1] == 0)
//         && (board[parseInt(row) - 1][parseInt(col) - 1] == opp)) {
//         return 0;
//     }
//     else {
//         return 5;
//     }
// }

function inDanger(board, kings, player, row, col) {

    if (row == 0 || row == 7 || col == 0 || col == 7) {
        //if stuck
        if ((row == 0 && col == 7)) {
            return 0;
        }
        return 1;
    }
    x = parseInt(row);
    y = parseInt(col);

    if (player == 1) {    // red

        if ((board[x + 1][y - 1] == 2) && (board[x - 1][y + 1] == 0)) {
            // - - 0 
            // - 1 -
            // 2 - -
            return 3;
        }
        else if ((board[x + 1][y + 1] == 2) && (board[x - 1][y - 1] == 0)) {
            // 0 - - 
            // - 1 -
            // - - 2
            return 3;
        }
        else if (isKing(2, [x - 1, y - 1], kings) && (board[x - 1][y - 1] == 2) && (board[x + 1][y + 1] == 0)) {
            // 2* -  - 
            // -  1  -
            // -  -  0
            return 4;
        }
        else if (isKing(2, [x - 1, y + 1], kings) && (board[x - 1][y + 1] == 2) && (board[x + 1][y - 1] == 0)) {
            // -  -  2* 
            // -  1  -
            // 0  -  -
            return 4;
        }

    }
    else if (player == 2) {   // blue

        if ((board[x - 1][y + 1] == 1) && (board[x + 1][y - 1] == 0)) {
            // - - 1 
            // - 2 -
            // 0 - -
            return 3;
        }
        else if ((board[x - 1][y - 1] == 1) && (board[x + 1][y + 1] == 0)) {
            // 1 - - 
            // - 2 -
            // - - 0
            return 3;
        }
        else if (isKing(1, [x + 1, y + 1], kings) && (board[x + 1][y + 1] == 1) && (board[x - 1][y - 1] == 0)) {
            // 0  -  - 
            // -  2  -
            // -  -  1*
            return 4;
        }
        else if (isKing(1, [x + 1, y - 1], kings) && (board[x + 1][y - 1] == 1) && (board[x - 1][y + 1] == 0)) {
            // -  -  0 
            // -  2  -
            // 1* -  -
            return 4;
        }

    }

}

function safeAndMayKill(board, kings, player, row, col) {

    if (row == 0 || row == 7 || col == 0 || col == 7) {
        //if stuck
        if ((row == 0 && col == 7)) {
            return 3;
        }
        return 2;
    }
    x = parseInt(row);
    y = parseInt(col);

    if (player == 1) {    // red

        if ((board[x - 1][y - 1] == 1) && (board[x - 1][y + 1] == 1)) { // super safe
            // 1 - 1 
            // - 1 -
            // x - x
            return 6;
        }
        else if ((board[x - 1][y - 1] == 1) && (board[x + 1][y - 1] == 0)) { // safe
            // 1 - - 
            // - 1 -
            // 0 - x
            return 4;
        }
        else if ((board[x - 1][y + 1] == 1) && (board[x + 1][y + 1] == 0)) { // safe
            // - - 1 
            // - 1 -
            // x - 0
            return 4;
        }

    }
    else if (player == 2) {   // blue

        if ((board[x + 1][y - 1] == 2) && (board[x + 1][y + 1] == 2)) { // super safe
            // x - x 
            // - 2 -
            // 2 - 2
            return 6;
        }
        else if ((board[x + 1][y - 1] == 2) && (board[x - 1][y - 1] == 0)) { // safe
            // 0 - x 
            // - 2 -
            // 2 - -
            return 4;
        }
        else if ((board[x + 1][y + 1] == 2) && (board[x - 1][y + 1] == 0)) { // safe
            // x - 0 
            // - 2 -
            // - - 2
            return 4;
        }
    }

}

function inDanger_safe(board, player) {
    //count [inDanger, safe]
    let count = [0, 0];
    let opp = (player == 1 ? 2 : 1);
    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == player) {

                //edge pieces
                if (row == 0 || row == 7 || col == 0 || col == 7) {
                    count[0]++;
                }
                //only one attack counted
                //king attacks not counted yet
                else if (board[parseInt(row) + 1][parseInt(col) - 1] == opp && board[parseInt(row) - 1][parseInt(col) + 1] == 0) {
                    count[1]++;
                }
                else if (board[parseInt(row) + 1][parseInt(col) + 1] == opp && board[parseInt(row) - 1][parseInt(col) - 1] == 0) {
                    count[1]++;
                }

            }

        }
    }
    return count;
}

function triaP(board, player) {
    if (board[0][1] == player && board[0][3] == player && board[1][2] == player) {
        return 1;
    }
    else return 0;
}

function oreoP(board, player) {
    if (board[0][3] == player && board[0][5] == player && board[1][4] == player) {
        return 1;
    }
    else return 0;

}

function bridgeP(board, player) {
    if (board[0][1] == player && board[0][5] == player) {
        return 1;
    }
    else return 0;
}

function noTiles(board, player) {
    let count = 0;
    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == player) {
                count++;
            }
        }
    }
    return count;
}

function noKings(kings, player) {
    let count = 0;
    for (let row in kings) {
        if (row[0] == player) {
            count++;
        }
    }
    return count;

}


function noMoreMoves(board, kings, player) {
    if (findMovesAI(board, kings, player).length == 0) {
        return true;
    }
    return false;

}

function isKing(player, loc, kings) {
    for (let i = 0; i < kings.length; i++) {
        if (kings[i][0] == player) {
            if ((kings[i][1] == loc[0]) && (kings[i][2] == loc[1])) {
                return true;
            }
        }
    }
    return false;
}

function findMovesAI(board, kings, player) {
    //return array of moves
    let finalMvs = [];
    let mvs = [];
    let mvsCount = 0;
    let kingFlag = false;
    let opp = (player == 1 ? 2 : 1);
    for (let row in board) {
        for (let col in board[row]) {
            if (board[row][col] == player) {
                kingFlag = isKing(player, [row, col], kings);

                //moving left down
                if (player == 1 || kingFlag) {
                    if (col > 0 && row < 7) {
                        if (board[parseInt(row) + 1][parseInt(col) - 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) + 1, parseInt(col) - 1], player, false);
                            mvsCount++;
                        }
                        else if (col > 1 && row < 6) {
                            if ((board[parseInt(row) + 1][parseInt(col) - 1] == opp) && (board[parseInt(row) + 2][parseInt(col) - 2] == 0)) {
                                mvs[mvsCount] = new Move([row, parseInt(col)], [parseInt(row) + 2, parseInt(col) - 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                    //moving right down
                    if (col < 7 && row < 7) {
                        if (board[parseInt(row) + 1][parseInt(col) + 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) + 1, parseInt(col) + 1], player, false);
                            mvsCount++;
                        }
                        else if (col < 6 && row < 6) {
                            if ((board[parseInt(row) + 1][parseInt(col) + 1] == opp) && (board[parseInt(row) + 2][parseInt(col) + 2] == 0)) {
                                mvs[mvsCount] = new Move([row, col], [parseInt(row) + 2, parseInt(col) + 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                }

                //two additional direction up right and up left 

                if ((player == 2) || kingFlag) {
                    //moving up left
                    if (col > 0 && row > 0) {
                        if (board[parseInt(row) - 1][parseInt(col) - 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) - 1, parseInt(col) - 1], player, false);
                            mvsCount++;
                        }
                        else if (col > 1 && row > 1) {
                            if ((board[parseInt(row) - 1][parseInt(col) - 1] == opp) && (board[parseInt(row) - 2][parseInt(col) - 2] == 0)) {
                                mvs[mvsCount] = new Move([row, col], [parseInt(row) - 2, parseInt(col) - 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                    //moving up right 
                    if (col < 7 && row > 0) {
                        if (board[parseInt(row) - 1][parseInt(col) + 1] == 0) {
                            mvs[mvsCount] = new Move([row, col], [parseInt(row) - 1, parseInt(col) + 1], player, false);
                            mvsCount++;
                        }
                        else if (col < 6 && row > 1) {
                            if ((board[parseInt(row) - 1][parseInt(col) + 1] == opp) && (board[parseInt(row) - 2][parseInt(col) + 2] == 0)) {
                                mvs[mvsCount] = new Move([row, col], [parseInt(row) - 2, parseInt(col) + 2], player, true);
                                mvsCount++;
                            }
                        }
                    }

                }

            }
        }
    }

    //if theres jumps dont include other moves
    let fCount = 0;
    let flag = false; //is false return mvs as it is 
    for (let i = 0; i < mvs.length; i++) {
        if (mvs[i].jump) {
            finalMvs[fCount] = mvs[i];
            flag = true;
            fCount++;
        }
    }

    if (flag) {
        // console.log("jumps: " + finalMvs[0].pastlocation + " to "+ finalMvs[0].nextlocation);
        if (finalMvs[0].jump) console.log("last loc: " + finalMvs[0].pastlocation + "    next loc: " + finalMvs[0].nextlocation);
        return finalMvs;
    }
    return mvs;
}

function makeMoveAI(board, kings, move, player) {
    //need to update checkers list, checker king status and movable attribute, and if there's kings
    //remove checker by setting player 0
    //updat board list
    let opp = (player == 1) ? 2 : 1;

    board[move.pastlocation[0]][move.pastlocation[1]] = 0;
    board[move.nextlocation[0]][move.nextlocation[1]] = player;

    let killedloc = [0, 0];
    let kingFlag = isKing(player, move.pastlocation, kings);
    //check if killed king to remove from kings list, not implemented
    //updating king status
    if (!kingFlag && ((move.nextlocation[0] == 7) || (move.nextlocation[0] == 0))) {
        //console.log("should become king");
        //console.log(move.nextlocation);
        kings.push([player, move.nextlocation[0], move.nextlocation[1]]);
        //console.log(kings[0][0] + " " + kings[0][1] +" "+ kings[0][2]);
        //console.log(isKing(player, move.nextlocation, kings));
    }
    //update king list
    if (kingFlag) {
        //console.log("update king location");
        //console.log(move.nextlocation);
        updateKingLoc(kings, player, move.pastlocation, move.nextlocation);
        //console.log(kings);
    }

    if (move.jump) {
        //king case going up
        if (move.pastlocation[0] > move.nextlocation[0]) {
            //left
            if (move.pastlocation[1] > move.nextlocation[1]) {
                //killed tile
                killedloc = [move.pastlocation[0] - 1, move.pastlocation[1] - 1];
                board[move.pastlocation[0] - 1][move.pastlocation[1] - 1] = 0;
            }
            //right
            else {
                killedloc = [move.pastlocation[0] - 1, parseInt(move.pastlocation[1]) + 1];
                board[move.pastlocation[0] - 1][parseInt(move.pastlocation[1]) + 1] = 0;
            }
        }
        //going down
        else {
            if (move.pastlocation[1] > move.nextlocation[1]) {


                killedloc = [parseInt(move.pastlocation[0]) + 1, parseInt(move.pastlocation[1]) - 1];
                board[parseInt(move.pastlocation[0]) + 1][move.pastlocation[1] - 1] = 0;
            }
            else {
                killedloc = [parseInt(move.pastlocation[0]) + 1, parseInt(move.pastlocation[1]) + 1];
                board[parseInt(move.pastlocation[0]) + 1][parseInt(move.pastlocation[1]) + 1] = 0;
            }

        }
        removeKing(kings, killedloc, opp);
    }

}

function removeKing(kings, killedloc, player) {
    for (let i = 0; i < kings.length; i++) {
        if (kings[i][0] == player && kings[i][1] == killedloc[0] && kings[i][2] == killedloc[1]) {
            kings[i][0] = 0;
            //console.log("king dead");
            return;
        }
    }

}

function updateKingLoc(kings, player, pastlocation, nextlocation) {
    for (let i = 0; i < kings.length; i++) {
        if ((kings[i][0] == player) && (kings[i][1] == pastlocation[0]) && (kings[i][2] == pastlocation[1])) {
            kings[i][1] = nextlocation[0];
            kings[i][2] = nextlocation[1];
            //console.log("king moved");
            return;
        }
    }
}

function findMovePlayer(locC, locT, temMvs) {
    for (let i = 0; i < temMvs.length; i++) {
        if ((temMvs[i].pastlocation[0] == locC[0]) && (temMvs[i].pastlocation[1] == locC[1]) &&
            (temMvs[i].nextlocation[0] == locT[0]) && (temMvs[i].nextlocation[1] == locT[1])) {
            return temMvs[i];
        }

    }

}

function isValidMove(locC, locT, temMvs) {
    for (let i = 0; i < temMvs.length; i++) {
        if ((temMvs[i].pastlocation[0] == locC[0]) && (temMvs[i].pastlocation[1] == locC[1]) &&
            (temMvs[i].nextlocation[0] == locT[0]) && (temMvs[i].nextlocation[1] == locT[1])) {
            return true;
        }

    }
    return false;
}


