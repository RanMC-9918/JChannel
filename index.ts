let express = require("express");
let path = require("path");

const app = express();
const PORT = 3000;

interface Team {
  teamName: string;
  boardSpace: number;
  hasSlowness: number;
  hasSpeed: number;
  hasLuck: number;
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

  games.push({
    teams: [],
    gameType: settings.gameType,
    gameTime: settings.gameTime,
    gameMaxPlayers: settings.gameMaxPlayers,
    gameID: id,
  });

  res.send(JSON.stringify({ gameID: id }));
});

app.get("/api/game", (req, res) => {
  let gameID = req.query.gameID;
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://172.20.10.6:${PORT}`);
});
