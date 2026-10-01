<!--
TabContentを並べてタブで切り替える
-->
<template>
  <div class="dwui-tab-group">
    <!-- SSRではtoが空だとdisabledでも何も出力されないため、移動しない場合も有効なセレクタを渡す -->
    <Teleport
      :to="props.teleport ?? 'body'"
      :disabled="props.teleport == null"
    >
      <div
        class="dwui-tab-headers"
        :class="props.headerClass"
        :style="props.headerStyle"
      >
        <template
          v-for="tab in tabs"
          :key="tab.labelId"
        >
          <input
            :id="`${groupName}-${tab.labelId}`"
            type="radio"
            class="dwui-tab-radio"
            :name="groupName"
            :disabled="tab.disabled"
            :checked="tab.labelId === activeLabelId"
            @change="onChangeTab(tab.labelId)"
          >
          <label
            :for="`${groupName}-${tab.labelId}`"
            class="dwui-tab-item"
            :class="[tab.status != null ? `dwui-tab-${tab.status}` : undefined, tab.headerClass]"
            :style="tab.headerStyle"
            :data-test-tab-content-control="tab.labelId"
          >
            <LabelIcon>
              <template
                v-if="tab.icon != null"
                #icon
              >
                <component :is="tab.icon" />
              </template>
              {{ tab.description }}
            </LabelIcon>
          </label>
        </template>
      </div>
    </Teleport>
    <div class="dwui-tab-items">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, useId } from 'vue';
import type { ClassValue, Slot, StyleValue, VNode } from 'vue';
import LabelIcon from '@/label-icon.vue';
import TabContent from '@/tab-content.vue';
import { tabGroupContextKey } from '@/internal/tab-group-context';
import type { TabContentStatus } from '@/internal/tab-group-context';

interface Props {
  /** ラジオボタンのname。未指定なら自動で採番する */
  tabGroupName?: string;
  /** selectedTabLabelIdが未指定のとき、trueならdisabledでない最初のタブを選ぶ。falseなら先頭のタブ(disabledなら中身は空になる) */
  selectFirstEnabled?: boolean;
  /** タブの見出しを並べる部分に付けるclass */
  headerClass?: ClassValue;
  /** タブの見出しを並べる部分に付けるstyle */
  headerStyle?: StyleValue;
  /** タブの見出しを移動する先(Teleportのto) */
  teleport?: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: 'emit:changeSelectedTab', labelId: string): void;
}
const emit = defineEmits<Emits>();

/**
 * 選択するタブのlabelId。未指定なら先頭のタブ
 * 親がいつ代入しても選び直せるよう、v-model:selected-tab-label-idで同期する前提とする
 */
const selectedLabelId = defineModel<string>('selectedTabLabelId');

interface Slots {
  default?(): VNode[];
  /** 読み込み中のTabContentに重ねて表示する内容。未指定なら既定の読み込み中表示 */
  loading?(): VNode[];
}
const slots = defineSlots<Slots>();

/** タブの見出しの描画に使う、TabContentの指定 */
interface TabHeader {
  labelId: string;
  description: string;
  disabled: boolean;
  status?: TabContentStatus;
  headerClass?: ClassValue;
  headerStyle?: StyleValue;
  icon?: Slot;
}

const groupName = props.tabGroupName ?? useId();

/**
 * TabContentのVNodeから見出しの指定を取り出す
 * propsのキーはテンプレートの書き方(label-id / labelId)のまま入っているため、両方を見る
 *
 * @param {VNode} vnode
 * @returns {TabHeader | undefined}
 */
const toTabHeader = (vnode: VNode): TabHeader | undefined => {
  // v-ifで消えたときのコメントなど、TabContent以外のVNodeは除外する
  if (vnode.type !== TabContent) {
    return undefined;
  }
  const vnodeProps = vnode.props ?? {};
  const disabled = vnodeProps.disabled;
  return {
    labelId: String(vnodeProps['label-id'] ?? vnodeProps.labelId),
    description: vnodeProps.description,
    // 属性だけを書いた場合(<TabContent disabled>)は空文字になる
    disabled: disabled === '' || !!disabled,
    status: vnodeProps.status,
    headerClass: vnodeProps['header-class'] ?? vnodeProps.headerClass,
    headerStyle: vnodeProps['header-style'] ?? vnodeProps.headerStyle,
    // TabContentの#iconスロットは、TabContentではなくここで見出しに描画する
    icon: (vnode.children as Record<string, Slot | undefined> | null)?.icon
  };
};

const tabs = computed((): TabHeader[] => {
  const headers: TabHeader[] = [];
  for (const vnode of slots.default?.() ?? []) {
    // v-forで並べたTabContentは、Fragmentのchildrenに入る
    const candidates = Array.isArray(vnode.children) ? vnode.children as VNode[] : [vnode];
    for (const candidate of candidates) {
      const header = toTabHeader(candidate);
      if (header) {
        headers.push(header);
      }
    }
  }
  return headers;
});

// 選ばれるまでは先頭のタブを選択中とする。スロットは描画中に読む必要があるため、setupの時点では先頭を確定しない
const activeLabelId = computed((): string | undefined => {
  if (selectedLabelId.value != null) {
    return selectedLabelId.value;
  }
  const first = props.selectFirstEnabled ? tabs.value.find(tab => !tab.disabled) : tabs.value[0];
  return first?.labelId;
});
// タブの中身はactivatedを契機にAPIを呼ぶため、親の画面のonMountedで検索条件が整う前に通知しないよう、マウント後に通知を始める
const mounted = ref(false);
provide(tabGroupContextKey, { activeLabelId, mounted, loadingSlot: () => slots.loading });

onMounted(() => {
  mounted.value = true;
});

const onChangeTab = (labelId: string) => {
  selectedLabelId.value = labelId;
  emit('emit:changeSelectedTab', labelId);
};
</script>

<style>
:where(.dwui-tab-group) {
  margin-bottom: 8px;
}

:where(.dwui-tab-headers) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  margin-top: 5px;
  padding-bottom: 4px;
}

:where(.dwui-tab-radio) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

:where(.dwui-tab-item) {
  display: block;
  min-width: 100px;
  padding: 0 4px;
  border: 1px solid var(--dwui-border-color-tab, light-dark(#565656, #8a8a8a));
  border-bottom: 1px solid var(--dwui-border-color-tab-header-accent, #5ab4bd);
  background: var(--dwui-background-tab-header, linear-gradient(light-dark(#1313c7, #2a3a8f), light-dark(navy, #141c4d)));
  line-height: 2em;
  text-align: center;
  white-space: nowrap;
  color: var(--dwui-color-text-tab-header, azure);
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s ease;
}

:where(.dwui-tab-radio:checked + .dwui-tab-item) {
  background: var(--dwui-background-tab-header-selected, linear-gradient(light-dark(#1313c7, #2a3a8f), light-dark(rgb(149, 149, 234), #5a62b8), light-dark(#1313c7, #2a3a8f)));
  color: var(--dwui-color-text-tab-header-selected, azure);
  /* 選択済みのタブは操作の対象ではないためカーソルを既定にする */
  cursor: default;
}

:where(.dwui-tab-radio:disabled + .dwui-tab-item) {
  background: var(--dwui-background-tab-header-disabled, light-dark(gray, #4a4a4a));
  cursor: not-allowed;
}

:where(.dwui-tab-item.dwui-tab-warn) {
  background: var(--dwui-background-tab-header-warn, light-dark(#efef13, #8a8a10));
  color: var(--dwui-color-text-tab-header-warn, light-dark(midnightblue, #fffbd0));
}

:where(.dwui-tab-radio:checked + .dwui-tab-item.dwui-tab-warn) {
  background: var(--dwui-background-tab-header-warn-selected, linear-gradient(light-dark(#fafa06, #8a8a10), light-dark(rgb(232, 238, 206), #a8a860), light-dark(#fafa06, #8a8a10)));
}

:where(.dwui-tab-item.dwui-tab-error) {
  background: var(--dwui-background-tab-header-error, light-dark(red, #a01818));
  color: var(--dwui-color-text-tab-header-error, azure);
}

:where(.dwui-tab-radio:checked + .dwui-tab-item.dwui-tab-error) {
  background: var(--dwui-background-tab-header-error-selected, linear-gradient(light-dark(#ff0000, #a01818), light-dark(rgb(240, 136, 136), #c86060), light-dark(#ff0000, #a01818)));
}

:where(.dwui-tab-radio:not(:checked) + .dwui-tab-item:hover) {
  /* 背景の上に半透明の白を重ね、枠線と文字はそのままで背景だけを明るくする */
  box-shadow: inset 0 0 0 999px var(--dwui-overlay-color-tab-header-hover, light-dark(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.15)));
}

:where(.dwui-tab-radio:focus-visible + .dwui-tab-item) {
  outline: var(--dwui-width-focus-ring, 2px) solid var(--dwui-outline-color-focus-ring, Highlight);
  outline-offset: var(--dwui-offset-focus-ring, 2px);
}

:where(.dwui-tab-items) {
  height: 100%;
  border: 1px solid var(--dwui-border-color-tab, light-dark(#565656, #8a8a8a));
  /* 中身を切り替えたときのスライドを枠内に収める */
  overflow: hidden;
}
</style>
