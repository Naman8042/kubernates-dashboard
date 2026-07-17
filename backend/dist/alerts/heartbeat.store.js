// Using a Map with typed keys and values
const heartbeats = new Map();
export function updateHeartbeat(clusterId) {
    heartbeats.set(clusterId, Date.now());
}
export function getHeartbeats() {
    return heartbeats;
}
