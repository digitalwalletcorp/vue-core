import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';

/** 縮めたときの中身の高さ(px)。中身がこれより低い場合は開閉しない */
export const SHRUNK_HEIGHT = 70;

/**
 * 中身が縮めたときの高さ以上あり、開閉できるかを返す
 * 中身の大きさが変わるたびに測り直すため、隠れたタブの中にあって後から表示された場合や、中身が増減した場合も再判定される
 * 縮めている間も中身の本来の高さで判定する
 *
 * @param {Ref<HTMLElement | undefined>} contents 開閉する中身の要素
 * @returns {Ref<boolean>}
 */
export function useShrinkable(contents: Ref<HTMLElement | undefined>): Ref<boolean> {
  // 測るまではSSRの出力と揃えるため、開閉できるものとして扱う
  const shrinkable = ref(true);
  let resizeObserver: ResizeObserver | undefined;

  onMounted(() => {
    const element = contents.value;
    if (element == null) {
      return;
    }
    // 監視を始めた時点でも1回呼ばれる
    resizeObserver = new ResizeObserver(() => {
      shrinkable.value = SHRUNK_HEIGHT <= element.scrollHeight;
    });
    resizeObserver.observe(element);
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  return shrinkable;
}
