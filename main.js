const displayControl = (function() {
    const dialog = document.querySelector('dialog');
    const btnStart = document.querySelector('.btn-start');

    const form = document.querySelector('form');
    const btnCloseDialog = document.querySelector('.btn-close-dialog');

    const gameBoard = document.querySelector('.game-board');
    const playerContainers = document.querySelectorAll('.player-container');
    
    const statusBar = document.querySelector('.status-bar');

    const player1DisplayedName = document.querySelector('.player-1 .player-name');
    const player2DisplayedName = document.querySelector('.player-2 .player-name');

    const player1DisplayedScore = document.querySelector('.player-1 .player-score');
    const player2DisplayedScore = document.querySelector('.player-2 .player-score');


    // dialog events
    btnStart.addEventListener('click', () => {
        dialog.showModal();
    })

    btnCloseDialog.addEventListener('click', () => {
        form.reset();
        dialog.close();
    });

    // start game
    form.addEventListener('submit', () => {    
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        const player1Name = formObject.player1Name;
        const player2Name = formObject.player2Name;
        
        game.start(player1Name, player2Name);
        
        // changeVisibility(content);
        changeVisibility(gameBoard);
        changeVisibility(statusBar);
        playerContainers.forEach((node) => changeVisibility(node));
        
         
        displayNames(player1Name, player2Name);
        
        updateScreen();
    });

    gameBoard.addEventListener('click', (event) => {
        if (event.target.id.at(-1).match(/^[0-8]{1}$/)) {
            const position = event.target.id.at(-1);
            game.takeTurn(position);
            updateScreen();
        } 
    })
    
    // update information on screen
    const updateScreen = () => {
        let info = game.getTurnInfo();
        
        updateScore(info.score1, info.score2);
        updateStatusBar(info.turnResult);
        updateBoard();
    }

    const updateBoard = () => {
        board.get().forEach((position, index) => {
            const place = document.querySelector(`#place-${index}`);
            place.textContent = position;
        })
    }

    const updateStatusBar = (message) => {
        statusBar.textContent = message;
    }

    const updateScore = (score1, score2) => {
        player1DisplayedScore.textContent = `Score: ${score1}`;
        player2DisplayedScore.textContent = `Score: ${score2}`;

    }

    const displayNames = (name1, name2) => {
        player1DisplayedName.textContent = name1;
        player2DisplayedName.textContent = name2;
    }

    const changeVisibility = (element) => {
        if (element.style.visibility = 'hidden') {
            element.style.visibility = 'visible';
        }
    }
})();

const board = (function() {
    const boardArray = new Array(9).fill('');

    const get = () => boardArray;
    const clear = () => boardArray.fill('');

    const markPosition = (marker, index) => boardArray[index] = marker;

    const getPlayerPositions = (player) => {
        const marker = player.getMarker();
        let playerPositions = '';
        
        boardArray.forEach((position, index) => {
            if (position === marker) {
                playerPositions = playerPositions.concat(index);
            }
        });
        
        return playerPositions;
    }

    return { get, clear, markPosition, getPlayerPositions };
})();

const createPlayer = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;
    const clearScore = () => score = 0;

    return { getName, getMarker, getScore, increaseScore, clearScore }
}

const game = (function() {
    let player1;
    let player2;
    let openingPlayer;
    let currentPlayer;
    let turnResult;

    const start = (player1Name, player2Name) => {
        player1 = createPlayer(player1Name, '\u{2715}');
        player2 = createPlayer(player2Name, '\u{25EF}');
        newRound();
        turnResult = `${currentPlayer.getName()} (${currentPlayer.getMarker()}), it's your turn!`;
    }
   
    const newRound = () => {        
        openingPlayer = (openingPlayer === player1) ? player2 : player1;
        currentPlayer = openingPlayer;
        board.clear();
    }

    const getTurnInfo = () => {
        const name1 = player1.getName();
        const name2 = player2.getName();
        const score1 = player1.getScore();
        const score2 = player2.getScore();
        return { name1, name2, score1, score2, turnResult }
    }

    const checkWinner = () => {
        const patterns = ['012', '345', '678', '036', '147', '258', '048', '246'];

        for (const pattern of patterns) {
            const regex = new RegExp(`(?=.*${pattern.charAt(0)})(?=.*${pattern.charAt(1)})(?=.*${pattern.charAt(2)}).*`);

            if (regex.test(board.getPlayerPositions(currentPlayer))) {
                currentPlayer.increaseScore();
                turnResult = `${currentPlayer.getName()} (${currentPlayer.getMarker()}) won!`;
                return true;
            }
        }
    }

    const checkDraw = () => {
        if (!board.get().includes('')) {
            turnResult = 'Draw!';
            return true;
        }
    }
    
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
        turnResult = `${currentPlayer.getName()} (${currentPlayer.getMarker()}), it's your turn!`;
    }

    const takeTurn = (position) => {
        if (board.get()[position] === '') {
            board.markPosition(currentPlayer.getMarker(), position);

            if (checkWinner() === true || checkDraw() === true) {
                newRound();
            } else {
                switchPlayer();
            }
            // return getTurnInfo();
        }
    }

    return { start, getTurnInfo, takeTurn };
})();