import WebSocket from "ws";

import { config } from "./config";
import { logger } from "./logger";

import { RECONNECT_DELAY, HEARTBEAT_INTERVAL } from "./constants";

import { getPods } from "./handlers/pods";
import { getDeployments } from "./handlers/deployments";
import { getLogs } from "./handlers/logs";
import { getEvents } from "./handlers/events";

import { getNodes } from "./handlers/get-nodes";
import { describePod } from "./handlers/describe-pods";
import { describeDeployment } from "./handlers/descibe-deployments";
import { restartDeployment } from "./handlers/restart-deployments";
import { clusterHealth } from "./handlers/cluster-health";
import { getAlerts } from "./handlers/alerts";
import { executeKubectl } from "./handlers/safe-kubectl";
import {getClusterMetrics} from'./handlers/metrics'

let ws: WebSocket;
let heartbeat: NodeJS.Timeout | null = null;

export function startWebSocket() {
  connect();
}

function connect() {
  logger.info(`Connecting to ${config.serverUrl}`);

  ws = new WebSocket(config.serverUrl);

  ws.on("open", () => {
    logger.info("Connected to server");

    ws.send(
      JSON.stringify({
        type: "AUTH",
        token: config.token,
      }),
    );

    if (heartbeat) {
      clearInterval(heartbeat);
    }

    heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "PING",
          }),
        );
      }
    }, HEARTBEAT_INTERVAL);
  });

  ws.on("message", async (message) => {
    let data: any;

    try {
      data = JSON.parse(message.toString());

      let result: any;

      switch (data.type) {
        case "PING":
          ws.send(
            JSON.stringify({
              type: "PONG",
            }),
          );
          return;

        case "GET_PODS":
          result = await getPods(data.payload?.namespace);
          break;
        
        case "GET_METRICS":
          result = await getClusterMetrics();
          break;  

        case "GET_DEPLOYMENTS":
          result = await getDeployments(data.payload?.namespace);
          break;

        case "GET_NODES":
          result = await getNodes();
          break;

        case "GET_EVENTS":
          result = await getEvents(data.payload?.namespace);
          break;

        case "GET_LOGS":
          result = await getLogs({
            namespace: data.payload.namespace,
            podName: data.payload.podName,
          });
          break;

        case "DESCRIBE_POD":
          result = await describePod({
            namespace: data.payload.namespace,
            podName: data.payload.podName,
          });
          break;

        case "DESCRIBE_DEPLOYMENT":
          result = await describeDeployment({
            namespace: data.payload.namespace,
            deployment: data.payload.deployment,
          });
          break;

        case "RESTART_DEPLOYMENT":
          result = await restartDeployment({
            namespace: data.payload.namespace,
            deployment: data.payload.deployment,
          });
          break;

        case "CLUSTER_HEALTH":
          result = await clusterHealth();
          break;

        case "GET_ALERTS":
          result = await getAlerts();
          break;

        case "KUBECTL":
          result = executeKubectl(data.payload.command);
          break;

        default:
          logger.info(`Unknown command: ${data.type}`);

          return;
      }

      ws.send(
        JSON.stringify({
          type: "RESPONSE",
          requestId: data.requestId,
          data: result,
        }),
      );
    } catch (error: any) {
      logger.error("Message handling error", error);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            requestId: data?.requestId,
            error: error?.message ?? "Unknown error",
          }),
        );
      }
    }
  });

  ws.on("close", () => {
    logger.info("Disconnected from server");

    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }

    setTimeout(connect, RECONNECT_DELAY);
  });

  ws.on("error", (error) => {
    logger.error("WebSocket error", error);
  });
}
