import { WebSocketServer } from "ws";
import * as agentStore from "./agent.store.js";
import * as requestStore from "./request.store.js";
import { updateHeartbeat } from "../alerts/heartbeat.store.js"; // Added missing import
import { prisma } from "../prisma/prisma.js";
export function initWS(server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", (ws) => {
        console.log("Agent connected");
        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === "AUTH") {
                    const cluster = await prisma.cluster.findUnique({
                        where: {
                            clusterToken: data.token,
                        },
                    });
                    console.log(data.token);
                    if (!cluster) {
                        console.log("Invalid cluster token");
                        ws.close();
                        return;
                    }
                    ws.token = data.token;
                    console.log(ws.token);
                    agentStore.add(data.token, ws);
                    await prisma.cluster.update({
                        where: {
                            id: cluster.id,
                        },
                        data: {
                            status: "online",
                            lastSeen: new Date(),
                        },
                    });
                    console.log(cluster);
                    console.log(`Cluster Online: ${cluster.name}`);
                    return;
                }
                if (data.type === "HEARTBEAT") {
                    updateHeartbeat(data.clusterId);
                    return;
                }
                if (data.type === "RESPONSE") {
                    requestStore.resolve(data.requestId, data.data);
                    return;
                }
            }
            catch (err) {
                console.error("Failed to parse or process WS message:", err);
            }
        });
        ws.on("close", () => {
            if (ws.token) {
                agentStore.remove(ws.token);
                console.log(`Agent disconnected: ${ws.token}`);
            }
        });
    });
}
