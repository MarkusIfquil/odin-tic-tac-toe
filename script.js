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
        if (!Gameboard.placeMark(currentPlayer.mark, positionX, positionY)) {
            currentPlayerIndex--;
        }
        let roundResult = checkIfWonAndWhichMark();
        if (roundResult != 'none' && roundResult != 'stalemate') {
            let winningPlayer = findPlayerByMark(roundResult);
            console.log(`${winningPlayer.name} won!`);
            currentPlayerIndex = 0;
            Gameboard.reset();
        }
        else if(roundResult == 'stalemate') {
            console.log('stalemate!');
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
            console.log(player);
            if (player.mark == mark) {
                return player;
            }
        }
        console.log('player not found');
        return 'none';
    }

    let checkIfWonAndWhichMark = () => {
        let size = Gameboard.boardSize;
        let checkRows = () => {
            for (let i = 0; i < size; i++) {
                let count = 0;
                let markToCheckAgainst = Gameboard.getMarkAtPosition(i, 0);
                for (let j = 0; j < size; j++) {
                    if (markToCheckAgainst != Gameboard.getMarkAtPosition(i, j)) {
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
                let markToCheckAgainst = Gameboard.getMarkAtPosition(0, i);
                for (let j = 0; j < size; j++) {
                    if (markToCheckAgainst != Gameboard.getMarkAtPosition(j, i)) {
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
            let markToCheckAgainst = Gameboard.getMarkAtPosition(0, 0);
            let j = 0;
            let count = 0;
            for (let i = 0; i < size; i++) {
                if (markToCheckAgainst != Gameboard.getMarkAtPosition(i, j)) {
                    break;
                }
                count++;
                j++;
            }
            if (count == size) {
                return markToCheckAgainst;
            }
            j = size - 1;
            markToCheckAgainst = Gameboard.getMarkAtPosition(0, j);
            for (let i = 0; i < size; i++) {
                if (markToCheckAgainst != Gameboard.getMarkAtPosition(i, j)) {
                    return 'none';
                }
                j--;
            }
            return markToCheckAgainst;
        }

        let checkIfStalemate = () => {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (Gameboard.getMarkAtPosition(i, j) === ' ') {
                        return false;
                    }
                }
            }
            return true;
        }

        let [resultRows, resultColumns, resultDiagonals] = [checkRows(), checkColumns(), checkDiagonals()];

        // console.log(resultRows,resultColumns,resultDiagonals);

        if (resultRows != 'none' && resultRows != ' ') {
            return resultRows;
        }
        if (resultColumns != 'none' && resultColumns != ' ') {
            return resultColumns;
        }
        if (resultDiagonals != 'none' && resultDiagonals != ' ') {
            return resultDiagonals;
        }

        if(checkIfStalemate()){
            return 'stalemate';
        }

        return 'none';
    }

    return { createPlayer, addPlayer, playRound };
})();

let GameController = (function createGameController(){
    let addPlayer = (e) => {
        e.preventDefault();
        let name = document.querySelector('#name');
        let mark = document.querySelector('#mark');
        
        let playerContainer = document.createElement('div');

        let nameP = document.createElement('p');
        nameP.textContent = 'Name: ' + name.value;
        let markP = document.createElement('p');
        markP.textContent = 'Mark: ' + mark.value;
        playerContainer.appendChild(nameP);
        playerContainer.appendChild(markP);

        let playerList = document.querySelector('.player-list');
        playerList.appendChild(playerContainer);

        name.value = '';
        mark.value = '';

        Gameflow.addPlayer(Gameflow.createPlayer(name,mark));
    };
    
    let fillGameGrid = (size) => {
        let grid = document.querySelector('.game-grid');
        for (let i = 0; i < size*size; i++) {
            let square = document.createElement('div');
            grid.appendChild(square);
        }
        grid.style['grid-template-columns'] = `repeat(${size},1fr)`;
        grid.style['grid-template-rows'] = `repeat(${size},1fr)`;
    }
    
    let startRound = (e) => {
        playersDiv.classList.toggle("hidden");
        gameGrid.classList.toggle("hidden");
    }
    
    let playersDiv = document.querySelector('.players');
    let playerForm = document.querySelector('.player-form');
    let gameGrid = document.querySelector('.game-grid');
    let startButton = document.querySelector('#start-round');
    startButton.addEventListener('click', startRound);
    playerForm.addEventListener('submit', addPlayer);
    fillGameGrid(3);
})();

