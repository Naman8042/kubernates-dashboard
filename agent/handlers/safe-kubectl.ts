import { execSync } from "child_process";

const ALLOWED_COMMANDS = [
  "get pods",
  "get deployments",
  "get svc",
  "get services",
  "get ingress",
  "get ingresses",
  "get nodes",
  "get namespaces",
  "get events",
  "get configmaps",
  "get secrets",
  "get pvc",
  "get pv",
  "get jobs",
  "get cronjobs",
  "top pods",
  "top nodes",
  "describe pod",
  "describe deployment",
  "describe node",
  "describe svc",
  "describe service",
  "rollout restart deployment",
  "logs",
];

export function executeKubectl(command: string) {
  const normalized = command.trim().replace(/\s+/g, " ");

  const allowed = ALLOWED_COMMANDS.some((cmd) =>
    normalized.startsWith(cmd)
  );

  if (!allowed) {
    throw new Error("Command not allowed");
  }

  return execSync(`kubectl ${normalized}`, {
    encoding: "utf8",
  });
}