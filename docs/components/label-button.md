#### LabelButton

Renders a button containing an icon and a text label.
It comes with no default styles, allowing you to easily style it by applying your own CSS classes (such as `.btn`).

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

For presets, see [Label Presets](./label-icon.md#label-presets).
