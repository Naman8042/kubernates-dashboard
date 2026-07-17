import express from "express";
import { createServer } from "http";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cron from "node-cron";
// Configuration and Infrastructure Imports
import { PORT } from "./config.js";
import { initWS } from "./websockets/ws.server.js";
import { startHeartbeatMonitor } from "./alerts/heartbeat.monitor.js";
import { initTelegramBot } from "./telegram/telegram.service.js";
import { initSlackBot } from "./slack/slack.service.js";
import { initDiscordBot } from "./discord/discord.service.js";
// Middleware Imports
import auth from "./middleware/auth.js";
import errorHandler from "./middleware/error.js";
// Route Imports
import alertsRoutes from "./alerts/alerts.routes.js";
import createPodsRouter from "./routes/pods.routes.js";
import createDeploymentsRouter from "./routes/deployments.routes.js";
import createReplicaSetRouter from "./routes/replicaset.routes.js";
import createLogsRouter from "./routes/logs.routes.js";
import createEventsRouter from "./routes/events.routes.js";
import createActionsRouter from "./routes/actions.routes.js";
import authRoutes from "./auth/auth.routes.js";
import clusterRoutes from "./cluster/cluster.routes.js";
import integrationRoutes from "./integration/integration.routes.js";
import createMetricsRouter from "./routes/metric.routes.js";
import ExecuteCommands from './routes/executecommands.js';
import { syncAlerts } from "./services/alert-monitor.js";
const app = express();
// Global Middleware Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     crossOriginOpenerPolicy: { policy: "unsafe-none" }
//   })
// );
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// Initialize HTTP & WebSocket Infrastructure
const server = createServer(app);
initWS(server);
startHeartbeatMonitor();
initTelegramBot();
await initSlackBot();
await initDiscordBot();
// Kubernetes Feature Routes
app.use("/pods", auth, createPodsRouter());
app.use("/api/deployments", auth, createDeploymentsRouter());
app.use("/replicasets", auth, createReplicaSetRouter());
app.use("/logs", auth, createLogsRouter());
app.use("/api/events", auth, createEventsRouter());
app.use("/actions", auth, createActionsRouter());
app.use("/api/auth", authRoutes);
app.use("/api/clusters", clusterRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/metrics", createMetricsRouter());
app.use("/api", ExecuteCommands);
// Alerts Monitoring Route
app.use("/api/alerts", alertsRoutes);
// Base Health Check Route
app.get("/", (_req, res) => {
    res.send("K8s Backend Running");
});
cron.schedule("*/30 * * * * *", async () => {
    await syncAlerts();
});
// Global Error Handler (must be registered last)
app.use(errorHandler);
// Boot Server
server.listen(PORT, () => {
    console.log(`🚀 Running on http://localhost:${PORT}`);
});
