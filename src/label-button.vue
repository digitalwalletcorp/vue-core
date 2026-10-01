<!--
アイコンとラベルを持つボタン
-->
<template>
  <button class="dwui-label-button">
    <LabelIcon
      :preset="props.preset"
      :gap="props.gap"
      :icon-class="props.iconClass"
      :icon-style="props.iconStyle"
      :label-class="props.labelClass"
      :label-style="props.labelStyle"
    >
      <!-- 渡されたスロットだけを中継する。空のスロットを渡すとpresetの内容が表示されなくなるため -->
      <template
        v-if="slots.icon != null"
        #icon
      >
        <slot name="icon" />
      </template>
      <template
        v-if="slots.default != null"
        #default
      >
        <slot />
      </template>
    </LabelIcon>
  </button>
</template>

<script setup lang="ts">
import type { ClassValue, StyleValue } from 'vue';
import LabelIcon from '@/label-icon.vue';
import type { LabelPreset } from '@/types/label-preset';

interface Props {
  /** アイコンとラベルの組み合わせ */
  preset?: LabelPreset;
  /** アイコンとラベルの間隔。未指定ならLabelIconの既定値(0.25em) */
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
:where(.dwui-label-button) {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid var(--dwui-border-color-label-button, light-dark(#8f8f8f, #6b6f76));
  border-radius: 3px;
  background: var(--dwui-background-label-button, light-dark(#f4f4f4, #3a3c40));
  color: var(--dwui-color-text-label-button, light-dark(#1a1a1a, #e6e6e6));
  font: inherit;
  cursor: pointer;
}

:where(.dwui-label-button:not(:disabled):hover) {
  background: var(--dwui-background-label-button-hover, light-dark(#e6e6e6, #474a50));
}

:where(.dwui-label-button:not(:disabled):active) {
  background: var(--dwui-background-label-button-active, light-dark(#d6d6d6, #2f3135));
}

:where(.dwui-label-button:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

:where(.dwui-label-button:focus-visible) {
  outline: var(--dwui-width-focus-ring, 2px) solid var(--dwui-outline-color-focus-ring, Highlight);
  outline-offset: var(--dwui-offset-focus-ring, 2px);
}
</style>
