import { coreV1 } from "../k8s-client";

export async function getAlerts() {
  const res = await coreV1.listPodForAllNamespaces();

  const alerts: any[] = [];

  for (const pod of res.body.items) {
     console.log(
    pod.metadata?.name,
    pod.status?.phase,
    JSON.stringify(
      pod.status?.containerStatuses,
      null,
      2
    )
  );
    const namespace = pod.metadata?.namespace;
    const podName = pod.metadata?.name;

    for (const container of pod.status?.containerStatuses ?? []) {
      const waiting = container.state?.waiting;
      const terminated = container.state?.terminated;

      if (waiting) {
        alerts.push({
          severity:
            waiting.reason === "CrashLoopBackOff"
              ? "critical"
              : "warning",

          pod: podName,
          namespace,

          status: waiting.reason,
          message: waiting.message,
        });
      }

      if (
        terminated &&
        terminated.exitCode !== 0
      ) {
        alerts.push({
          severity: "critical",
          pod: podName,
          namespace,
          status:
            terminated.reason ??
            "Terminated",
          message: terminated.message,
        });
      }

      if (container.restartCount > 5) {
        alerts.push({
          severity: "warning",
          pod: podName,
          namespace,
          status: "HighRestartCount",
          message: `Restarted ${container.restartCount} times`,
        });
      }
    }
  }

  return alerts;
}