import { storageProvider } from "../storage/storage.provider";

export const storage = {
  get<T>(key: string, fallback: T): T {
    return storageProvider.get<T>(key, fallback);
  },

  set<T>(key: string, value: T): void {
    storageProvider.set<T>(key, value);
  },

  remove(key: string): void {
    storageProvider.remove(key);
  },

  clear(): void {
    storageProvider.clear();
  },
};