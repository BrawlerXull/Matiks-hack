const WebSocket = require("ws");

const url =
  "wss://server.matiks.com/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Nzg2MjE0MTQsImlkIjoiNjgyMjY4NjVhZGU3MmNjMzY5ODUyNzAzIn0.IStZ7f0Em9_-Ut-tmM5J5luDYmcCr7Gt4AciuIXsb-c";

//   {
//     "type": "message",
//     "channel": "",
//     "data": "{\"game\":{\"_id\":\"68253412f32efad1e3380f56\",\"config\":{\"timeLimit\":300,\"numPlayers\":2,\"gameType\":\"PLAY_ONLINE\"},\"gameStatus\":\"STARTED\",\"leaderBoard\":[{\"userId\":\"68253412f32efad1e3380f55\",\"correct\":3,\"incorrect\":0,\"totalPoints\":12,\"rank\":1},{\"userId\":\"68226865ade72cc369852703\",\"correct\":1,\"incorrect\":0,\"totalPoints\":4,\"rank\":2}],\"players\":[{\"userId\":\"68226865ade72cc369852703\",\"rating\":965,\"statikCoins\":17,\"status\":\"ACCEPTED\",\"timeLeft\":null},{\"userId\":\"68253412f32efad1e3380f55\",\"rating\":917,\"status\":\"ACCEPTED\",\"timeLeft\":null}],\"userSubmissionsWithQuestion\":null},\"event\":\"CORRECT_MOVE_MADE\"}"
// }
const baseMessage = {
  type: "submitAnswer",
  data: {
    gameId: "68254449f32efad1e3381355",
    questionId: "68226865ade72cc369852703_", // we'll add suffix here
    submittedValue: "10",
    timeOfSubmission: Date.now(), // will update
    isCorrect: true,
    incorrectAttempts: 0,
    userId: "68226865ade72cc369852703",
  },
  channel: "GAME_EVENT_68254449f32efad1e3381355_V2",
};

const ws = new WebSocket(url);

ws.on("open", () => {
  console.log("Connected to WebSocket");

  let counter = 0;

  setInterval(() => {
    const message = JSON.parse(JSON.stringify(baseMessage)); // deep clone
    message.data.questionId = baseMessage.data.questionId + counter;
    message.data.timeOfSubmission = Date.now();

    ws.send(JSON.stringify(message));
    console.log("Sent message with questionId:", message.data.questionId);

    counter++;
  }, 1000);
});

ws.on("message", (data) => {
  console.log("Received:", data.toString());
});

ws.on("error", (err) => {
  console.error("WebSocket error:", err);
});

ws.on("close", () => {
  console.log("WebSocket closed");
});
