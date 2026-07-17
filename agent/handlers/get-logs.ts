import { coreV1 } from "../k8s-client";

interface GetLogsInput {
  namespace: string;
  podName: string;
}

export async function getLogs({
  namespace,
  podName,
}: GetLogsInput) {
  const response =
    await coreV1.readNamespacedPodLog(
      podName,
      namespace,
      undefined,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      200
    );

  return response.body;
}