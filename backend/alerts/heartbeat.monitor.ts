import { getHeartbeats } from './heartbeat.store.js';
import alertService from "./alert.service.js";

const TIMEOUT = 90 * 1000;

export function startHeartbeatMonitor(): void {
  setInterval(() => {
    const clusters = getHeartbeats();

  }, 30000);
}
