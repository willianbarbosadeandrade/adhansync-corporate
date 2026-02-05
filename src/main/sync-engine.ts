import { PersistenceManager } from './persistence-manager';
import fs from 'fs';
import path from 'path';

interface SyncOptions {
  apiClient: { fetchPrayerTimes: (days: number) => Promise<any[]> }; // placeholder
  cacheDir: string;
}

export class SyncEngine {
  private readonly CACHE_DAYS = 40;
  private readonly REFRESH_THRESHOLD_DAYS = 10;
  constructor(private persistence: PersistenceManager, private options: SyncOptions) {}

  /**
   * Regra: se (hoje + 10 dias) > fim_do_cache_local => sincronizar.
   */
  public async ensureFreshCache(): Promise<boolean> {
    const window = this.persistence.getCacheWindow();
    const now = new Date();
    const threshold = new Date(now.getTime() + this.REFRESH_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

    if (!window || threshold > window.end) {
      await this.refreshCache();
      return true;
    }
    return false;
  }

  private async refreshCache() {
    const records = await this.options.apiClient.fetchPrayerTimes(this.CACHE_DAYS);
    // TODO: persist records into SQLite (prayer_cache table)
    this.persistence.upsertMeta('cache_refreshed_at', new Date().toISOString());
  }

  public async downloadAdhanAudio(url: string): Promise<string> {
    const dest = path.join(this.options.cacheDir, path.basename(url));
    if (fs.existsSync(dest)) return dest;
    // TODO: real download; placeholder creates empty file
    fs.writeFileSync(dest, '');
    return dest;
  }
}
