import type { Component } from 'vue';

/**
 * アイコンとラベルの組み合わせ
 */
export interface LabelPreset {
  /** アイコンのコンポーネント */
  icon: Component;
  /** アイコンに渡すProps */
  iconProps?: Record<string, unknown>;
  /** ラベル。言語切替に追従させる場合は、描画のたびに呼ばれる関数で渡す */
  label: string | (() => string);
}
