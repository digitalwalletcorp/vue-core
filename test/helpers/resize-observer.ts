import { vi } from 'vitest';

/**
 * 中身の大きさの変化を、テストから任意のタイミングで起こせるようにする
 * happy-domのResizeObserverは大きさを計算しないため、コールバックを手元に集めて呼び出す
 *
 * @returns {{ resize: (scrollHeight: number) => void; observing: () => number }} resizeは要素のscrollHeightを差し替えて監視中のコールバックを呼ぶ。observingは監視中の数を返す
 */
export const mockResizeObserver = (): { resize: (scrollHeight: number) => void; observing: () => number } => {
  const callbacks: (() => void)[] = [];
  vi.stubGlobal('ResizeObserver', class {
    private readonly callback: () => void;

    constructor(callback: () => void) {
      this.callback = callback;
    }

    observe() {
      callbacks.push(this.callback);
    }

    disconnect() {
      callbacks.splice(callbacks.indexOf(this.callback), 1);
    }
  });
  return {
    resize: (scrollHeight: number) => {
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(scrollHeight);
      for (const callback of [...callbacks]) {
        callback();
      }
    },
    observing: () => callbacks.length
  };
};
