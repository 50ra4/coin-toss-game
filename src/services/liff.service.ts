import liff from '@line/liff';

class LiffService {
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
      await liff.init({ liffId });
      this.initialized = true;
    } catch (error) {
      console.error('LIFF initialization error:', error);
    } finally {
      this.initializing = false;
    }
  }

  isInClient(): boolean {
    return this.initialized && liff.isInClient();
  }

  async shareTargetPicker(text: string): Promise<void> {
    if (!this.isInClient()) {
      throw new Error('Not in LIFF environment');
    }

    try {
      await liff.shareTargetPicker([{ type: 'text', text }]);
    } catch (error) {
      console.error('LINE share error:', error);
      throw error;
    }
  }
}

export const liffService = new LiffService();
