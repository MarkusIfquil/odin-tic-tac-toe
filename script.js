let Gameboard = (function createGameboard(boardSize) {
    let gameGrid = [];

    let reset = () => {
        gameGrid = [];

        for (let index = 0; index < boardSize; index++) {
            let row = [];
            for (let index = 0; index < boardSize; index++) {
                row.push(' ');
            }
            gameGrid.push(row);
        }
    };

    reset();

    let getMarkAtPosition = (positionX, positionY) => {
        return gameGrid[positionX][positionY];
    }

    let placeMark = (playerMark, positionX, positionY) => {
        if (gameGrid[positionX][positionY] != ' ') {
            console.log('there is already a player mark there');
            return false;
        }
        else {
            gameGrid[positionX][positionY] = playerMark;
            return true;
        }
    };

    let printBoard = () => {
        for (const row of gameGrid) {
            let newRow = [];
            for (const element of row) {
                newRow.push(element);
            }
            console.log(newRow);
        }
    }

    return { reset, placeMark, printBoard, getMarkAtPosition, boardSize };
})(3);

let Gameflow = (function createGameflow() {
    let Players = [];
    let currentPlayerIndex = 0;

    let createPlayer = (name, mark) => {
        return { name, mark };
    };

    let addPlayer = (player) => {
        Players.push(player);
    };

    let playRound = (positionX, positionY) => {
        let currentPlayer = Players[currentPlayerIndex];
        while(!Gameboard.placeMark(currentPlayer.mark, positionX, positionY)){};
        let roundResult = checkIfWonAndWhichMark();
        if (roundResult != 'none') {
            let winningPlayer = findPlayerByMark(roundResult);
            console.log(`${winningPlayer.name} won!`);
            currentPlayerIndex = 0;
            Gameboard.reset();
        }
        else {
            currentPlayerIndex = (currentPlayerIndex + 1) % Players.length;
        }
        Gameboard.printBoard();
    };

    let findPlayerByMark = (mark) => {
        for (const player of Players) {
            if (player.mark == mark) {
                return player;
            }
        }
    }

    let checkIfWonAndWhichMark = () => {
        let size = Gameboard.boardSize;
        let checkRows = () => {
            for (let i = 0; i < size; i++) {
                let count = 0;
                let markToCheckAgainst = Gameboard.getMarkAtPosition(i,0);
                for (let j = 0; j < size; j++) {
                    if (markToCheckAgainst != Gameboard.getMarkAtPosition(i,j)) {
                        break;
                    }
                    count++;
                }
                if (count == size) {
                    return markToCheckAgainst;
                }
            }
            return 'none';
        }

        let checkColumns = () => {
            for (let i = 0; i < size; i++) {
                let count = 0;
                let markToCheckAgainst = Gameboard.getMarkAtPosition(0,i);
                for (let j = 0; j < size; j++) {
                    if (markToCheckAgainst != Gameboard.getMarkAtPosition(j,i)) {
                        break;
                    }
                    count++;
                }
                if (count == size) {
                    return markToCheckAgainst;
                }
            }
            return 'none';
        }

        let checkDiagonals = () => {
            let markToCheckAgainst = Gameboard.getMarkAtPosition(0,0);
            let j = 0;
            let count = 0;
            for (let i = 0; i < size; i++) {
                if (markToCheckAgainst != Gameboard.getMarkAtPosition(i,j)) {
                    break;
                }
                count++;
                j++;
            }
            if (count == size) {
                return markToCheckAgainst;
            }
            markToCheckAgainst = Gameboard.getMarkAtPosition(0,j);
            for (let i = 0; i < size; i++) {
                if (markToCheckAgainst != Gameboard.getMarkAtPosition(i,j)) {
                    return 'none';
                }
                j--;
            }
        }

        let [resultRows, resultColumns, resultDiagonals] = [checkRows(), checkColumns(), checkDiagonals()];

        console.log(resultRows,resultColumns,resultDiagonals);

        if (resultRows != 'none' && resultRows != ' ') {
            return resultRows;
        }
        if (resultColumns != 'none' && resultColumns != ' ') {
            return resultColumns;
        }
        if (resultDiagonals != 'none' && resultDiagonals != ' ') {
            return resultDiagonals;
        }
        return 'none';
    }

    return { createPlayer, addPlayer, playRound };
})();



