import { WebSocket } from 'ws'; // Assumes you are using the popular 'ws' package

export const agents = new Map<string, WebSocket>();

export const add = (token: string, ws: WebSocket): Map<string, WebSocket> => 
  agents.set(token, ws);

export const remove = (token: string): boolean => 
  agents.delete(token);

export const get = (token: string): WebSocket | undefined => 
  agents.get(token);
