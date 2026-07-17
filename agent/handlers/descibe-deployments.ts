import { appsV1 } from "../k8s-client";

interface Input {
  namespace: string;
  deployment: string;
}

export async function describeDeployment({
  namespace,
  deployment,
}: Input) {
  const response =
    await appsV1.readNamespacedDeployment(
      deployment,
      namespace
    );

  const dep = response.body;

  const conditions =
    dep.status?.conditions || [];

  let status = "Unknown";

  const progressing = conditions.find(
    (c) => c.type === "Progressing"
  );

  const available = conditions.find(
    (c) => c.type === "Available"
  );

  if (
    available?.status === "True" &&
    progressing?.status === "True"
  ) {
    status = "Running";
  } else if (
    progressing?.reason ===
    "ProgressDeadlineExceeded"
  ) {
    status = "Failed";
  } else if (
    dep.status?.readyReplicas === 0
  ) {
    status = "Pending";
  } else {
    status = "Updating";
  }

  return {
    name: dep.metadata?.name,
    namespace: dep.metadata?.namespace,

    replicas: dep.spec?.replicas ?? 0,
    readyReplicas:
      dep.status?.readyReplicas ?? 0,
    availableReplicas:
      dep.status?.availableReplicas ?? 0,
    updatedReplicas:
      dep.status?.updatedReplicas ?? 0,

    status,
  };
}