const pending = new Map();
export function add(id, resolve, reject) {
    pending.set(id, { resolve, reject });
}
export function resolve(id, data) {
    const entry = pending.get(id);
    if (entry) {
        entry.resolve(data);
        pending.delete(id);
    }
}
export function reject(id, err) {
    const entry = pending.get(id);
    if (entry) {
        entry.reject(err); // Fixed bug: changed from entry.resolve(err)
        pending.delete(id);
    }
}
