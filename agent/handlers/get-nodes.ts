import { coreV1 } from "../k8s-client";

export async function getNodes() {
  const response =
    await coreV1.listNode();

  return response.body.items.map(
    (node) => ({
      name: node.metadata?.name,
      status:
        node.status?.conditions?.find(
          (condition) =>
            condition.type ===
            "Ready"
        )?.status === "True"
          ? "Ready"
          : "NotReady",
    })
  );
}