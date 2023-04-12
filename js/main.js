/**
 * Global variables
 */

import { CELL_VALUE, TURN, GAME_STATUS } from "./constants.js";
import { getCellElementAtIdx, getCurrentTurnElement, getCellElementList, getGameStatusElement } from "./selectors.js";
import { checkGameStatus } from "./utils.js";


let currentTurn = TURN.CROSS;
let isGameEnded = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    currentTurn = currentTurn === TURN.CROSS?TURN.CIRCLE:TURN.CROSS
    const currentTurnElement = getCurrentTurnElement();
    
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE)
    currentTurnElement.classList.add(currentTurn)
}

function updatateStatus(newStatus) {
    const status = getGameStatusElement()
    status.textContent = newStatus
}

function showReplay() {
    const replay = document.getElementById('replayGame')
    replay.classList.add('show')
}

function highlightWin(positionList) {
    for (const postion of positionList) {
        const liWin = getCellElementAtIdx(postion)
        liWin.classList.add('win')
    }
}

function handleInitElementList(element, index) {
    const isClickElement = element.classList.contains(TURN.CROSS) || element.classList.contains(TURN.CIRCLE)
    const isGameEnded = checkGameStatus(cellValues).status !== GAME_STATUS.PLAYING
    if(isClickElement || isGameEnded) return

    element.classList.add(currentTurn)

    const currentChecked = currentTurn === TURN.CROSS?CELL_VALUE.CROSS:CELL_VALUE.CIRCLE
    cellValues[index] = currentChecked

    const statusGame = checkGameStatus(cellValues)

    switch(statusGame.status) {
        case GAME_STATUS.ENDED:{
            // updatate status
            updatateStatus(statusGame.status)
            // show replay
            showReplay()
            break;
        }
            
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:{
             // updatate status
            updatateStatus(statusGame.status)
            // show replay
            showReplay()
            //highlight li win
            highlightWin(statusGame.winPositions)
            break;
        }

            
        default:

    }

    toggleTurn()
}

function initCellElementList() {
    //hanlde click element
    const cellElenmentList = getCellElementList();
    cellElenmentList.forEach((element, index) => {
        element.addEventListener('click', () => handleInitElementList(element, index))
    })
}

function handleReplay() {
    //update status
    const replayStatus = GAME_STATUS.PLAYING
    updatateStatus(replayStatus)
    //update current turn
    const currentTurnElement = getCurrentTurnElement();
    
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE)
    currentTurnElement.classList.add(TURN.CROSS)
    //update cellvalue
    cellValues = cellValues.map(() => "")
    //remove board
    const cellElementList = getCellElementList()
    cellElementList.forEach(cellElement => {
        cellElement.className = ''
    })
    //hidden replay btn
    const replay = document.getElementById('replayGame')
    replay.classList.remove('show')

}

function initReplayBtn() {
    const replay = document.getElementById('replayGame')
    replay.addEventListener('click', handleReplay)
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    initCellElementList()
    initReplayBtn()
})()
