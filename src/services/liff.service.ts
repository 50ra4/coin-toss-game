import type liff from '@line/liff';

type Liff = typeof liff;

class LiffService {
  private liff: Liff | null = null;
  private initialized = false;
  private initializing = false;

  isLineApp(): boolean {
    return navigator.userAgent.includes('Line/');
  }

  async init(): Promise<void> {
    if (this.initialized || this.initializing) return;
    if (!this.isLineApp()) return;

    const liffId = import.meta.env.VITE_LIFF_ID;
    if (!liffId) {
      console.error('LIFF ID not configured');
      return;
    }

    this.initializing = true;

    try {
      const { default: liffSdk } = await import('@line/liff');
      await liffSdk.init({ liffId });
      this.liff = liffSdk;
      this.initialized = true;
    } catch (error) {
      console.error('LIFF initialization error:', error);
    } finally {
      this.initializing = false;
    }
  }

  isInClient(): boolean {
    return this.initialized && (this.liff?.isInClient() ?? false);
  }

  async shareTargetPicker(text: string): Promise<void> {
    if (!this.isInClient() || !this.liff) {
      throw new Error('Not in LIFF environment');
    }

    try {
      await this.liff.shareTargetPicker([{ type: 'text', text }]);
    } catch (error) {
      console.error('LINE share error:', error);
      throw error;
    }
  }
}

export const liffService = new LiffService();
