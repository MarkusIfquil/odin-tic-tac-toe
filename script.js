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
        console.log(player);
        Players.push(player);
    };

    let removePlayer = (player) => {
        Players.splice(Players.find((p) => { p == player }), 1);
    }

    let getPlayerListSize = () => {
        return Players.length;
    }

    let getCurrentPlayer = () => {
        return Players[currentPlayerIndex];
    }

    let playRound = (positionX, positionY) => {
        let currentPlayer = getCurrentPlayer();
        if (!Gameboard.placeMark(currentPlayer.mark, positionX, positionY)) {
            currentPlayerIndex--;
        }
        let roundResult = checkIfWonAndWhichMark();
        if (roundResult != 'none' && roundResult != 'stalemate') {
            let winningPlayer = findPlayerByMark(roundResult);

            let gameStateP = document.querySelector('.game-state');
            gameStateP.textContent = `${winningPlayer.name} won!`;
            currentPlayerIndex = 0;
            GameController.clearGameGrid();
            Gameboard.reset();
        }
        else if (roundResult == 'stalemate') {
            let gameStateP = document.querySelector('.game-state');
            gameStateP.textContent = `stalemate!`;
            currentPlayerIndex = 0;
            Gameboard.reset();
        }
        else {
            let gameStateP = document.querySelector('.game-state');
            gameStateP.textContent = `game is running`;
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
                if(markToCheckAgainst == ' ') {
                    continue;
                }
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
                if(markToCheckAgainst == ' ') {
                    continue;
                }
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
            if (count == size && markToCheckAgainst != ' ') {
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
            return markToCheckAgainst == ' ' ? 'none' : markToCheckAgainst;
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

        console.log(resultRows,resultColumns,resultDiagonals);

        if (resultRows != 'none') {
            return resultRows;
        }
        if (resultColumns != 'none') {
            return resultColumns;
        }
        if (resultDiagonals != 'none') {
            return resultDiagonals;
        }

        if (checkIfStalemate()) {
            return 'stalemate';
        }

        return 'none';
    }

    return { createPlayer, addPlayer, removePlayer, getPlayerListSize, getCurrentPlayer, playRound };
})();

let GameController = (function createGameController() {
    let removePlayer = (index) => {
        let removablePlayer = document.querySelector(`.player-list > .player-${index}`);
        let playerList = document.querySelector('.player-list');
        console.log(index);
        console.log(removablePlayer);

        playerList.removeChild(removablePlayer);
        Gameflow.removePlayer();
    }

    let addPlayer = (e) => {
        e.preventDefault();
        let name = document.querySelector('#name');
        let mark = document.querySelector('#mark');

        let playerCount = Gameflow.getPlayerListSize();

        let playerContainer = document.createElement('div');
        playerContainer.classList.add(`player-${playerCount}`);
        let nameP = document.createElement('p');
        nameP.textContent = 'name: ' + name.value;
        let markP = document.createElement('p');
        markP.textContent = 'mark: ' + mark.value;
        let removePlayerButton = document.createElement('button');
        removePlayerButton.textContent = 'remove player';
        removePlayerButton.addEventListener('click', () => removePlayer(playerCount));
        playerContainer.appendChild(nameP);
        playerContainer.appendChild(markP);
        playerContainer.appendChild(removePlayerButton);

        let playerList = document.querySelector('.player-list');
        playerList.appendChild(playerContainer);

        Gameflow.addPlayer(Gameflow.createPlayer(name.value, mark.value));
        name.value = '';
        mark.value = '';
    };

    let changeCurrentPlayerText = () => {
        let currentPlayer = Gameflow.getCurrentPlayer();
        let currentPlayerP = document.querySelector('.current-player');
        currentPlayerP.textContent = `current player: ${currentPlayer.name}`;
    }

    let clickGrid = (e) => {
        let squareNumber = e.target.className;
        let row = Math.floor(squareNumber / Gameboard.boardSize);
        let column = squareNumber % Gameboard.boardSize;

        e.target.textContent = Gameflow.getCurrentPlayer().mark;

        Gameflow.playRound(row, column);
        changeCurrentPlayerText();
    };

    let fillGameGrid = (size) => {
        let grid = document.querySelector('.game-grid');
        for (let i = 0; i < size * size; i++) {
            let square = document.createElement('div');
            square.classList.add(i);
            square.addEventListener('click', clickGrid);
            grid.appendChild(square);
        }
        grid.style['grid-template-columns'] = `repeat(${size},1fr)`;
        grid.style['grid-template-rows'] = `repeat(${size},1fr)`;
    };

    let clearGameGrid = () => {
        let grid = document.querySelector('.game-grid');
        for (const square of grid.childNodes) {
            square.textContent = '';
        }
    }

    let enoughPlayers = () => {
        return Gameflow.getPlayerListSize() > 1;
    }

    let toggleHidden = (e) => {
        if (!enoughPlayers()) {
            alert("there are not enough players!");
            return;
        }
        setupDiv.classList.toggle("hidden");
        gameGrid.classList.toggle("hidden");
        changeCurrentPlayerText();
    };

    let setupDiv = document.querySelector('.setup');
    let playerForm = document.querySelector('.player-form');
    let gameGrid = document.querySelector('.game');
    let startButton = document.querySelector('#start-round');
    let goBackButton = document.querySelector('#go-back');
    startButton.addEventListener('click', toggleHidden);
    goBackButton.addEventListener('click', toggleHidden);

    playerForm.addEventListener('submit', addPlayer);

    fillGameGrid(3);

    return { clearGameGrid };
})();

