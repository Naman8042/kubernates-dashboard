const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("✅ Agent connected");

  ws.on("message", (msg) => {
    console.log("📩 Received:", msg.toString());
  });

  // send test command
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: "GET_PODS",
      requestId: "1"
    }));
  }, 2000);
});

console.log("🚀 WebSocket running on ws://localhost:8080");