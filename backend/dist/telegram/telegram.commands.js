import { send } from "../websockets/sender.js";
import { prisma } from "../prisma/prisma.js";
const DIVIDER = "----------------------------------------";
export async function handleTelegramCommand(text, chatId) {
    const parts = text.trim().split(" ");
    const command = parts[0];
    // ====================================
    // TELEGRAM LINKING
    // ====================================
    if (command === "/start") {
        const code = parts[1];
        if (!code) {
            return `KubeChatOps

To link this Telegram account, generate a code from:
Dashboard > Integrations > Telegram

Then send:
/start YOUR_CODE`;
        }
        const existingIntegration = await prisma.integration.findFirst({
            where: {
                platform: "telegram",
                externalId: chatId,
            },
        });
        if (existingIntegration) {
            return `This Telegram account is already linked.

Organization ID: ${existingIntegration.organizationId}`;
        }
        const request = await prisma.integrationRequest.findUnique({
            where: {
                code,
            },
        });
        if (!request) {
            return "Invalid code. Please check the code and try again.";
        }
        if (request.used) {
            return "This code has already been used.";
        }
        if (request.expiresAt < new Date()) {
            return "This code has expired. Please generate a new one from the dashboard.";
        }
        await prisma.integration.create({
            data: {
                platform: "telegram",
                externalId: chatId,
                username: `telegram-${chatId}`,
                verified: true,
                organizationId: request.organizationId,
            },
        });
        await prisma.integrationRequest.update({
            where: {
                id: request.id,
            },
            data: {
                used: true,
            },
        });
        return `Telegram account connected successfully.

Available commands:
/pods
/deployments
/nodes
/events
/whoami
/help`;
    }
    // ====================================
    // VERIFY LINKED ACCOUNT
    // ====================================
    const integration = await prisma.integration.findFirst({
        where: {
            platform: "telegram",
            externalId: chatId,
            verified: true,
        },
    });
    if (!integration) {
        return `This Telegram account is not linked.

Go to Dashboard > Integrations > Telegram to generate a code, then send:
/start YOUR_CODE`;
    }
    // ====================================
    // FIND CLUSTER
    // ====================================
    const cluster = await prisma.cluster.findFirst({
        where: {
            organizationId: integration.organizationId,
        },
    });
    if (!cluster) {
        return "No cluster found for your organization.";
    }
    const token = cluster.clusterToken;
    // ====================================
    // COMMANDS
    // ====================================
    switch (command) {
        case "/pods": {
            const pods = await send(token, {
                type: "GET_PODS",
            });
            if (!pods?.length) {
                return "No pods found.";
            }
            const list = pods
                .map((pod, i) => `${i + 1}. ${pod.name}\n   Namespace: ${pod.namespace}\n   Status: ${pod.status}`)
                .join("\n\n");
            return `Pods (${pods.length})\n${DIVIDER}\n${list}`;
        }
        case "/deployments": {
            const deployments = await send(token, {
                type: "GET_DEPLOYMENTS",
            });
            if (!deployments?.length) {
                return "No deployments found.";
            }
            const list = deployments
                .map((deployment, i) => `${i + 1}. ${deployment.name}\n   Namespace: ${deployment.namespace}\n   Ready: ${deployment.readyReplicas || 0}/${deployment.replicas || 0}`)
                .join("\n\n");
            return `Deployments (${deployments.length})\n${DIVIDER}\n${list}`;
        }
        case "/nodes": {
            const nodes = await send(token, {
                type: "GET_NODES",
            });
            if (!nodes?.length) {
                return "No nodes found.";
            }
            const list = nodes
                .map((node, i) => `${i + 1}. ${node.name}\n   Status: ${node.status}`)
                .join("\n\n");
            return `Nodes (${nodes.length})\n${DIVIDER}\n${list}`;
        }
        case "/events": {
            const events = await send(token, {
                type: "GET_EVENTS",
            });
            if (!events?.length) {
                return "No events found.";
            }
            const list = events
                .slice(0, 20)
                .map((event, i) => `${i + 1}. ${event.reason}\n   Namespace: ${event.namespace}\n   ${event.message}`)
                .join("\n\n");
            return `Recent Events\n${DIVIDER}\n${list}`;
        }
        case "/logs": {
            const namespace = parts[1];
            const podName = parts[2];
            if (!namespace || !podName) {
                return `Usage:
/logs <namespace> <pod-name>

Example:
/logs kube-system coredns`;
            }
            const result = await send(token, {
                type: "GET_LOGS",
                payload: {
                    namespace,
                    podName,
                },
            });
            let logText = "";
            if (typeof result === "string") {
                logText = result;
            }
            else if (result && typeof result === "object") {
                logText = result.logs || JSON.stringify(result, null, 2);
            }
            else {
                logText = "No logs available";
            }
            // Split into individual log entries and keep only the latest 5
            const entries = logText.match(/\[(?:info|error|warn|debug)\][\s\S]*?(?=\n\[(?:info|error|warn|debug)\]|\s*$)/g) || [];
            logText = entries.slice(-5).join("\n\n");
            // Telegram message limit
            if (logText.length > 3500) {
                logText = logText.substring(0, 3500) + "\n\n...(truncated)";
            }
            return `Logs: ${podName} (${namespace})\n${DIVIDER}\n${logText}`;
        }
        case "/restart": {
            const namespace = parts[1];
            const deployment = parts[2];
            if (!namespace || !deployment) {
                return `Usage:
/restart <namespace> <deployment>

Example:
/restart default nginx`;
            }
            await send(token, {
                type: "RESTART_DEPLOYMENT",
                payload: {
                    namespace,
                    deployment,
                },
            });
            return `Restart triggered.

Namespace: ${namespace}
Deployment: ${deployment}`;
        }
        case "/whoami": {
            return `Account Details
${DIVIDER}
Chat ID: ${chatId}
Platform: ${integration.platform}
Organization ID: ${integration.organizationId}
Verified: ${integration.verified ? "Yes" : "No"}
Cluster: ${cluster.name}`;
        }
        case "/help": {
            return `Kubernetes ChatOps Bot
${DIVIDER}
/pods
/deployments
/nodes
/events

/logs <namespace> <pod>
  e.g. /logs kube-system coredns

/restart <namespace> <deployment>
  e.g. /restart default nginx

/kubectl <command>
  e.g. /kubectl get pods -A

/whoami
/help`;
        }
        case "/kubectl": {
            const kubectlCommand = parts.slice(1).join(" ").trim();
            if (!kubectlCommand) {
                return `Usage:
/kubectl <command>

Examples:
/kubectl get pods
/kubectl get pods -A
/kubectl get deployments
/kubectl get nodes
/kubectl get svc
/kubectl describe pod nginx -n default
/kubectl logs nginx -n default
/kubectl top nodes
/kubectl top pods`;
            }
            try {
                const result = await send(token, {
                    type: "KUBECTL",
                    payload: {
                        command: kubectlCommand,
                    },
                });
                let output = "";
                if (typeof result === "string") {
                    output = result;
                }
                else if (result && typeof result === "object") {
                    output =
                        result.output ||
                            result.result ||
                            result.logs ||
                            JSON.stringify(result, null, 2);
                }
                else {
                    output = "No output";
                }
                // Telegram message limit
                if (output.length > 3500) {
                    output = output.substring(0, 3500) + "\n\n...(truncated)";
                }
                return `$ kubectl ${kubectlCommand}\n${DIVIDER}\n${output}`;
            }
            catch (err) {
                return `Command failed: kubectl ${kubectlCommand}\n${DIVIDER}\n${err.message}`;
            }
        }
        default:
            return "Unknown command. Send /help for a list of available commands.";
    }
}
