
const Gameboard = (function () {
    const rows = 3;
    const column = 3;
    const gameboard = [];
    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < column; j++) {
            gameboard[i].push(cell());
        }
    }


    const markcell = (i, j, player) => {
        if (gameboard[i][j].getValue() == 0) {
            gameboard[i][j].addPlayer(player);
        }
    }

    const printboard = () => {
        const boardWithCellValues = gameboard.map((row) => row.map((cell) => cell.getValue()))
        return boardWithCellValues;
    }

    function getBoard() {
        return gameboard;
    }

    function resetboard() {
        console.log(`resseting board`);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < column; j++) {
                gameboard[i][j].addPlayer(0);
            }
        }
        console.log(printboard());

    }

    return { gameboard, markcell, printboard, getBoard, resetboard };
})();


function cell() {
    let value = 0;
    const getValue = () => value;

    const addPlayer = (player) => {
        value = player;
    }

    return { getValue, addPlayer };
}


const GameController = (playerOneName, playerTwoName) => {
    const players = [
        {
            name: playerOneName,
            token: 'X',
            score: 0
        },
        {
            name: playerTwoName,
            token: 'O',
            score: 0
        }
    ]
    const board = Gameboard;

    let activePlayer = players[0];

    const switchTurn = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;
    const getPlayer = () => players;

    const playRound = (index, updateScreencall, displayTurns, updateplayer) => {
        let row = index[1];
        let column = index[2];
        if (checkSquare(index)) {
            board.markcell(row, column, getActivePlayer().token);
            updateScreencall();

            if (checkWinner(updateplayer, displayTurns)) {
                setTimeout(() => {
                    updateScreencall();

                    displayTurns(getActivePlayer().name + "'s turn");
                    console.log("here")
                }, 1000)
                return;
            }
            switchTurn()
            displayTurns(getActivePlayer().name + "'s turn");
        }
        else {
            console.log("Invalid already marked");
            return false;
        }
    }


    const checkWinner = (updatePlayer, displayTurns) => {
        let winner = false;

        //checking rows 
        if (board.gameboard[0][0].getValue() == getActivePlayer().token && board.gameboard[0][0].getValue() == board.gameboard[0][1].getValue()
            && board.gameboard[0][2].getValue() == board.gameboard[0][1].getValue() ||
            board.gameboard[1][0].getValue() == getActivePlayer().token && board.gameboard[1][0].getValue() == board.gameboard[1][1].getValue()
            && board.gameboard[1][2].getValue() == board.gameboard[1][1].getValue() ||
            board.gameboard[2][0].getValue() == getActivePlayer().token && board.gameboard[2][0].getValue() == board.gameboard[2][1].getValue()
            && board.gameboard[2][2].getValue() == board.gameboard[2][1].getValue()
        ) {
            winner = true;
        }
        //checking columns
        else if (
            (board.gameboard[0][0].getValue() == getActivePlayer().token && board.gameboard[0][0].getValue() == board.gameboard[1][0].getValue() &&
                board.gameboard[2][0].getValue() == board.gameboard[1][0].getValue()) ||
            (board.gameboard[0][1].getValue() == getActivePlayer().token && board.gameboard[0][1].getValue() == board.gameboard[1][1].getValue() &&
                board.gameboard[2][1].getValue() == board.gameboard[1][1].getValue()) ||
            (board.gameboard[0][2].getValue() == getActivePlayer().token && board.gameboard[0][2].getValue() == board.gameboard[1][2].getValue() &&
                board.gameboard[2][2].getValue() == board.gameboard[1][2].getValue())
        ) {
            winner = true;

        }
        //checking diagonals
        else if (
            (board.gameboard[0][0].getValue() == getActivePlayer().token && board.gameboard[0][0].getValue() == board.gameboard[1][1].getValue() &&
                board.gameboard[2][2].getValue() == board.gameboard[1][1].getValue()) ||
            (board.gameboard[0][2].getValue() == getActivePlayer().token && board.gameboard[0][2].getValue() == board.gameboard[1][1].getValue() &&
                board.gameboard[2][0].getValue() == board.gameboard[1][1].getValue())
        ) {
            winner = true;
        }
        //checking for tie
        if (winner == false && board.gameboard.every(row => row.every(cell => cell.getValue() != 0))) {
            setTimeout(() => {
                displayTurns("Its a draw !!");

            }, 500)

            board.resetboard();

            return true;
        }
        if (winner) {
            console.log("winner: " + getActivePlayer().name);
            setTimeout(() => {
                displayTurns(getActivePlayer().name + " wins!!");
            }, 500)

            getActivePlayer().score++;
            updatePlayer();


            board.resetboard();

            return true;
        }
    }

    function checkSquare(index) {
        let row = index[1];
        let column = index[2];
        if (board.gameboard[row][column].getValue() != 0) {
            //console.log("already marked");
            return false;
        }
        return true;

    }

    return { getPlayer, checkSquare, playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
    const dialog = document.querySelector("dialog");
    const boardContainer = document.querySelector(".board-wrapper");
    const display = document.querySelector(".display");
    const submit = document.querySelector("dialog > .submit");
    let game;
    const reset=document.querySelector(".Reset");
    dialog.showModal();

    submit.addEventListener("click", () => {
        const p1name = document.querySelector("#p1").value || "Player 1";
        const p2name = document.querySelector("#p2").value || "Player 2";
        game = GameController(p1name, p2name);
        updatePlayerName();
        displayTurns(game.getActivePlayer().name + "'s turn");

        dialog.close();
    });

    function updatePlayerName() {
        const playerone = document.querySelector(".player.one .name")
        const scoreval = document.querySelector(".player.one .score .value")
        const token1=document.querySelector(".player.one .token");
        playerone.textContent = game.getPlayer()[0].name;
        token1.textContent=game.getPlayer()[0].token;
        const playertwo = document.querySelector(".player.two .name")
        const scoreval2 = document.querySelector(".player.two .score .value")
        const token2=document.querySelector(".player.two .token");
        token2.textContent=game.getPlayer()[1].token;
        playertwo.textContent = game.getPlayer()[1].name;
        scoreval.textContent = game.getPlayer()[0].score;
        scoreval2.textContent = game.getPlayer()[1].score;
    }



    function displayTurns(message) {
        console.log(message);
        display.textContent = message;

    }

    function updateScreen() {

        let board = game.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let item = document.querySelector("#i" + i + j);
                item.textContent = board[i][j].getValue() === 0 ? '' : board[i][j].getValue();
            }

        }
    }

    boardContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("item")) {
            let index = event.target.id;
            game.playRound(index, updateScreen, displayTurns, updatePlayerName);
        }
    })
reset.addEventListener("click",()=>{
    location.reload();
})

}

document.addEventListener('DOMContentLoaded', () => {
    ScreenController();
});