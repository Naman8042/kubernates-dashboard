import { prisma } from "../prisma/prisma.js";
import { send } from "../websockets/sender.js";
import { sendTelegramAlert } from "../telegram/telegram.alerts.js";

import { sendDiscordAlert } from "../discord/discord.alerts.js";
type Cluster = {
    id: number;
    name: string;
    clusterToken: string;
    status: string;
    lastSeen: Date | null;
    organizationId: number;
    createdAt: Date;
};

type Alert = {
    id: string;
    clusterId: number;
    organizationId: number;
    namespace: string;
    pod: string;
    severity: string | null;
    status: string;
    message: string | null;
    active: boolean;
    lastSeenAt: Date;
    lastAlertSentAt: Date;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};


// Define types for the alert from websocket
interface WebSocketAlert {
    namespace: string;
    pod: string;
    status: string;
    severity?: string;
    message?: string;
}

// Define type for cluster with relations
interface ClusterWithRelations extends Cluster {
    organizationId: number;
}

export async function syncAlerts(): Promise<void> {
  console.log("Alerts function called");

  const clusters = await prisma.cluster.findMany();

  for (const cluster of clusters) {
    const alerts = await send(cluster.clusterToken, {
      type: "GET_ALERTS",
    });

    if (!Array.isArray(alerts)) {
      continue;
    }

    const currentKeys = new Set<string>();

    for (const alert of alerts as WebSocketAlert[]) {
      const key = `${alert.namespace}:${alert.pod}:${alert.status}`;

      currentKeys.add(key);

      const existing = await prisma.alert.findUnique({
        where: {
          clusterId_namespace_pod_status: {
            clusterId: cluster.id,
            namespace: alert.namespace,
            pod: alert.pod,
            status: alert.status,
          },
        },
      });

      // -----------------------------
      // First time alert
      // -----------------------------
      if (!existing) {
        await prisma.alert.create({
          data: {
            clusterId: cluster.id,
            organizationId: cluster.organizationId,

            namespace: alert.namespace,
            pod: alert.pod,

            severity: alert.severity,
            status: alert.status,
            message: alert.message,

            active: true,
            lastSeenAt: new Date(),
            lastAlertSentAt: new Date(),
          },
        });

        await sendAlerts(cluster, alert, "new");

        continue;
      }

      // -----------------------------
      // Alert became active again
      // -----------------------------
      if (!existing.active) {
        await prisma.alert.update({
          where: {
            id: existing.id,
          },
          data: {
            active: true,
            lastSeenAt: new Date(),
            lastAlertSentAt: new Date(),
            resolvedAt: null,
          },
        });

        await sendAlerts(cluster, alert, "new");

        continue;
      }

      // -----------------------------
      // Existing active alert
      // -----------------------------
      await prisma.alert.update({
        where: {
          id: existing.id,
        },
        data: {
          lastSeenAt: new Date(),
        },
      });

      const now = new Date();

      const oneHourAgo = new Date(
        now.getTime() - 60 * 60 * 1000
      );

      if (
        !existing.lastAlertSentAt ||
        existing.lastAlertSentAt <= oneHourAgo
      ) {
        await sendAlerts(cluster, alert, "update");

        await prisma.alert.update({
          where: {
            id: existing.id,
          },
          data: {
            lastAlertSentAt: now,
          },
        });
      }
    }

    // ------------------------------------
    // Alert disappeared
    // Do NOT send resolved notification
    // ------------------------------------

    const activeAlerts = await prisma.alert.findMany({
      where: {
        clusterId: cluster.id,
        active: true,
      },
    });

    for (const dbAlert of activeAlerts) {
      const key = `${dbAlert.namespace}:${dbAlert.pod}:${dbAlert.status}`;

      if (!currentKeys.has(key)) {
        await prisma.alert.update({
          where: {
            id: dbAlert.id,
          },
          data: {
            active: false,
            resolvedAt: new Date(),
          },
        });
      }
    }
  }
}

// Helper function to send alerts to both Telegram and Discord
async function sendAlerts(
    cluster: ClusterWithRelations, 
    alert: WebSocketAlert, 
    type: "new" | "update"
): Promise<void> {
    const organizationId = cluster.organizationId;
    const alertType = type === "new" ? "New Alert" : "Alert Still Active";

    // Get all verified integrations for this organization
    const integrations = await prisma.integration.findMany({
        where: {
            organizationId: organizationId,
            verified: true,
        },
    });

    // Separate Telegram and Discord integrations
    const telegramUsers = integrations.filter(i => i.platform === "telegram");
    const discordChannels = integrations.filter(i => i.platform === "discord");

    // Format alert message
const alertMessage = `
${alertType}

Cluster: ${cluster.name}

Namespace: ${alert.namespace}

Pod: ${alert.pod}

Status: ${alert.status}

Severity: ${alert.severity || "N/A"}

${alert.message ? `Message: ${alert.message}` : ""}

${
  type === "update"
    ? "⏰ This alert is still active after 1 hour."
    : ""
}
`;

    // Send to Telegram
    for (const user of telegramUsers) {
        try {
            await sendTelegramAlert(user.externalId, alertMessage);
        } catch (error) {
            console.error(`Failed to send Telegram alert to ${user.externalId}:`, error);
        }
    }

    // Send to Discord
    for (const integration of discordChannels) {
    if (!integration.channelId) {
        continue;
    }

    try {
        console.log(
            "Sending Discord alert to channel:",
            integration.channelId
        );

        await sendDiscordAlert(
            integration.channelId,
            alertMessage
        );
    } catch (error) {
        console.error(
            `Failed to send Discord alert to ${integration.channelId}:`,
            error
        );
    }
}
}

// Helper function to send resolution alerts
async function sendResolutionAlerts(
    cluster: ClusterWithRelations, 
    dbAlert: Alert
): Promise<void> {
    const organizationId = cluster.organizationId;

    // Get all verified integrations for this organization
    const integrations = await prisma.integration.findMany({
        where: {
            organizationId: organizationId,
            verified: true,
        },
    });

    // Separate Telegram and Discord integrations
    const telegramUsers = integrations.filter(i => i.platform === "telegram");
    const discordChannels = integrations.filter(i => i.platform === "discord");

    // Format resolution message
    const resolutionMessage = `
✅ Alert Resolved

Cluster: ${cluster.name}
Pod: ${dbAlert.pod}
Namespace: ${dbAlert.namespace}
Status: ${dbAlert.status}
Resolved at: ${new Date().toLocaleString()}
`;

    // Send to Telegram
    for (const user of telegramUsers) {
        try {
            await sendTelegramAlert(user.externalId, resolutionMessage);
        } catch (error) {
            console.error(`Failed to send Telegram resolution to ${user.externalId}:`, error);
        }
    }

    // Send to Discord
    for (const integration of discordChannels) {
    if (!integration.channelId) {
        continue;
    }

    try {
        await sendDiscordAlert(
            integration.channelId,
            resolutionMessage
        );
    } catch (error) {
        console.error(
            `Failed to send Discord resolution to ${integration.channelId}:`,
            error
        );
    }
}
}