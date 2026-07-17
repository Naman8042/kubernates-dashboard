import * as k8s from "@kubernetes/client-node";

export const kc = new k8s.KubeConfig();

try {
  kc.loadFromCluster();
} catch {
  kc.loadFromDefault();
}

export const coreV1 = kc.makeApiClient(k8s.CoreV1Api);
export const appsV1 = kc.makeApiClient(k8s.AppsV1Api);