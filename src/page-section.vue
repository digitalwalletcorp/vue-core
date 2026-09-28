<!--
見出し付きの区画
-->
<template>
  <section class="dwui-page-section">
    <div
      v-if="props.title != null"
      class="dwui-page-section-title"
      :class="props.titleClass"
      :style="props.titleStyle"
    >
      <LabelIcon>
        <template #icon>
          <slot name="icon">
            <component
              :is="presetIcon.component"
              v-bind="presetIcon.props"
            />
          </slot>
        </template>
        {{ props.title }}
      </LabelIcon>
    </div>
    <div class="dwui-page-section-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ClassValue, Component, StyleValue } from 'vue';
import { SvgCircle, SvgDiamond, SvgPushpin, SvgRoundPushpin, SvgSquare } from '@digitalwalletcorp/vue-svg-icons';
import LabelIcon from '@/label-icon.vue';

/** 見出しのアイコンとして選べるもの */
type PageSectionIcon = 'diamond' | 'circle' | 'square' | 'pushpin' | 'round-pushpin';

interface Props {
  /** 見出しの文字。未指定なら見出しを表示しない */
  title?: string;
  /** 見出しのアイコン。これ以外のアイコンは#iconスロットで渡す デフォルト 'diamond' */
  icon?: PageSectionIcon;
  /** diamond・circle・squareの大きさ。未指定ならアイコンの既定値(large) */
  iconVariant?: 'large' | 'medium' | 'small';
  /** diamond・circle・squareの色。未指定ならdiamondは#1a44b6、circleは#e78b2f、squareは#d13a2b */
  iconColor?: string;
  /** 見出しに付けるclass */
  titleClass?: ClassValue;
  /** 見出しに付けるstyle */
  titleStyle?: StyleValue;
}
const props = withDefaults(defineProps<Props>(), {
  icon: 'diamond'
});

interface Slots {
  /** 見出しの文字の前に表示するアイコン。iconより優先する */
  icon?(): unknown;
  default?(): unknown;
}
defineSlots<Slots>();

/**
 * プリセットのアイコン。shapeがtrueのものは、大きさと色を受け取る
 * 見出しの既定のアイコンの色は、アイコン側の既定値が変わっても変わらないようにここで持つ
 */
const PRESET_ICONS: Record<PageSectionIcon, { component: Component; shape: boolean; color?: string }> = {
  'diamond': { component: SvgDiamond, shape: true, color: '#1a44b6' },
  'circle': { component: SvgCircle, shape: true, color: '#e78b2f' },
  'square': { component: SvgSquare, shape: true, color: '#d13a2b' },
  'pushpin': { component: SvgPushpin, shape: false },
  'round-pushpin': { component: SvgRoundPushpin, shape: false }
};

const presetIcon = computed((): { component: Component; props: Record<string, unknown> } => {
  const preset = PRESET_ICONS[props.icon];
  return {
    component: preset.component,
    props: preset.shape ? { variant: props.iconVariant, color: props.iconColor ?? preset.color } : {}
  };
});
</script>

<style>
:where(.dwui-page-section) {
  display: block;
  margin: 4px 0 8px;
  padding-top: 2px;
  font-size: var(--dwui-page-section-font-size, 12px);
  font-weight: 500;
}

:where(.dwui-page-section-title) {
  display: flex;
  align-items: center;
  font-size: var(--dwui-page-section-title-font-size, 14px);
}

:where(.dwui-page-section-content) {
  margin: 8px 0 8px 16px;
}
</style>
