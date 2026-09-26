#### LabelIcon

Displays an icon and a text label side by side, centered vertically.
Since the root element is a `<span>`, it can be safely used inside inline contexts such as `<label>` or `<a>` without breaking the layout.

```vue
<template>
  <!-- Display icon and label from a preset -->
  <LabelIcon :preset="labelPresets.search" />

  <!-- Override the label text only -->
  <LabelIcon :preset="labelPresets.search">DUPLICATE DETAIL</LabelIcon>

  <!-- Specify both via slots without using a preset -->
  <LabelIcon>
    <template #icon><SvgMagnifyingGlass direction="top-right" /></template>
    DUPLICATE DETAIL
  </LabelIcon>
</template>
```

##### 🔧 Props

| Prop         | Type          | Description |
| ------------ | ------------- | ----------- |
| `preset`     | `LabelPreset` | The icon and label to display. Optional when both are given by slots. |
| `gap`        | `string`      | Space between the icon and the label. When omitted, the stylesheet default (`0.25em`) applies and can be overridden by your CSS. |
| `iconClass`  | `ClassValue`  | Class for the preset icon. For an icon given by the `#icon` slot, write the class on the slot content directly. |
| `iconStyle`  | `StyleValue`  | Style for the preset icon. Same as above for the `#icon` slot. |
| `labelClass` | `ClassValue`  | Class for the element wrapping the label. |
| `labelStyle` | `StyleValue`  | Style for the element wrapping the label. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<span>` element.

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `icon`    | Replaces the preset icon. |
| `default` | Replaces the preset label. The content is wrapped in a single element, so mixed content such as `foo <b>bar</b>` stays together. |

##### 🎨 Label Presets

A preset pairs an icon with a label. We recommend defining all presets in a single file and passing them via `:preset`.
Defining presets with `satisfies` gives you full type safety—typos like `labelPresets.serch` will be caught instantly as type errors.

```ts
// label-presets.ts (in your application)
import type { LabelPreset } from '@digitalwalletcorp/vue-core';
import { SvgCrossMark, SvgDownload, SvgMagnifyingGlass } from '@digitalwalletcorp/vue-svg-icons';
// t() is the translate function of your i18n library

export const labelPresets = {
  search: {
    icon: SvgMagnifyingGlass,
    label: () => t('button.search')
  },
  download: {
    icon: SvgDownload,
    iconProps: { size: 16 },
    label: () => t('button.download')
  },
  close: {
    icon: SvgCrossMark,
    label: 'Close'
  }
} satisfies Record<string, LabelPreset>;
```

| Property | Type | Description |
| -------- | ---- | ----------- |
| `icon`      | `Component`                 | The icon component. |
| `iconProps` | `Record<string, unknown>`   | Props passed to the icon component. |
| `label`     | `string \| (() => string)`  | `label` accepts either a static `string` or a getter function `() => string`. Use a getter function to support dynamic runtime changes, such as i18n locale updates. |
