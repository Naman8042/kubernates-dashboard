import { coreV1 } from "../k8s-client";

interface Input {
  namespace: string;
  podName: string;
}

export async function describePod({
  namespace,
  podName,
}: Input) {
  const response =
    await coreV1.readNamespacedPod(
      podName,
      namespace
    );

  const pod = response.body;

  return {
    name: pod.metadata?.name,
    namespace:
      pod.metadata?.namespace,
    node:
      pod.spec?.nodeName,
    podIP:
      pod.status?.podIP,
    hostIP:
      pod.status?.hostIP,
    phase:
      pod.status?.phase,
    startTime:
      pod.status?.startTime,
    containers:
      pod.spec?.containers.map(
        (container) => ({
          name: container.name,
          image:
            container.image,
        })
      ),
  };
}