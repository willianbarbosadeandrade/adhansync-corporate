import { SyncEngine } from './sync-engine';

export class Heartbeat {
  private timer?: NodeJS.Timer;
  constructor(private sync: SyncEngine, private intervalMs = 30_000) {}

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private async tick() {
    const online = await this.isOnline();
    if (online) {
      await this.sync.ensureFreshCache();
      // TODO: puxar configurações pendentes do Dashboard Web
    }
  }

  private async isOnline(): Promise<boolean> {
    try {
      const res = await fetch('https://www.google.com', { method: 'HEAD' });
      return res.ok;
    } catch (_) {
      return false;
    }
  }
}
