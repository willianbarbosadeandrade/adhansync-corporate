import { execSync } from 'child_process';
import fs from 'fs';

export class AudioPlayer {
  constructor(private stopProcesses: string[] = ['Spotify', 'chrome']) {}

  stopExternalSources() {
    // Simplificado: sinaliza para SO; implementar por plataforma.
    try {
      this.stopProcesses.forEach((name) => {
        if (process.platform === 'darwin') {
          execSync(`osascript -e 'tell application "${name}" to pause'`, { stdio: 'ignore' });
        } else if (process.platform === 'win32') {
          execSync(`powershell -Command "(Get-Process -Name '${name}' -ErrorAction SilentlyContinue) | ForEach-Object { $_.CloseMainWindow() }"`, { stdio: 'ignore' });
        }
      });
    } catch (_) {
      // tolerante a falhas
    }
  }

  playLocal(pathToFile: string) {
    if (!fs.existsSync(pathToFile)) {
      throw new Error('Adhan local file not found');
    }
    // Placeholder: invocar player nativo ou core Rust
    execSync(`printf "Playing: ${pathToFile}\n"`, { stdio: 'inherit' });
  }
}
