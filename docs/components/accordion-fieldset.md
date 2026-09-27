#### AccordionFieldset

A `<fieldset>` whose contents can be collapsed and expanded with a toggle button in the legend.
When the contents are lower than the collapsed height, the toggle does not shrink them.

```vue
<template>
  <!-- Legend as text -->
  <AccordionFieldset legend="Search conditions">
    ...
  </AccordionFieldset>

  <!-- Legend with an icon -->
  <AccordionFieldset legend="Search conditions" :initial-expand="true">
    <template #icon><SvgMagnifyingGlass direction="top-right" /></template>
    ...
  </AccordionFieldset>

  <!-- Legend containing markup -->
  <AccordionFieldset>
    <template #legend>Latest <strong>10</strong> Jobs</template>
    ...
  </AccordionFieldset>
</template>
```

##### 🔧 Props

| Prop            | Type      | Description |
| --------------- | --------- | ----------- |
| `legend`        | `string`  | The legend text. It is rendered as plain text. Use the `#legend` slot for markup. |
| `disabled`      | `boolean` | Disables the `<fieldset>`. |
| `initialExpand` | `boolean` | Shows the contents expanded at first. Defaults to `false`. |
| `observer`      | `unknown` | Pass a state value (e.g., table data or array length) that changes when the content resizes. When updated, it re-measures the content height to show/hide the toggle properly. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<fieldset>` element.

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `icon`    | An icon shown before the legend. |
| `legend`  | Replaces the `legend` prop. |
| `default` | The contents. |

##### 🎨 Styling

The toggle is a `<button>` styled with zero specificity (`:where()`).
If your application styles the `button` element globally, those styles take precedence. Reset them in your own CSS through the `.dwui-accordion-toggle` class if needed.
