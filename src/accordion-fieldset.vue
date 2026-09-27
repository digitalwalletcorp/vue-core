<!--
中身を開閉できるfieldset
-->
<template>
  <fieldset
    class="dwui-accordion-fieldset"
    :disabled="props.disabled"
  >
    <legend>
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
      :class="[ 'dwui-accordion-contents', pageContext.expandable ? pageContext.expanded ? 'dwui-expanded' : 'dwui-shrunk' : '' ]"
    >
      <slot />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { SvgTriangleButton } from '@digitalwalletcorp/vue-svg-icons';
import LabelIcon from '@/label-icon.vue';

/** 縮めたときの中身の高さ(px)。中身がこれより低い場合は開閉しない */
const SHRUNK_HEIGHT = 70;

interface Props {
  /** 凡例の文字。HTMLを含める場合は#legendスロットを使う */
  legend?: string;
  /** trueの場合、fieldsetを無効にする */
  disabled?: boolean;
  /** trueの場合、開いた状態で表示する デフォルト false */
  initialExpand?: boolean;
  /** 変化したときに、中身の高さを測り直して開閉できるかを判定し直す値 */
  observer?: unknown;
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
  expandable: true,
  expanded: true
});

const onClickToggle = () => {
  pageContext.expanded = !pageContext.expanded;
  pageContext.expandable = checkExpandable();
};

/**
 * 中身が縮めたときの高さ以上あり、開閉できるかを返す
 *
 * @returns {boolean}
 */
const checkExpandable = (): boolean => {
  if (refContents.value) {
    const rect = refContents.value.getBoundingClientRect();
    return SHRUNK_HEIGHT <= rect.height;
  }
  return false;
};

onMounted(() => {
  pageContext.expanded = !!props.initialExpand;
  if (props.observer) {
    pageContext.expandable = checkExpandable();
  }
});

watch(() => props.observer, (newValue: unknown) => {
  if (newValue) {
    pageContext.expandable = checkExpandable();
  }
}, {
  deep: true,
  // 高さの計測はDOM反映後に行う
  flush: 'post'
});
</script>

<style>
:where(.dwui-accordion-fieldset) {
  position: relative;
}

/* 詳細度0のため、利用側がbutton要素に装飾を当てている場合はそちらが優先される。打ち消しは利用側のCSSで行う */
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
