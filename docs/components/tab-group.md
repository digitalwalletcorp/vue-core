#### TabGroup / TabContent

`TabGroup` switches between the `TabContent` components placed inside it with tab headers.
All `TabContent` components are rendered at once and only the selected one is shown, so each keeps its state while hidden.

> ⚠️ Place each `TabContent` directly inside `TabGroup` (or render them with `v-for` directly inside it). `TabGroup` builds the headers from its direct children, so a `TabContent` wrapped in another component is not recognized.

```vue
<template>
  <TabGroup v-model:selected-tab-label-id="selectedTab">
    <!-- Optional: replaces the default loading indicator -->
    <template #loading><SvgHourglass size="48px" /></template>

    <!-- Header with an icon -->
    <TabContent label-id="basic" description="Basic">
      <template #icon><SvgBustInSilhouette /></template>
      <BasicTab />
    </TabContent>

    <!-- Receive the slot props to load data when the tab is selected -->
    <TabContent
      v-slot="{ activated, setLoading }"
      label-id="history"
      description="History"
      :status="hasError ? 'error' : undefined"
    >
      <HistoryTab :activated="activated" :set-loading="setLoading" />
    </TabContent>
  </TabGroup>
</template>
```

```ts
// HistoryTab.vue: load data each time the tab is selected
const props = defineProps<{ activated: boolean; setLoading: (loading: boolean) => void }>();
watch(() => props.activated, async (activated) => {
  if (activated) {
    props.setLoading(true);
    try {
      await fetchHistory();
    } finally {
      props.setLoading(false);
    }
  }
});
```

##### 🔧 Props (TabGroup)

| Prop                 | Type         | Description |
| -------------------- | ------------ | ----------- |
| `selectedTabLabelId` | `string`     | The `labelId` of the selected tab. Bind it with `v-model:selected-tab-label-id`. The first tab is selected when omitted. |
| `selectFirstEnabled` | `boolean`    | When `selectedTabLabelId` is omitted, selects the first tab that is not disabled. Defaults to `false`, which selects the first tab even if it is disabled (its contents are then empty). |
| `tabGroupName`       | `string`     | The `name` of the radio buttons behind the headers. Generated automatically when omitted. |
| `headerClass`        | `ClassValue` | Class for the element containing the headers. |
| `headerStyle`        | `StyleValue` | Style for the element containing the headers. |
| `teleport`           | `string`     | Moves the headers to this target (`to` of `<Teleport>`). |

##### 📣 Events (TabGroup)

| Event                    | Payload            | Description |
| ------------------------ | ------------------ | ----------- |
| `update:selectedTabLabelId` | `labelId: string` | Emitted when a header is selected (used by `v-model`). |
| `emit:changeSelectedTab` | `labelId: string`  | Emitted when a header is selected. |

> ⚠️ When you pass `selectedTabLabelId`, bind it with `v-model`. The selected tab is owned by the parent, so a one-way binding (`:selected-tab-label-id` without updating the value) keeps the tab from switching on click. Binding with `v-model` also lets the parent reselect a tab at any time, e.g. back to the first tab after saving.

##### 🧩 Slots (TabGroup)

| Slot      | Description |
| --------- | ----------- |
| `default` | The `TabContent` components. |
| `loading` | Shown over a `TabContent` while it is loading. The default indicator is used when omitted. |

##### 🔧 Props (TabContent)

| Prop          | Type                 | Description |
| ------------- | -------------------- | ----------- |
| `labelId`     | `string`             | Identifies the tab. Required. |
| `description` | `string`             | The header text. Required. |
| `disabled`    | `boolean`            | Makes the tab unselectable and does not render its contents. |
| `status`      | `'warn' \| 'error'`  | Changes the header color. |
| `headerClass` | `ClassValue`         | Class for the header of this tab. |
| `headerStyle` | `StyleValue`         | Style for the header of this tab. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root element of each component.

##### 🧩 Slots (TabContent)

| Slot      | Slot props | Description |
| --------- | ---------- | ----------- |
| `icon`    | —          | An icon shown before the header text. It is rendered in the header, not in the contents. |
| `default` | `activated: boolean`, `setLoading: (loading: boolean) => void` | The contents. `activated` is `true` while the tab is selected, after `TabGroup` is mounted. Pass it to your component as a prop to run the process on selection. `setLoading(true)` lays the loading indicator over the contents and blocks interaction until `setLoading(false)`. |

##### 🎨 Styling

| CSS variable | Description |
| ------------ | ----------- |
| `--dwui-loading-overlay`              | Overlay laid over the contents while loading. |
| `--dwui-loading-spinner-size`         | Size of the default loading spinner. |
| `--dwui-loading-spinner-color`        | Color of the moving part of the default spinner. |
| `--dwui-loading-spinner-track`        | Color of the track of the default spinner. |
| `--dwui-tab-border`                   | Border of the headers and the contents. |
| `--dwui-tab-header-accent`            | Bottom border of the headers. |
| `--dwui-tab-header-bg`                | Header background. |
| `--dwui-tab-header-text`              | Header text. |
| `--dwui-tab-header-selected-bg`       | Background of the selected header. |
| `--dwui-tab-header-selected-text`     | Text of the selected header. |
| `--dwui-tab-header-disabled-bg`       | Background of a disabled header. |
| `--dwui-tab-header-hover-overlay`     | Color laid over a header on hover. |
| `--dwui-tab-header-warn-bg`           | Header background with `status="warn"`. |
| `--dwui-tab-header-warn-selected-bg`  | Selected header background with `status="warn"`. |
| `--dwui-tab-header-warn-text`         | Header text with `status="warn"`. |
| `--dwui-tab-header-error-bg`          | Header background with `status="error"`. |
| `--dwui-tab-header-error-selected-bg` | Selected header background with `status="error"`. |
| `--dwui-tab-header-error-text`        | Header text with `status="error"`. |
| `--dwui-tab-slide-distance`           | Where the contents slide in from when a tab is selected (`translateX`). Defaults to `-128px`. |
| `--dwui-tab-slide-duration`           | Duration of the slide-in. Defaults to `0.35s`. |
| `--dwui-tab-slide-easing`             | Timing function of the slide-in. Defaults to `cubic-bezier(0.22, 1, 0.36, 1)`. |
