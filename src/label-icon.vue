<!--
アイコンとラベルを横に並べる
-->
<template>
  <span
    class="dwui-label-icon"
    :style="props.gap == null ? undefined : { '--dwui-gap-label-icon': props.gap }"
  >
    <slot name="icon">
      <component
        :is="props.preset.icon"
        v-if="props.preset != null"
        v-bind="props.preset.iconProps"
        :class="props.iconClass"
        :style="props.iconStyle"
      />
    </slot>
    <!-- スロットに複数の要素が入ってもラベルとして1つにまとめ、アイコンとの間隔をラベル側で空ける -->
    <span
      v-if="slots.default != null || props.preset != null"
      class="dwui-label"
      :class="props.labelClass"
      :style="props.labelStyle"
    >
      <slot>{{ typeof props.preset?.label === 'function' ? props.preset.label() : props.preset?.label }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import type { ClassValue, StyleValue } from 'vue';
import type { LabelPreset } from '@/types/label-preset';

interface Props {
  /** アイコンとラベルの組み合わせ */
  preset?: LabelPreset;
  /** アイコンとラベルの間隔。未指定なら既定値(0.25em) */
  gap?: string;
  /** presetのアイコンに付けるclass。スロットで渡したアイコンには、スロット側で直接指定する */
  iconClass?: ClassValue;
  /** presetのアイコンに付けるstyle。スロットで渡したアイコンには、スロット側で直接指定する */
  iconStyle?: StyleValue;
  /** ラベルに付けるclass */
  labelClass?: ClassValue;
  /** ラベルに付けるstyle */
  labelStyle?: StyleValue;
}
const props = defineProps<Props>();

interface Slots {
  icon?(): unknown;
  default?(): unknown;
}
const slots = defineSlots<Slots>();
</script>

<style>
/*
 * flexにせず通常のインライン配置に任せる。flexアイテムになるとvertical-alignが無視され、
 * vue-svg-iconsがアイコンを文字の縦位置中央に揃える調整が効かなくなるため
 */
:where(.dwui-label-icon) {
  display: inline-block;
}

/* スロットに複数の要素が入っても1つにまとめ、前後の空白が隙間にならないようinline-blockにする */
:where(.dwui-label-icon > .dwui-label) {
  display: inline-block;
}

/* アイコンとラベルの間隔。gapはflex専用のためmarginで空ける */
:where(.dwui-label-icon > .dwui-label:not(:first-child)) {
  margin-left: var(--dwui-gap-label-icon, 0.25em);
}
</style>
