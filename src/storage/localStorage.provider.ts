import type { StorageProvider } from "./storage.types";

export class LocalStorageProvider implements StorageProvider {
  get<T>(key: string, fallback: T): T {
    const value = window.localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    window.localStorage.removeItem(key);
  }

  clear(): void {
    window.localStorage.clear();
  }
}