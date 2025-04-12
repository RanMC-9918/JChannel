
let gameID = localStorage.getItem('gameID') || (Number)(window.location.href.substring(window.location.href.lastIndexOf("/")+1));

let teamDivContainer = document.getElementById("teamDivContainer");

let teams = [];

if(!gameID){
    window.location.href = "/";
}


loadTeams();

setInterval(loadTeams, 5000);


function loadTeams(){
    fetch('/api/game/?id=' + gameID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => data.json()).then((res) => {
        if(res.error){
            window.location.href = "/";
        }else{
            teams = res.teams;
            console.log(teams);

            if(!teams){
                return;
            }

            teamDivContainer.innerHTML = "";

            teams.forEach((team, index) => {
                let teamDiv = document.createElement("div");
                teamDiv.innerHTML = `<h3>${team.teamName}</h3><p>Answered: ${team.answered}</p>`;
                teamDiv.className = "teamDiv";
                teamDiv.id = team.teamName;
                teamDiv.onclick = () => { updateTeam( team.teamName, index) };
                teamDivContainer.appendChild(teamDiv);
            });

        }
    });
}

function updateTeam(e, i){
    loadTeams();
    fetch("/api/update/team?id=" + gameID, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            teamName: e,
        }),
    })
}