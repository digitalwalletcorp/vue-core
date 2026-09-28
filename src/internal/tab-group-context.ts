import type { ComputedRef, InjectionKey, Ref, Slot } from 'vue';

/** タブの見出しの状態 */
export type TabContentStatus = 'warn' | 'error';

/**
 * TabGroupからTabContentへ渡す状態
 * TabGroupとTabContentの間だけで使い、利用側には公開しない
 */
export interface TabGroupContext {
  /** 選択中のタブのlabelId */
  activeLabelId: ComputedRef<string | undefined>;
  /** TabGroupがマウント済みか */
  mounted: Ref<boolean>;
  /** TabGroupの#loadingスロット。未指定ならTabContentは既定の読み込み中表示を出す */
  loadingSlot: () => Slot | undefined;
}

export const tabGroupContextKey: InjectionKey<TabGroupContext> = Symbol('dwui-tab-group');
