import getId from '../utils/id.js'; // Adjust file extension (.js) based on your tsconfig/bundler rules
import { add } from './request.store.js';
import * as agentStore from './agent.store.js'; // Added missing import for agentStore
export function send(token, payload) {
    return new Promise((resolve, reject) => {
        const ws = agentStore.get(token);
        if (!ws) {
            return reject("agent not connected");
        }
        const requestId = getId();
        add(requestId, resolve, reject);
        ws.send(JSON.stringify({ ...payload, requestId }));
        setTimeout(() => {
            reject(requestId);
        }, 5000);
    });
}
