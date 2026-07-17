import express from "express";
import client from "prom-client";
import { config } from "./config";

const app = express();

client.collectDefaultMetrics();

app.get("/metrics", async (_, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/healthz", (_, res) => res.send("ok"));
app.get("/ready", (_, res) => res.send("ready"));

export function startMetricsServer() {
  app.listen(config.port, () => {
    console.log(`Metrics running on ${config.port}`);
  });
}