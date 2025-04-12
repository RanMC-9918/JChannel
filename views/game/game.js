let notifyDiv = document.getElementById("notifyDiv"); 

let gameDiv = document.getElementById("gameDiv");

let players = document.getElementById("players");

let gameID = window.location.href.substring(
    window.location.href.lastIndexOf("/?id=") + 5
);

let teamName = "";

let teams = [];

let game;




fetch('/api/game/?id=' + gameID, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
}).then((data) => data.json()).then((res) => {
    teams = res.teams;
    console.log(teams)

    let layer = 0;
    let index = 0;
    for(let i = 0; i < res.squares.length; i += 6){
        let newLayer = document.createElement("div");
        newLayer.className = "gameLayer";

        if(index >= res.squares.length){
            break;
        }

        if(layer % 4 == 0 || layer % 4 == 2){
            for(let i = 0; i < 6; i++){
                if(index >= res.squares.length){
                    break;
                }
                let d = document.createElement("div");
                if(res.squares[index] > 0){
                    d.setAttribute("power", "speed");
                    d.innerText = "Speed +" + res.squares[index];
                }
                else if(res.squares[index] < 0){
                    d.setAttribute("power", "slow");
                    d.innerText = "Speed " + res.squares[index];
                }
                d.className = "solid";
                newLayer.appendChild(d);
                index++;
            }
        }
        else if(layer % 4 == 1){
            let d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("div");
            d.className = "solid";
            if (res.squares[index] > 0) {
              d.setAttribute("power", "speed");
              d.innerText = "Speed +" + res.squares[index];
            } else if (res.squares[index] < 0) {
              d.setAttribute("power", "slow");
              d.innerText = "Speed " + res.squares[index];
            }

            newLayer.appendChild(d);
        }
        else{
            let d = document.createElement("div");
            d.className = "solid";
            if (res.squares[index] > 0) {
              d.setAttribute("power", "speed");
              d.innerText = "Speed +" + res.squares[index];
            } else if (res.squares[index] < 0) {
              d.setAttribute("power", "slow");
              d.innerText = "Speed " + res.squares[index];
            }

            newLayer.appendChild(d);

            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
            d = document.createElement("d");
            newLayer.appendChild(d);
        }

        layer++;
        gameDiv.appendChild(newLayer);

    }

    if (
      !localStorage.getItem("teamName") ||
      !teams.find((team) => team.teamName == localStorage.getItem("teamName"))
    ) {
      while(!teamName || teamName.length < 1 || teamName.length > 15) {
        teamName = prompt("Enter your teams name (1 - 14 chars)");
      }
      if (teams.find((team) => team.teamName === teamName)) {
        localStorage.removeItem("teamName");
        alert("Team name already taken! Please choose another one.");
        window.location.reload();
      } else {
        fetch("/api/create/team", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamName: teamName,
            gameID,
          }),
        })
          .then((data) => data.json())
          .then((res) => {
            if (res.error) {
              alert(res.error);
              window.location.reload();
            } else {
              notify("Team name set to " + teamName);
              localStorage.setItem("teamName", teamName);
            }
          });
      }
    } else {
      teamName = localStorage.getItem("teamName");
      notify("Logged in as " + teamName);
    }
});


function notify(message) {
    notifyDiv.style.top = "0px";
    notifyDiv.innerHTML = message;
    setTimeout(() => {
        notifyDiv.style.top = "-100px";
    }, 3000);
}


loadTeams();


function loadTeams(){
    fetch("/api/game/?id=" + gameID, {
        method: "GET",
    }).then((data) => data.json()).then((res) => {
      players.innerHTML = "";
      res.teams.forEach((team, index) => {
        let player = document.createElement("div");
        player.style.position = "absolute";
        let y = 0;
        let i = 0;
        while(i < team.boardNumber){
          if(y % 4 == 0 && y % 4 == 2){
            i += 6;
          }
          else if(y % 4 == 1 && y % 4 == 3){
            i += 1;
          }
        }
        let elem = gameDiv.childNodes[y].childNodes.find((elem) => elem.id == team.boardNumber);
        player.style.backgroundColor = "red";
        player.style.width = "10px";
        player.style.height = "10px";
        const rect = elem.getBoundingClientRect();
        player.style.top = rect.top + 10 + "px";
        player.style.left = rect.left + 10 + "px";
        players.appendChild(player);
      })
    })
}