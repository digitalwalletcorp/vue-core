#### AccordionFieldset

A `<fieldset>` whose contents can be collapsed and expanded with a toggle button in the legend.
When the contents are lower than the collapsed height, the toggle does not shrink them.
The height is measured again whenever the size of the contents changes (e.g., when a hidden tab containing it is shown, or rows are added), so you do not need to tell the component when to re-measure.

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

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<fieldset>` element.

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `icon`    | An icon shown before the legend. |
| `legend`  | Replaces the `legend` prop. |
| `default` | The contents. |

##### 🎨 Styling

The `<legend>` has the `dwui-accordion-legend` class.

| CSS variable                      | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| `--dwui-width-focus-ring`         | Width of the focus ring. Defaults to `2px`.       |
| `--dwui-outline-color-focus-ring` | Color of the focus ring. Defaults to `Highlight`. |
| `--dwui-offset-focus-ring`        | Offset of the focus ring. Defaults to `2px`.      |
