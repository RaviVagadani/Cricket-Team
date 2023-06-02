const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Sever is running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
module.exports = app;

const converting = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const playersDetails = `SELECT * FROM cricket_team`;
  const playersArray = await db.all(playersDetails);
  response.send(playersArray.map((eachPlayer) => converting(eachPlayer)));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await database.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerArray = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const object = await db.get(playerArray);
  response.send(converting(object));
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = `UPDATE cricket_team
    SET
    player_id=${playersId},
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE player_id = ${player_id}`;
  await db.run(update);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerId = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(deletePlayerId);
  response.send("Player Removed");
});
