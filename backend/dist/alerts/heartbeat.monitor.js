import { getHeartbeats } from './heartbeat.store.js';
const TIMEOUT = 90 * 1000;
export function startHeartbeatMonitor() {
    setInterval(() => {
        const clusters = getHeartbeats();
    }, 30000);
}
