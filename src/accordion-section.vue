<!--
中身を開閉できる領域。中身の下に開閉ボタンを置く
-->
<template>
  <div class="dwui-accordion-section">
    <div
      ref="refContents"
      class="dwui-accordion-section-contents"
      :class="[
        shrinkable ? pageContext.expanded ? 'dwui-expanded' : 'dwui-shrunk' : '',
        { 'dwui-no-gradient': props.noGradient }
      ]"
    >
      <slot />
    </div>
    <div
      v-if="shrinkable"
      class="dwui-accordion-section-control"
    >
      <button
        type="button"
        class="dwui-accordion-section-toggle"
        :disabled="props.disabled"
        :aria-expanded="pageContext.expanded"
        @click.stop="onClickToggle"
      >
        <LabelIcon v-if="toggleIcon() != null || toggleLabel != null">
          <template
            v-if="toggleIcon() != null"
            #icon
          >
            <component
              :is="toggleIcon()"
              v-bind="toggleIconProps()"
            />
          </template>
          <template
            v-if="toggleLabel != null"
            #default
          >
            {{ toggleLabel }}
          </template>
        </LabelIcon>
        <SvgTriangleButton
          v-else
          :direction="pageContext.expanded ? 'up' : 'down'"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { Component, Slot } from 'vue';
import { SvgTriangleButton } from '@digitalwalletcorp/vue-svg-icons';
import LabelIcon from '@/label-icon.vue';
import { useShrinkable } from '@/internal/use-shrinkable';
import type { LabelPreset } from '@/types/label-preset';

// 開閉ボタンのアイコンとラベルは別々に決める。どちらも、スロット/ラベルの指定 > プリセット の順で使う
// 何も指定が無い場合だけ、既定の三角を表示する
interface Props {
  /** trueの場合、開閉ボタンを無効にする */
  disabled?: boolean;
  /** trueの場合、開いた状態で表示する デフォルト false */
  initialExpand?: boolean;
  /** trueの場合、縮めたときに中身の下側をぼかさない */
  noGradient?: boolean;
  /** 縮めているときの開閉ボタン(開く)のラベル */
  openLabel?: string;
  /** 開いているときの開閉ボタン(閉じる)のラベル */
  closeLabel?: string;
  /** 縮めているときの開閉ボタン(開く)のアイコンとラベル */
  openPreset?: LabelPreset;
  /** 開いているときの開閉ボタン(閉じる)のアイコンとラベル */
  closePreset?: LabelPreset;
}
const props = defineProps<Props>();

interface Slots {
  /** 縮めているときの開閉ボタン(開く)のアイコン */
  'open-icon'?(): unknown;
  /** 開いているときの開閉ボタン(閉じる)のアイコン */
  'close-icon'?(): unknown;
  default?(): unknown;
}
const slots = defineSlots<Slots>();

const refContents = ref<HTMLElement>();
const pageContext = reactive({
  expanded: true
});
const shrinkable = useShrinkable(refContents);

const togglePreset = computed((): LabelPreset | undefined => pageContext.expanded ? props.closePreset : props.openPreset);

/**
 * 開閉ボタンに表示するアイコン。スロットは関数のままコンポーネントとして描画する
 * スロットはリアクティブではないため、computedでキャッシュせず描画のたびに取り出す
 *
 * @returns {Slot | Component | undefined}
 */
const toggleIcon = (): Slot | Component | undefined => {
  const slot = pageContext.expanded ? slots['close-icon'] : slots['open-icon'];
  return (slot as Slot | undefined) ?? togglePreset.value?.icon;
};

/**
 * プリセットのアイコンに渡すProps。スロットで渡したアイコンには渡さない
 *
 * @returns {Record<string, unknown> | undefined}
 */
const toggleIconProps = (): Record<string, unknown> | undefined => {
  const slot = pageContext.expanded ? slots['close-icon'] : slots['open-icon'];
  return slot == null ? togglePreset.value?.iconProps : undefined;
};

const toggleLabel = computed((): string | undefined => {
  const label = pageContext.expanded ? props.closeLabel : props.openLabel;
  if (label != null) {
    return label;
  }
  const presetLabel = togglePreset.value?.label;
  return typeof presetLabel === 'function' ? presetLabel() : presetLabel;
});

const onClickToggle = () => {
  pageContext.expanded = !pageContext.expanded;
};

onMounted(() => {
  pageContext.expanded = !!props.initialExpand;
});
</script>

<style>
:where(.dwui-accordion-section) {
  position: relative;
}

:where(.dwui-accordion-section-contents) {
  position: relative;
  width: fit-content;
  overflow: hidden;
}

:where(.dwui-accordion-section-contents.dwui-expanded) {
  transition: all 0.3s linear;
}

:where(.dwui-accordion-section-contents.dwui-shrunk) {
  height: auto;
  max-height: 70px;
  transition: all 0.3s linear;
}

/* 縮めたときは中身の下側を背景色へ溶け込ませ、続きがあることを示す */
:where(.dwui-accordion-section-contents.dwui-shrunk:not(.dwui-no-gradient))::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(180deg, transparent 0%, transparent 60%, var(--dwui-accordion-section-fade, Canvas) 100%);
  pointer-events: none;
}

:where(.dwui-accordion-section-control) {
  /* 中身(position: relative)より後に描き、縮めたときに重ねたボタンがぼかしの下に隠れないようにする */
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}

:where(.dwui-accordion-section-toggle) {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

:where(.dwui-accordion-section-toggle:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

:where(.dwui-accordion-section-toggle[aria-expanded='true']) {
  margin-top: 8px;
}

/* 縮めたときはボタンを中身のぼかしに少し重ね、中身とボタンの間を詰める */
:where(.dwui-accordion-section-toggle[aria-expanded='false']) {
  margin-top: -10px;
}
</style>
