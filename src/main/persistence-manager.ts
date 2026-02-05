import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface CacheWindow {
  start: Date;
  end: Date;
}

export class PersistenceManager {
  private db: Database.Database;
  constructor(private basePath: string) {
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
    const dbPath = path.join(basePath, 'adhansync.db');
    this.db = new Database(dbPath);
    this.ensureSchema();
    this.verifyIntegrity();
  }

  private ensureSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS prayer_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prayer_time_utc TEXT NOT NULL,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  private verifyIntegrity() {
    const res = this.db.prepare('PRAGMA integrity_check;').get();
    if (res && res.integrity_check !== 'ok') {
      throw new Error('SQLite integrity check failed');
    }
  }

  public getCacheWindow(): CacheWindow | null {
    const row = this.db.prepare(`
      SELECT MIN(prayer_time_utc) as start, MAX(prayer_time_utc) as end FROM prayer_cache;
    `).get();
    if (!row || !row.start || !row.end) return null;
    return { start: new Date(row.start), end: new Date(row.end) };
  }

  public upsertMeta(key: string, value: string) {
    this.db.prepare(`INSERT INTO meta(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value;`).run(key, value);
  }

  public getMeta(key: string): string | null {
    const row = this.db.prepare('SELECT value FROM meta WHERE key = ?').get(key);
    return row ? row.value : null;
  }
}
