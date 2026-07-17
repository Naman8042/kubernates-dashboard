export const agents = new Map();
export const add = (token, ws) => agents.set(token, ws);
export const remove = (token) => agents.delete(token);
export const get = (token) => agents.get(token);
