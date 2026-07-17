import { send } from "../websockets/sender.js";
import { prisma } from "../prisma/prisma.js";

export async function handleDiscordCommand(
  text: string,
  guildId: string,
   channelId: string
) {
  const parts =
    text.trim().split(" ");

  const command =
    parts[0];
  
  // =====================
  // LINK DISCORD SERVER
  // =====================

  if (command === "start") {
    const code =
      parts[1];

    if (!code) {
      return `
🤖 KubeChatOps

Generate a code from:

Dashboard
→ Integrations
→ Discord

Then send:

!start YOUR_CODE
`;
    }

    const existing =
      await prisma.integration.findFirst({
        where: {
          platform:
            "discord",
          externalId:
            guildId,
        },
      });

    if (existing) {
      return `
✅ This Discord server is already linked

Organization:
${existing.organizationId}
`;
    }

    const request =
      await prisma.integrationRequest.findUnique({
        where: {
          code,
        },
      });

    if (!request) {
      return "❌ Invalid code";
    }

    if (request.used) {
      return "❌ Code already used";
    }

    if (
      request.expiresAt <
      new Date()
    ) {
      return "❌ Code expired";
    }

    await prisma.integration.create({
  data: {
    platform: "discord",

    // Discord Server ID
    externalId: guildId,

    // Where alerts should be sent
    channelId,

    username: `discord-${guildId}`,

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

    return `
✅ Discord Connected Successfully

You can now use:

!pods
!deployments
!nodes
!events
!logs
!restart
!kubectl
!whoami
!help
`;
  }

  // =====================
  // VERIFY
  // =====================

  const integration =
    await prisma.integration.findFirst({
      where: {
        platform:
          "discord",

        externalId:
          guildId,

        verified:
          true,
      },
    });

  if (!integration) {
    return `
❌ Discord server not linked

Generate a code from dashboard and run:

!start YOUR_CODE
`;
  }

  const cluster =
    await prisma.cluster.findFirst({
      where: {
        organizationId:
          integration.organizationId,
      },
    });

  if (!cluster) {
    return `
❌ No cluster found
`;
  }

  const token =
    cluster.clusterToken;

  switch (command) {
    case "pods": {
      const pods = await send(token, {
        type: "GET_PODS",
      });

      if (!pods?.length) {
        return "📦 No pods found";
      }

      return pods
        .map(
          (pod: any) =>
            `📦 ${pod.name}
🌐 ${pod.namespace}
📊 ${pod.status}`,
        )
        .join("\n\n");
    }

    case "deployments": {
      const deployments = await send(token, {
        type: "GET_DEPLOYMENTS",
      });

      if (!deployments?.length) {
        return "🚀 No deployments found";
      }

      return deployments
        .map(
          (deployment: any) =>
            `🚀 ${deployment.name}
🌐 ${deployment.namespace}
✅ ${deployment.readyReplicas || 0}/${deployment.replicas || 0}`,
        )
        .join("\n\n");
    }

    case "nodes": {
      const nodes = await send(token, {
        type: "GET_NODES",
      });

      if (!nodes?.length) {
        return "🖥️ No nodes found";
      }

      return nodes
        .map(
          (node: any) =>
            `🖥️ ${node.name}
📊 ${node.status}`,
        )
        .join("\n\n");
    }

    case "events": {
      const events = await send(token, {
        type: "GET_EVENTS",
      });

      if (!events?.length) {
        return "📋 No events found";
      }

      return events
        .slice(0, 20)
        .map(
          (event: any) =>
            `⚠️ ${event.reason}
🌐 ${event.namespace}
📝 ${event.message}`,
        )
        .join("\n\n");
    }

    case "logs": {
      const namespace = parts[1];
      const podName = parts[2];

      if (!namespace || !podName) {
        return `
Usage:

!logs <namespace> <pod-name>

Example:

!logs kube-system coredns
`;
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
      } else if (result && typeof result === "object") {
        logText = result.logs || JSON.stringify(result, null, 2);
      } else {
        logText = "No logs available";
      }

      // Split into log entries
      const entries =
        logText.match(
          /\[(?:info|error|warn|debug)\][\s\S]*?(?=\n\[(?:info|error|warn|debug)\]|\s*$)/g
        ) || [];

      // Keep only the latest 5 entries
      logText = entries.slice(-5).join("\n\n");

      // Discord message limit (2000 characters)
      if (logText.length > 1900) {
        logText = logText.substring(0, 1900) + "\n\n...truncated";
      }

      return `
📜 Logs for ${podName}

${logText}
`;
    }

    case "restart": {
      const namespace = parts[1];
      const deployment = parts[2];

      if (!namespace || !deployment) {
        return `
Usage:

!restart <namespace> <deployment>

Example:

!restart default nginx
`;
      }

      await send(token, {
        type: "RESTART_DEPLOYMENT",
        payload: {
          namespace,
          deployment,
        },
      });

      return `
✅ Restart Triggered

Namespace: ${namespace}
Deployment: ${deployment}
`;
    }

    case "kubectl": {
      const kubectlCommand = parts.slice(1).join(" ").trim();

      if (!kubectlCommand) {
        return `
Usage:

!kubectl <command>

Examples:

!kubectl get pods

!kubectl get pods -A

!kubectl get deployments

!kubectl get nodes

!kubectl get svc

!kubectl describe pod nginx -n default

!kubectl logs nginx -n default

!kubectl top nodes

!kubectl top pods
`;
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
        } else if (result && typeof result === "object") {
          output =
            result.output ||
            result.result ||
            result.logs ||
            JSON.stringify(result, null, 2);
        } else {
          output = "No output";
        }

        // Discord message limit (2000 characters)
        if (output.length > 1900) {
          output =
            output.substring(0, 1900) +
            "\n\n...truncated";
        }

        return `
💻 kubectl ${kubectlCommand}

${output}
`;
      } catch (err: any) {
        return `
❌ kubectl command failed

${err.message}
`;
      }
    }

    case "whoami":
      return `
👤 Discord Server

Guild ID:
${guildId}

Organization:
${integration.organizationId}

Cluster:
${cluster.id}

Verified:
YES
`;

    case "help":
      return `
🤖 KubeChatOps

Available Commands:

!pods
!deployments
!nodes
!events
!logs <namespace> <pod>
!restart <namespace> <deployment>
!kubectl <command>
!whoami
!start <CODE>
!help

Examples:
!logs kube-system coredns
!restart default nginx
!kubectl get pods
`;

    default:
      return "❌ Unknown command. Use !help";
  }
}