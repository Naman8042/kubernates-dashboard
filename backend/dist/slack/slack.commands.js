import { send } from "../websockets/sender.js";
import { DEFAULT_TOKEN } from "../config.js";
export async function handleSlackCommand(text) {
    const parts = text.trim().split(" ");
    const command = parts[0].toLowerCase();
    switch (command) {
        case "pods":
            return await send(DEFAULT_TOKEN, {
                type: "GET_PODS",
            });
        case "deployments":
            return await send(DEFAULT_TOKEN, {
                type: "GET_DEPLOYMENTS",
            });
        case "nodes":
            return await send(DEFAULT_TOKEN, {
                type: "GET_NODES",
            });
        case "logs": {
            const podName = parts[1];
            if (!podName) {
                return "Usage: !logs <pod-name>";
            }
            return await send(DEFAULT_TOKEN, {
                type: "GET_LOGS",
                podName,
            });
        }
        case "restart": {
            const deployment = parts[1];
            if (!deployment) {
                return "Usage: !restart <deployment-name>";
            }
            return await send(DEFAULT_TOKEN, {
                type: "RESTART_DEPLOYMENT",
                deployment,
            });
        }
        case "help":
            return `
🤖 Kubernetes ChatOps Bot

Commands:

!pods
!deployments
!nodes
!logs <pod-name>
!restart <deployment-name>
!help
`;
        case "ping":
            return "pong 🏓";
        default:
            return "❌ Unknown command. Type !help";
    }
}
