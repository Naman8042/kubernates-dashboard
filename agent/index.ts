import { startWebSocket } from "./websocket"
import { startMetricsServer } from "./metrics"
import { logger } from "./logger";

async function main() {
  logger.info("Starting Kubernetes Agent");

  startMetricsServer();
  startWebSocket();
}

main();