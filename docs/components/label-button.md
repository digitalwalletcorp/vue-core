#### LabelButton

Renders a button containing an icon and a text label.

```vue
<template>
  <LabelButton
    class="btn"
    type="button"
    :preset="labelPresets.search"
    @click="onClickSearch"
  />
</template>
```

> 💡 **Usage Notes**
> * Attributes such as `class`, `style`, `@click`, and `disabled` are passed directly through to the `<button>` element.
> * To prevent unexpected form submissions inside a `<form>`, specify `type="button"` explicitly as you would with a standard `<button>`.
> * Powered by `LabelIcon` under the hood—all Props and Slots are fully compatible with `LabelIcon`.

##### 🔧 Props

| Prop         | Type          | Description |
| ------------ | ------------- | ----------- |
| `preset`     | `LabelPreset` | The icon and label to display. Optional when both are given by slots. |
| `gap`        | `string`      | Space between the icon and the label. When omitted, the stylesheet default (`0.25em`) applies and can be overridden by your CSS. |
| `iconClass`  | `ClassValue`  | Class for the preset icon. For an icon given by the `#icon` slot, write the class on the slot content directly. |
| `iconStyle`  | `StyleValue`  | Style for the preset icon. Same as above for the `#icon` slot. |
| `labelClass` | `ClassValue`  | Class for the element wrapping the label. |
| `labelStyle` | `StyleValue`  | Style for the element wrapping the label. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<button>` element.

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `icon`    | Replaces the preset icon. |
| `default` | Replaces the preset label. The content is wrapped in a single element, so mixed content such as `foo <b>bar</b>` stays together. |

##### 🎨 Styling

The root `<button>` has the `dwui-label-button` class.

| CSS variable                      | Description |
| --------------------------------- | ----------- |
| `--dwui-background-label-button`  | Background of the button. Defaults to `#f4f4f4` in light and `#3a3c40` in dark. |
| `--dwui-background-label-button-hover` | Background of the button when hovered. Defaults to `#e6e6e6` in light and `#474a50` in dark. |
| `--dwui-background-label-button-active` | Background of the button when active. Defaults to `#d6d6d6` in light and `#2f3135` in dark. |
| `--dwui-border-color-label-button` | Border color of the button. Defaults to `#8f8f8f` in light and `#6b6f76` in dark. |
| `--dwui-color-text-label-button`  | Text color of the button. Defaults to `#1a1a1a` in light and `#e6e6e6` in dark. |
| `--dwui-width-focus-ring`         | Width of the focus ring. Defaults to `2px`. |
| `--dwui-outline-color-focus-ring` | Color of the focus ring. Defaults to `Highlight`. |
| `--dwui-offset-focus-ring`        | Offset of the focus ring. Defaults to `2px`. |

For presets, see [Label Presets](./label-icon.md#label-presets).
