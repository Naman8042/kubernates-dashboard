import { coreV1 } from "../k8s-client";

export async function clusterHealth() {
  const response =
    await coreV1.listNode();

  const nodes =
    response.body.items;

  const total =
    nodes.length;

  const ready = nodes.filter(
    (node) =>
      node.status?.conditions?.some(
        (condition) =>
          condition.type ===
            "Ready" &&
          condition.status ===
            "True"
      )
  ).length;

  return {
    totalNodes: total,
    readyNodes: ready,
    unhealthyNodes:
      total - ready,
    healthy:
      ready === total,
  };
}