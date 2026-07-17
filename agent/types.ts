export type IncomingMessage =
  | { type: "PING" }
  | { type: "GET_PODS"; requestId: string }
  | { type: "GET_DEPLOYMENTS"; requestId: string }
  | { type: "GET_LOGS"; requestId: string; payload: any }
  | { type: "GET_EVENTS"; requestId: string };

export type OutgoingMessage =
  | { type: "AUTH"; token: string }
  | { type: "PONG" }
  | { type: "RESPONSE"; requestId: string; data: any }
  | { type: "ERROR"; requestId?: string; message: string };