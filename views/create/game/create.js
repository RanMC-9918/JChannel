let submit = document.getElementById("submit");

let players = document.getElementById("players");
let time = document.getElementById("time")
let squares = document.getElementById("squares")

submit.addEventListener("click", (e) => {
    e.preventDefault();
    createGame();
});

function createGame(){
    if (players.value.length > 0 && time.value.length > 0 && squares.value.length > 0) {
      console.log(
        JSON.stringify({
          gameMaxPlayers: players.value,
          gameTime: time.value,
          gameType: window.location.href.substring(
            window.location.href.lastIndexOf("/?type=") + 7
          ),
          squaresLength: squares.value,
        })
      );
      fetch("/api/create/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameMaxPlayers: players.value,
          gameTime: time.value,
          gameType: window.location.href.substring(
            window.location.href.lastIndexOf("/?type=") + 7
          ),
          squaresLength: squares.value
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          window.location.href = "/dashboard/" + res.gameID;
          localStorage.setItem("gameID", res.gameID);
        });
    }
}

