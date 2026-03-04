const board = (function() {
    const coordinates = [ , , , , , , , , , ];    
    return { coordinates };
})();

const createPlayer = (name, marker) => {
    let positions = '';
    return { name, marker, positions }
}

const player1 = createPlayer('Player One', 'x');
const player2 = createPlayer('Player Two', 'o');

const game = (function() {    
    let currentPlayer = player1;

    const checkWinner = () => {
        const patterns = ['012', '345', '678', '036', '147', '258', '048', '246'];

        // check if won
        patterns.forEach((pattern) => {
            const regex = new RegExp(`${pattern.charAt(0)}.*${pattern.charAt(1)}.*${pattern.charAt(2)}`);
            if (regex.test(currentPlayer.positions)) {
                console.log(`${currentPlayer.name} won!`);
            }
        });

        // check if draw
        if (!board.coordinates.includes(undefined)) {
            console.log('draw!');
        }
    }

    const changePlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    const takeTurn = (index) => {
        if (board.coordinates[index] === undefined) {
            board.coordinates[index] = currentPlayer.marker;
            currentPlayer.positions = currentPlayer.positions.concat(index);
            checkWinner();
            changePlayer();    
        }
    }

    return { takeTurn };
})();