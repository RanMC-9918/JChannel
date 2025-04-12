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
}

let games: Game[];

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

app.post("/api/create/game", (req, res) => {
  let settings = req.body;

  games.push({
    teams: settings.teams,
    gameType: settings.gameType,
    gameTime: settings.gameTime,
    gameMaxPlayers: settings.gameMaxPlayers,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://172.20.10.6:${PORT}`);
});
