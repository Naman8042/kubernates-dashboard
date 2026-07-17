export type AlertSeverity =
  | "info"
  | "warning"
  | "critical";

export interface AlertPayload {
  clusterId: string;
  alertType: string;
  severity: AlertSeverity;
  message: string;
  metadata?: any;
  timestamp: number;
}