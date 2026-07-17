const WebSocket = require("ws");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const agents = new Map();

function initWebSocket(server) {
  const wss = new WebSocket.Server({
    server,
  });

  wss.on("connection", (ws) => {
    console.log("🔌 Agent Connected");

    ws.clusterId = null;
    ws.token = null;

    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        // ==================
        // AUTH
        // ==================

        if (data.type === "AUTH") {
          const cluster = await prisma.cluster.findUnique({
            where: {
              clusterToken: data.token,
            },
          });

          if (!cluster) {
            console.log("❌ Invalid Token");

            ws.close();

            return;
          }

          ws.clusterId = cluster.id;

          ws.token = data.token;

          agents.set(data.token, ws);

          await prisma.cluster.update({
            where: {
              id: cluster.id,
            },
            data: {
              status: "online",
              lastSeen: new Date(),
            },
          });

          console.log(`✅ Cluster Online: ${cluster.name}`);

          ws.send(
            JSON.stringify({
              type: "AUTH_SUCCESS",
            }),
          );

          return;
        }

        // ==================
        // HEARTBEAT
        // ==================

        if (data.type === "PING") {
          if (ws.clusterId) {
            await prisma.cluster.update({
              where: {
                id: ws.clusterId,
              },
              data: {
                lastSeen: new Date(),
              },
            });
          }

          ws.send(
            JSON.stringify({
              type: "PONG",
            }),
          );

          return;
        }

        // ==================
        // RESPONSE
        // ==================

        if (data.type === "RESPONSE") {
          ws.lastResponse = data;

          if (ws.clusterId) {
            await prisma.cluster.update({
              where: {
                id: ws.clusterId,
              },
              data: {
                lastSeen: new Date(),
              },
            });
          }

          return;
        }
      } catch (error) {
        console.error("WS Message Error:", error);
      }
    });

    ws.on("close", async () => {
      console.log("❌ Agent Disconnected");

      try {
        if (ws.clusterId) {
          await prisma.cluster.update({
            where: {
              id: ws.clusterId,
            },
            data: {
              status: "offline",
            },
          });
        }

        if (ws.token) {
          agents.delete(ws.token);
        }
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("error", (err) => {
      console.error("WS Error:", err.message);
    });
  });

  // ==================
  // DEAD AGENT CHECK
  // ==================

  setInterval(async () => {
    try {
      const timeout = new Date(Date.now() - 5 * 60 * 1000);

      await prisma.cluster.updateMany({
        where: {
          status: "online",

          lastSeen: {
            lt: timeout,
          },
        },

        data: {
          status: "offline",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, 60000);

  return agents;
}

module.exports = {
  initWebSocket,
  agents,
};
