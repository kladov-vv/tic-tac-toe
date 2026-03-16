const board = (function() {
    let boardArray = [ , , , , , , , , , ];
    
    const get = () => boardArray;
    const clear = () => boardArray = [ , , , , , , , , , ];
    
    const markPosition = (marker, index) => boardArray[index] = marker;

    const getPlayerPositions = (marker) => {
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

    const getPositions = () => board.getPlayerPositions(marker);

    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;
    const clearScore = () => score = 0;

    return { getName, getMarker, getPositions, getScore, increaseScore, clearScore }
}

const player1 = createPlayer('Player One', 'x');
const player2 = createPlayer('Player Two', 'o');

const game = (function() {    
    let currentPlayer = player1;

    const endRound = () => {
        console.log(`${player1.getName()}: ${player1.getScore()} | ${player2.getName()}: ${player2.getScore()}`);
        
        board.clear();
        currentPlayer = player1;
    }

    const endGame = () => {
        endRound();
        player1.clearScore;
        player2.clearScore;
    }

    const checkWinner = () => {
        const patterns = ['012', '345', '678', '036', '147', '258', '048', '246'];

        patterns.forEach((pattern) => {
            const regex = new RegExp(`(?=.*${pattern.charAt(0)})(?=.*${pattern.charAt(1)})(?=.*${pattern.charAt(2)}).*`);
            
            if (regex.test(currentPlayer.getPositions())) {
                currentPlayer.increaseScore();
                console.log(`${currentPlayer.getName()} won!`);
                endRound();
            }
        });
    }

    const checkDraw = () => {
        if (!board.get().includes(undefined)) {
            console.log('draw!');
            endRound();
        }
    }

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    const takeTurn = (position) => {
        if (board.get()[position] === undefined) {
            board.markPosition(currentPlayer.getMarker(), position);
            // displayControl.updateDisplay();

            console.log(currentPlayer.getName());
            console.log(currentPlayer.getPositions());
            
            checkWinner();
            checkDraw();
            switchPlayer();
             
        }
    }

    return { takeTurn, endGame };
})();

game.takeTurn(4);
game.takeTurn(6);
game.takeTurn(0);
game.takeTurn(7);
game.takeTurn(8);