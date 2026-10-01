<!--
画面のタイトルバー。右側にスロットで渡されたものを space-between で配置する。
-->
<template>
  <section class="dwui-page-title">
    <LabelIcon class="dwui-page-title-label">
      <!-- 渡されたスロットだけを中継する。空のスロットを渡すとアイコンの位置に間隔が空くため -->
      <template
        v-if="slots.icon != null"
        #icon
      >
        <slot name="icon" />
      </template>
      {{ props.title }}
    </LabelIcon>
    <span
      v-if="slots.default != null"
      class="dwui-page-title-actions"
    >
      <slot />
    </span>
  </section>
</template>

<script setup lang="ts">
import LabelIcon from '@/label-icon.vue';

interface Props {
  /** タイトルの文字 */
  title: string;
}
const props = defineProps<Props>();

interface Slots {
  /** タイトルの文字の前に表示するアイコン */
  icon?(): unknown;
  /** タイトルバーの右側に表示する内容 */
  default?(): unknown;
}
const slots = defineSlots<Slots>();
</script>

<style>
:where(.dwui-page-title) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: var(--dwui-width-page-title, auto);
  padding: 4px;
  border-radius: 4px;
  background: var(--dwui-background-page-title, linear-gradient(light-dark(#323232, #3c3f45) 0%, light-dark(rgb(32, 32, 31), #2b2d31) 25%, light-dark(rgb(32, 32, 31), #2b2d31) 75%, light-dark(#323232, #3c3f45) 100%));
  color: var(--dwui-color-text-page-title, rgb(220, 220, 220));
  font-size: var(--dwui-font-size-page-title, 14px);
  font-weight: var(--dwui-font-weight-page-title, normal);
}
</style>
