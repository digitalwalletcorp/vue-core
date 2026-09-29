<!--
TabGroupの中に置くタブ1つ分の中身
-->
<template>
  <div
    v-if="!props.disabled"
    class="dwui-tab-content"
    :aria-label="props.labelId"
    :aria-checked="selected ? 'true' : 'false'"
    :aria-description="props.description"
    :aria-busy="loading ? 'true' : undefined"
    :data-test-tab-content="props.labelId"
  >
    <slot
      :activated="activated"
      :set-loading="setLoading"
    />
    <!-- 読み込み中は中身に覆いを重ね、操作できないようにする -->
    <div
      v-if="loading"
      class="dwui-tab-loading"
    >
      <component
        :is="loadingSlot()"
        v-if="loadingSlot() != null"
      />
      <span
        v-else
        class="dwui-tab-loading-spinner"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { ClassValue, Slot, StyleValue } from 'vue';
import { tabGroupContextKey } from '@/internal/tab-group-context';
import type { TabContentStatus } from '@/internal/tab-group-context';

// labelId・description・header*・status・#iconは、TabGroupが見出しを描画するために読む
interface Props {
  /** タブを識別するID。TabGroupのselectedTabLabelIdに渡す値 */
  labelId: string;
  /** タブの見出しの文字 */
  description: string;
  /** trueの場合、タブを選べなくし、中身も描画しない */
  disabled?: boolean;
  /** タブの見出しの状態。見出しの色が変わる */
  status?: TabContentStatus;
  /** タブの見出しに付けるclass */
  headerClass?: ClassValue;
  /** タブの見出しに付けるstyle */
  headerStyle?: StyleValue;
}
const props = defineProps<Props>();

interface Slots {
  /** タブの見出しの文字の前に表示するアイコン */
  icon?(): unknown;
  /**
   * タブの中身
   * activated: タブが選ばれて表示されている間はtrue。中身のコンポーネントにpropsで渡し、選ばれたときの処理の契機にする
   * setLoading: trueを渡すと読み込み中の表示にする。表示はTabGroupの#loadingスロット、未指定なら既定の表示
   */
  default?(props: { activated: boolean; setLoading: (loading: boolean) => void }): unknown;
}
defineSlots<Slots>();

const context = inject(tabGroupContextKey, undefined);

const loading = ref(false);

/**
 * TabGroupの#loadingスロット。見出しの#iconと同じく、スロット関数をそのままコンポーネントとして描画する
 * スロットはリアクティブではないため、computedでキャッシュせず描画のたびに取り出す
 *
 * @returns {Slot | undefined}
 */
const loadingSlot = (): Slot | undefined => context?.loadingSlot();

// 表示の切り替えは初期描画から効かせるため、マウントを待たない
const selected = computed((): boolean => context?.activeLabelId.value === props.labelId);

const activated = computed((): boolean => !!context?.mounted.value && selected.value);

/**
 * 読み込み中の表示を切り替える
 *
 * @param {boolean} value
 */
const setLoading = (value: boolean) => {
  loading.value = value;
};
</script>

<style>
:where(.dwui-tab-content[aria-checked='false']) {
  display: none;
}

:where(.dwui-tab-content[aria-checked='true']) {
  display: block;
  /* 読み込み中の覆いを中身の範囲に重ねる基準にする */
  position: relative;
  padding: 4px 8px;
  overflow: hidden;
  /* 全幅を横断すると速度が出てカクつくため、既定は固定の移動量とease-outとフェードでスライドインする */
  animation: dwui-tab-slide-in var(--dwui-duration-tab-slide, 0.35s) var(--dwui-easing-tab-slide, cubic-bezier(0.22, 1, 0.36, 1));
}

:where(.dwui-tab-loading) {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dwui-overlay-color-loading, rgba(0, 0, 0, 0.25));
}

:where(.dwui-tab-loading-spinner) {
  width: var(--dwui-size-loading-spinner, 40px);
  height: var(--dwui-size-loading-spinner, 40px);
  border: 4px solid var(--dwui-border-color-loading-spinner-track, rgba(255, 255, 255, 0.4));
  border-top-color: var(--dwui-border-color-loading-spinner, #ffffff);
  border-radius: 50%;
  animation: dwui-tab-loading-spin 0.8s linear infinite;
}

@keyframes dwui-tab-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dwui-tab-slide-in {
  0% {
    opacity: 0;
    transform: translateX(var(--dwui-distance-tab-slide, -128px));
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
