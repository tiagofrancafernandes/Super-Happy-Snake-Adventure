
class AudioService {
  private audioContext: AudioContext | null = null;

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playEat(volume: number) {
    this.init();
    if (!this.audioContext || volume === 0) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime((volume / 5) * 0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  public playGameOver(volume: number) {
    this.init();
    if (!this.audioContext || volume === 0) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, this.audioContext.currentTime + 0.5);

    gain.gain.setValueAtTime((volume / 5) * 0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }
}

export const audioService = new AudioService();
