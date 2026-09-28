<!--
砂時計のローディング。
loading=true の間は砂時計アイコン(SvgHourglass)を表示し、false になったら slot の内容(空文字でもそのまま)を表示する。
CSSの :empty に依存しないため「取得成功したが値が空」のケースでも loading が残らない。
-->
<template>
  <SvgHourglass
    v-if="props.loading"
    :duration="props.duration"
    :size="props.size"
    class="dwui-hourglass-loading"
  />
  <slot v-else />
</template>

<script setup lang="ts">
import { SvgHourglass } from '@digitalwalletcorp/vue-svg-icons';

interface Props {
  /** ローディング表示するか */
  loading: boolean;
  /** 砂が落ち切るまでの秒数。未指定ならSvgHourglassの既定値に任せる */
  duration?: number;
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});
</script>

<style>
:where(.dwui-hourglass-loading) {
  animation: dwui-hourglass-loading-spin 1.2s linear infinite;
}

@keyframes dwui-hourglass-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
