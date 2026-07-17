// Using a Map with typed keys and values
const heartbeats = new Map<string, number>();

export function updateHeartbeat(clusterId: string): void {
  heartbeats.set(clusterId, Date.now());
}

export function getHeartbeats(): Map<string, number> {
  return heartbeats;
}
