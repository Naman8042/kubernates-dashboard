import { randomUUID } from "crypto";
import { prisma } from "../prisma/prisma.js";
export class ClusterService {
    static async createCluster(organizationId, name) {
        return prisma.cluster.create({
            data: {
                name,
                clusterToken: randomUUID(),
                organizationId,
            },
        });
    }
    static async getClusters(organizationId) {
        return prisma.cluster.findMany({
            where: {
                organizationId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async deleteCluster(clusterId, organizationId) {
        return prisma.cluster.deleteMany({
            where: {
                id: clusterId,
                organizationId,
            },
        });
    }
    static async getClusterById(clusterId, organizationId) {
        const cluster = await prisma.cluster.findFirst({
            where: {
                id: clusterId,
                organizationId,
            },
        });
        if (!cluster) {
            return null;
        }
        const rbacYaml = `
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kubechatops-agent
  namespace: kube-system

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubechatops-agent

rules:
- apiGroups: [""]
  resources:
  - pods
  - pods/log
  - nodes
  - events
  - namespaces
  verbs:
  - get
  - list
  - watch

- apiGroups: ["apps"]
  resources:
  - deployments
  verbs:
  - get
  - list
  - watch
  - patch

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubechatops-agent

subjects:
- kind: ServiceAccount
  name: kubechatops-agent
  namespace: kube-system

roleRef:
  kind: ClusterRole
  name: kubechatops-agent
  apiGroup: rbac.authorization.k8s.io
`;
        const deploymentYaml = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubechatops-agent
  namespace: kube-system

spec:
  replicas: 1

  selector:
    matchLabels:
      app: kubechatops-agent

  template:
    metadata:
      labels:
        app: kubechatops-agent

    spec:
      serviceAccountName: kubechatops-agent

      containers:
      - name: agent

        image: yourdockerhub/kubechatops-agent:latest

        env:
        - name: AGENT_TOKEN
          value: "${cluster.clusterToken}"

        - name: SERVER_URL
          value: "${process.env.SERVER_URL}"
`;
        return {
            ...cluster,
            rbacYaml,
            deploymentYaml,
        };
    }
}
export async function getOrganizationCluster(organizationId) {
    return prisma.cluster.findFirst({
        where: {
            organizationId,
            status: "online",
        },
    });
}
