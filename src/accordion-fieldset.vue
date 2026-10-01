<!--
中身を開閉できるfieldset
-->
<template>
  <fieldset
    class="dwui-accordion-fieldset"
    :disabled="props.disabled"
  >
    <legend class="dwui-accordion-legend">
      <button
        type="button"
        class="dwui-accordion-toggle"
        :aria-expanded="pageContext.expanded"
        @click="onClickToggle"
      >
        <SvgTriangleButton :direction="pageContext.expanded ? 'up' : 'down'" />
        <LabelIcon v-if="props.legend != null || slots.legend != null || slots.icon != null">
          <!-- 渡されたスロットだけを中継する。空のラベルを渡すとアイコンの後ろに間隔が空くため -->
          <template
            v-if="slots.icon != null"
            #icon
          >
            <slot name="icon" />
          </template>
          <template
            v-if="props.legend != null || slots.legend != null"
            #default
          >
            <slot name="legend">{{ props.legend }}</slot>
          </template>
        </LabelIcon>
      </button>
    </legend>
    <div
      ref="refContents"
      :class="[ 'dwui-accordion-contents', shrinkable ? pageContext.expanded ? 'dwui-expanded' : 'dwui-shrunk' : '' ]"
    >
      <slot />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { SvgTriangleButton } from '@digitalwalletcorp/vue-svg-icons';
import LabelIcon from '@/label-icon.vue';
import { useShrinkable } from '@/internal/use-shrinkable';

interface Props {
  /** 凡例の文字。HTMLを含める場合は#legendスロットを使う */
  legend?: string;
  /** trueの場合、fieldsetを無効にする */
  disabled?: boolean;
  /** trueの場合、開いた状態で表示する デフォルト false */
  initialExpand?: boolean;
}
const props = defineProps<Props>();

interface Slots {
  /** 凡例の文字の前に表示するアイコン */
  icon?(): unknown;
  /** 凡例。legendより優先する */
  legend?(): unknown;
  default?(): unknown;
}
const slots = defineSlots<Slots>();

const refContents = ref<HTMLElement>();
const pageContext = reactive({
  expanded: true
});
const shrinkable = useShrinkable(refContents);

const onClickToggle = () => {
  pageContext.expanded = !pageContext.expanded;
};

onMounted(() => {
  pageContext.expanded = !!props.initialExpand;
});
</script>

<style>
:where(.dwui-accordion-fieldset) {
  position: relative;
}

/* 開閉ボタンは押しボタンではなく凡例と一体の操作として見せるため、既定では枠・背景を持たない */
:where(.dwui-accordion-toggle) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
}

:where(.dwui-accordion-toggle:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

:where(.dwui-accordion-toggle:focus-visible) {
  outline: var(--dwui-width-focus-ring, 2px) solid var(--dwui-outline-color-focus-ring, Highlight);
  outline-offset: var(--dwui-offset-focus-ring, 2px);
}

:where(.dwui-accordion-contents) {
  position: relative;
  width: fit-content;
  padding: 2px;
  overflow: hidden;
  opacity: 1;
}

:where(.dwui-accordion-contents.dwui-expanded) {
  transition: all 0.3s linear;
}

:where(.dwui-accordion-contents.dwui-shrunk) {
  height: auto;
  max-height: 70px;
  opacity: 0.75;
  transition: all 0.3s linear;
}
</style>
