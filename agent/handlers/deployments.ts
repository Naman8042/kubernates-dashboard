
import { appsV1 } from "../k8s-client";

export async function getDeployments(
  namespace?: string
) {
  const response = namespace
    ? await appsV1.listNamespacedDeployment(
        namespace
      )
    : await appsV1.listDeploymentForAllNamespaces();

  return response.body.items.map(
    (deployment) => ({
      name:
        deployment.metadata?.name,
      namespace:
        deployment.metadata?.namespace,
      replicas:
        deployment.spec?.replicas ?? 0,
      readyReplicas:
        deployment.status
          ?.readyReplicas ?? 0,
      availableReplicas:
        deployment.status
          ?.availableReplicas ?? 0,
      updatedReplicas:
        deployment.status
          ?.updatedReplicas ?? 0,
    })
  );
}

