let express = require("express");
let path = require("path");

const app = express();
const PORT = 3000;

interface Team {
  teamName: string;
  boardSpace: number;
  speed: number;
  answered: number;
}

//slowness: 0
//speed: 1
//luck: 2

interface Game {
  teams: Team[];
  gameType: string;
  gameTime: number;
  gameMaxPlayers: number;
  gameID: number;
  squares: number[];
}

let games: Game[] = [];

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "views")));

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/join", (req, res) => {
  res.render(path.join("join", "index"));
});

app.get("/game", (req, res) => {
  res.render("game");
});

app.get("/create", (req, res) => {
  res.render(path.join("create", "index"));
});

app.get("/create/game", (req, res) => {
  res.render(path.join("create", "game"));
});

app.get("/dashboard/:id", (req, res) => {
  let gameID = req.params.id;
  console.log(gameID);
  res.render(path.join("dashboard", "index"), {
    gameID
  });
});

app.post("/api/create/game", (req, res) => {
  let settings = req.body;

  if(!settings) {
    console.warn("No settings provided");
    return;
  }

  let id = Math.floor(Math.random() * 1000000); // Generate a random game ID

  while(id.toString().length < 6){
    console.log("regenerating: " + id);
    id = Math.floor(Math.random() * 1000000);
    console.log("regenerating: " + id)
  }

  if(!settings.gameType) {
    console.warn("No gametype");
    return;
  }
  if(!settings.gameTime) {
    console.warn("No gametime");
    return;
  }
  if(!settings.gameMaxPlayers) {
    console.warn("No max players");
    return;
  }

  if(!settings.squaresLength){
    console.warn("No squares length");
  }

  let squares:number[] = [];

  for(let i = 0; i < settings.squaresLength; i++){
    if(Math.random() > 0.8){
      squares.push(Math.floor((Math.random()-0.5)*10));
      console.log("sdfsd");
    }
    else{
      squares.push(0);
      console.log("s");
    }
  }

  games.push({
    teams: [],
    gameType: settings.gameType,
    gameTime: settings.gameTime,
    gameMaxPlayers: settings.gameMaxPlayers,
    gameID: id,
    squares
  });

  res.send(JSON.stringify({ gameID: id }));
});

app.get("/api/game", (req, res) => {
  let gameID = req.query.id;
  if (!gameID) {
    console.warn("No game ID provided");
    return;
  }

  let game = games.find((game) => game.gameID == gameID);
  if (!game) {
    console.warn("Game not found");
    return;
  }

  res.send(JSON.stringify(game));
});

app.post("/api/create/team", (req, res) => {
  let gameID = req.body.gameID;
  let teamName = req.body.teamName;

  if (!gameID) {
    console.warn("No game ID provided");
    return;
  }
  if (!teamName) {
    console.warn("No teams provided");
    return;
  }

  let game = games.find((game) => game.gameID == gameID);

  if (!game) {
    console.warn("Game not found");
    return;
  }

  game.teams.push({
    teamName,
    boardSpace: 0,
    speed: 0,
    answered: 0,
  });

  console.log("Team Created: " + teamName)

  res.send(JSON.stringify({ success: true }));
});

app.post("/api/update/team", (req, res) => {
  let gameID = req.query.id;
  let teamName = req.body.teamName;

  let game = games.find((game) => game.gameID == gameID);

  if(!game){
    return;
  }

  let team = game.teams.find((team) => team.teamName == teamName);

  if(!team){
    console.warn("No team with name: " + teamName);
    return;
  }

  team.answered++;


})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://172.20.10.6:${PORT}`);
});
