<!--
アイコンとラベルを持つボタン
-->
<template>
  <button>
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
