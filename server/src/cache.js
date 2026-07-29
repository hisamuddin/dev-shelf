export class MemoryCache {
  constructor(defaultTtlMs = 30_000) {
    this.defaultTtlMs = defaultTtlMs;
    this.entries = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      if (entry) this.entries.delete(key);
      this.misses += 1;
      return undefined;
    }
    this.hits += 1;
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  }

  invalidate(key) { this.entries.delete(key); }

  invalidatePrefix(prefix) {
    for (const key of this.entries.keys()) if (key.startsWith(prefix)) this.entries.delete(key);
  }

  stats() {
    return { size: this.entries.size, hits: this.hits, misses: this.misses };
  }
}
