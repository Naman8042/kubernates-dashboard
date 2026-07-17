
import { coreV1 } from "../k8s-client";

export async function getPods(
  namespace?: string
) {
  const response = namespace
    ? await coreV1.listNamespacedPod(
        namespace
      )
    : await coreV1.listPodForAllNamespaces();

  return response.body.items.map(
    (pod) => ({
      name: pod.metadata?.name,
      namespace:
        pod.metadata?.namespace,
      status:
        pod.status?.phase,
      node:
        pod.spec?.nodeName,
      podIP:
        pod.status?.podIP,
      startTime:
        pod.status?.startTime,
    })
  );
}

