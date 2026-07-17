export const config = {
  serverUrl: process.env.SERVER_URL || "ws://localhost:8080",
  token: process.env.AGENT_TOKEN,
  port: Number(process.env.PORT || 9090)
};

if (!config.token) {
  throw new Error("AGENT_TOKEN is required");
}