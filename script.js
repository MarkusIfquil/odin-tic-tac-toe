let Gameboard = (function createGameboard() {
    let gameGrid = [];
    let boardSize;

    let getBoardSize = () => {
        return boardSize;
    }

    let reset = (boardSizeA = 3) => {
        boardSize = boardSizeA;
        gameGrid = [];

        for (let index = 0; index < boardSizeA; index++) {
            let row = [];
            for (let index = 0; index < boardSizeA; index++) {
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

    return { reset, placeMark, printBoard, getMarkAtPosition, getBoardSize};
})();

let Gameflow = (function createGameflow() {
    let gameState = 'running';
    let Players = [];
    let currentPlayerIndex = 0;

    let createPlayer = (name, mark) => {
        return { name, mark };
    };

    let addPlayer = (player) => {
        Players.push(player);
    };

    let removePlayer = (player) => {
        Players.splice(Players.findIndex((p) => {
            return p.name == player.name && p.mark == player.mark;
        }), 1);
    }

    let getPlayerListSize = () => {
        return Players.length;
    }

    let getCurrentPlayer = () => {
        console.log(`current player: ${Players[currentPlayerIndex].name}`);
        return Players[currentPlayerIndex];
    }

    let checkIfPlayerExists = (name, mark) => {
        if (name) {
            for (const player of Players) {
                if (player.name == name) {
                    return true;
                }
            }
        }
        if (mark) {
            for (const player of Players) {
                if (player.mark == mark) {
                    return true;
                }
            }
        }
        return false;
    }

    let reset = () => {
        currentPlayerIndex = 0;
        GameController.clearGameGrid();

        let boardSizeInput = document.querySelector('#size');
        let boardSize = boardSizeInput.value;
        Gameboard.reset(boardSize);
        console.log(Gameboard.getBoardSize());
        GameController.fillGameGrid(boardSize);
    }

    let switchPlayer = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % Players.length;    
    }

    let placeMarkerAndCheckIfBadMove = (mark, positionX, positionY) => {
        return Gameboard.placeMark(mark, positionX, positionY);
    }

    let displayOnFinalGameState = (roundResult) => {
        let gameStateP = document.querySelector('.game-state');
        if (roundResult != 'none' && roundResult != 'stalemate') {
            let winningPlayer = findPlayerByMark(roundResult);
            gameStateP.textContent = `${winningPlayer.name} won!`;
            gameState = 'win';
            reset();
        }
        else if (roundResult == 'stalemate') {
            gameStateP.textContent = `stalemate!`;
            gameState = 'stalemate';
            reset();
        }
        else {
            gameStateP.textContent = `game is running`;
            gameState = 'running';
        }
    }

    let getGameState = () => {
        return gameState;
    }

    let playRound = (positionX, positionY) => {
        let currentPlayer = getCurrentPlayer();

        if(!placeMarkerAndCheckIfBadMove(currentPlayer.mark, positionX, positionY)) {
            return false;
        }

        let roundResult = checkIfWonAndWhichMark();

        displayOnFinalGameState(roundResult);

        Gameboard.printBoard();
        return true;
    };

    let findPlayerByMark = (mark) => {
        for (const player of Players) {
            if (player.mark == mark) {
                return player;
            }
        }
        return 'none';
    }

    let checkIfWonAndWhichMark = () => {
        let size = Gameboard.getBoardSize();
        let checkRows = () => {
            for (let i = 0; i < size; i++) {
                let count = 0;
                let markToCheckAgainst = Gameboard.getMarkAtPosition(i, 0);
                if (markToCheckAgainst == ' ') {
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
        };

        let checkColumns = () => {
            for (let i = 0; i < size; i++) {
                let count = 0;
                let markToCheckAgainst = Gameboard.getMarkAtPosition(0, i);
                if (markToCheckAgainst == ' ') {
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
        };

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
        };

        let checkIfStalemate = () => {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (Gameboard.getMarkAtPosition(i, j) === ' ') {
                        return false;
                    }
                }
            }
            return true;
        };

        let [resultRows, resultColumns, resultDiagonals] = [checkRows(), checkColumns(), checkDiagonals()];

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

    return { createPlayer, addPlayer, removePlayer, getPlayerListSize, getCurrentPlayer, playRound, reset, checkIfPlayerExists, getGameState, switchPlayer };
})();

let GameController = (function createGameController() {
    let removePlayer = (index) => {
        let removablePlayer = document.querySelector(`.player-list > .player-${index}`);
        let playerList = document.querySelector('.player-list');

        playerList.removeChild(removablePlayer);
        Gameflow.removePlayer({ name: removablePlayer.children[0].textContent, mark: removablePlayer.children[1].textContent });
    }

    let addPlayer = (name, mark) => {
        console.log(name, mark);
        if (Gameflow.checkIfPlayerExists(name, mark)) {
            alert('a player with that name or mark already exists');
            return;
        }
        let playerCount = Gameflow.getPlayerListSize();

        let playerContainer = document.createElement('div');
        playerContainer.classList.add(`player-${playerCount}`);

        let nameP = document.createElement('p');
        nameP.textContent = name;
        let markP = document.createElement('p');
        markP.textContent = mark;

        let removePlayerButton = document.createElement('button');
        removePlayerButton.textContent = 'remove player';
        removePlayerButton.addEventListener('click', () => removePlayer(playerCount));

        playerContainer.appendChild(nameP);
        playerContainer.appendChild(markP);
        playerContainer.appendChild(removePlayerButton);

        let playerList = document.querySelector('.player-list');
        playerList.appendChild(playerContainer);

        Gameflow.addPlayer(Gameflow.createPlayer(name, mark));
    }

    let onAddPlayerClick = (e) => {
        e.preventDefault();

        let name = document.querySelector('#name');
        let mark = document.querySelector('#mark');

        addPlayer(name.value, mark.value);

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
        let row = Math.floor(squareNumber / Gameboard.getBoardSize());
        let column = squareNumber % Gameboard.getBoardSize();

        if(Gameflow.playRound(row, column)) {
            if(Gameflow.getGameState() == 'running') {
                e.target.textContent = Gameflow.getCurrentPlayer().mark;
                Gameflow.switchPlayer();
            }
            // console.log(Gameflow.getCurrentPlayer().mark, Gameflow.getCurrentPlayer().name);
            changeCurrentPlayerText();
        };
    };

    let fillGameGrid = (size = 3) => {
        let grid = document.querySelector('.game-grid');
        grid.innerHTML = '';
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
        Gameflow.reset();
    };

    let setupDiv = document.querySelector('.setup');
    let playerForm = document.querySelector('.player-form');
    let gameGrid = document.querySelector('.game');
    let startButton = document.querySelector('#start-round');
    let goBackButton = document.querySelector('#go-back');
    let resetButton = document.querySelector('#reset');
    startButton.addEventListener('click', toggleHidden);
    goBackButton.addEventListener('click', toggleHidden);
    resetButton.addEventListener('click', () => Gameflow.reset());

    playerForm.addEventListener('submit', onAddPlayerClick);

    fillGameGrid(3);

    addPlayer('jan Mawaku','x');
    addPlayer('jan Sopija','o');

    return { clearGameGrid, fillGameGrid };
})();

