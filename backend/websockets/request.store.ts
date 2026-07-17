// 1. Define the internal structure of a pending promise entry
interface PendingEntry {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

const pending = new Map<string, PendingEntry>();

export function add(
  id: string, 
  resolve: (value: any) => void, 
  reject: (reason: any) => void
): void {
  pending.set(id, { resolve, reject });
}

export function resolve(id: string, data: any): void {
  const entry = pending.get(id);

  if (entry) {
    entry.resolve(data);
    pending.delete(id);
  }
}

export function reject(id: string, err: Error): void {
  const entry = pending.get(id);

  if (entry) {
    entry.reject(err); // Fixed bug: changed from entry.resolve(err)
    pending.delete(id);
  }
}
