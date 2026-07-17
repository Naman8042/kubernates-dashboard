import { coreV1 } from "../k8s-client";

export async function getPods(
  namespace?: string
) {
  const response = namespace
    ? await coreV1.listNamespacedPod(namespace)
    : await coreV1.listPodForAllNamespaces();

  return response.body.items.map((pod) => ({
    name: pod.metadata?.name,
    namespace: pod.metadata?.namespace,

    status: pod.status?.phase,

    node: pod.spec?.nodeName,

    ip: pod.status?.podIP,

    restarts:
      pod.status?.containerStatuses?.reduce(
        (sum, container) =>
          sum + container.restartCount,
        0
      ) || 0,

    createdAt:
      pod.metadata?.creationTimestamp,

    ready:
      pod.status?.containerStatuses?.every(
        (container) => container.ready
      ) || false,
  }));
}