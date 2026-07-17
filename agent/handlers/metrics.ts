import { appsV1, coreV1 } from "../k8s-client";

export async function getClusterMetrics() {
  const [
    nodesRes,
    podsRes,
    deploymentsRes,
    namespacesRes,
    servicesRes,
  ] = await Promise.all([
    coreV1.listNode(),
    coreV1.listPodForAllNamespaces(),
    appsV1.listDeploymentForAllNamespaces(),
    coreV1.listNamespace(),
    coreV1.listServiceForAllNamespaces(),
  ]);

  const nodes = nodesRes.body.items;
  const pods = podsRes.body.items;
  const deployments =
    deploymentsRes.body.items;
  const namespaces =
    namespacesRes.body.items;
  const services =
    servicesRes.body.items;

  const readyNodes = nodes.filter((node) =>
    node.status?.conditions?.some(
      (condition) =>
        condition.type === "Ready" &&
        condition.status === "True"
    )
  ).length;

  const runningPods = pods.filter(
    (pod) =>
      pod.status?.phase === "Running"
  ).length;

  const pendingPods = pods.filter(
    (pod) =>
      pod.status?.phase === "Pending"
  ).length;

  const failedPods = pods.filter(
    (pod) =>
      pod.status?.phase === "Failed"
  ).length;

  const succeededPods = pods.filter(
    (pod) =>
      pod.status?.phase === "Succeeded"
  ).length;

  return {
    clusterHealth:
      readyNodes === nodes.length
        ? "Healthy"
        : "Degraded",

    summary: {
      totalNodes: nodes.length,
      readyNodes,

      totalPods: pods.length,
      runningPods,
      pendingPods,
      failedPods,
      succeededPods,

      totalDeployments:
        deployments.length,

      totalNamespaces:
        namespaces.length,

      totalServices:
        services.length,
    },

    nodes: nodes.map((node) => ({
      name: node.metadata?.name,

      cpu:
        node.status?.capacity?.cpu,

      memory:
        node.status?.capacity
          ?.memory,

      pods:
        node.status?.capacity
          ?.pods,

      architecture:
        node.status?.nodeInfo
          ?.architecture,

      os:
        node.status?.nodeInfo
          ?.operatingSystem,

      kubeletVersion:
        node.status?.nodeInfo
          ?.kubeletVersion,

      containerRuntime:
        node.status?.nodeInfo
          ?.containerRuntimeVersion,

      status: node.status?.conditions?.some(
        (condition) =>
          condition.type === "Ready" &&
          condition.status === "True"
      )
        ? "Ready"
        : "NotReady",
    })),
  };
}