
let gameID = localStorage.getItem('gameID');

if(!gameID){
    window.location.href = "/";
}

let teamAnswered = [];

setInterval(loadTeams, 1000);


function loadTeams(){
    fetch('/api/games/?id=' + gameID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => data.json()).then((res) => {
        if(res.error){
            window.location.href = "/";
        }else{
            let teams = res.teams;

            teams.forEach((team, index) => {
                if(index >= teamAnswered.length){
                    teamAnswered.push(0);
                }
                let teamDiv = document.createElement("div");
                teamDiv.className = "teamSquare";
                teamDiv.id = team.teamName;
                team.onclick = () => { updateTeam( team.teamName ) };
            });

        }
    });
}

function updateTeam(e){
    fetch("/api/games/updateTeam?id=" + gameID, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            teamName: e,
        }),
    })
}