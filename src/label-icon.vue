<!--
アイコンとラベルを横に並べる
-->
<template>
  <span
    class="dwui-label-icon"
    :style="props.gap == null ? undefined : { gap: props.gap }"
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
    <!-- スロットに複数の要素が入っても、flexの子要素に分かれて間にgapが入らないよう1つにまとめる -->
    <span
      v-if="slots.default != null || props.preset != null"
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
:where(.dwui-label-icon) {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
}
</style>
