

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const URL = 'https://server.matiks.com/api'; // Your own API endpoint
const TOTAL_REQUESTS = 200; // total requests to send
const CONCURRENT_BATCH = 20; // number of parallel requests per batch

const headers = {
  "accept": "*/*",
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Nzg4MDk4MDIsImlkIjoiNjgxZGI3OGY0ZWE2NmE0NjQ4YTNmOGU4In0.T4UDNVWQbMzkIZAv_BLY2-xuNZGVF2GfQ6u6GR5tPYE", // dummy value
  "content-type": "application/json",
  "x-timezone": "Asia/Calcutta",
};

const body = JSON.stringify({
  operationName: "StartSearching",
  variables: {
    gameConfig: {
      numPlayers: 2,
      timeLimit: 300,
      gameType: "PLAY_ONLINE"
    }
  },
  query: `mutation StartSearching($gameConfig: GameConfigInput) {
    startSearching(gameConfig: $gameConfig)
  }`
});

async function sendRequest(i) {
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers,
      body,
    });
    const json = await res.json();
    console.log(`[${i}] Response:`, JSON.stringify(json));
  } catch (err) {
    console.error(`[${i}] Error:`, err.message);
  }
}

async function runLoadTest() {
  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_BATCH) {
    const batch = Array.from({ length: CONCURRENT_BATCH }, (_, j) => sendRequest(i + j));
    await Promise.all(batch);
  }
}

runLoadTest();
