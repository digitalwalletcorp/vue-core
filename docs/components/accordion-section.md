#### AccordionSection

An area whose contents can be collapsed and expanded with a toggle button below them.
When the contents are lower than the collapsed height, the toggle is not shown.
The height is measured again whenever the size of the contents changes (e.g., when a hidden tab containing it is shown), so you do not need to tell the component when to re-measure.

```vue
<template>
  <!-- Default toggle (a triangle) -->
  <AccordionSection>
    {{ longText }}
  </AccordionSection>

  <!-- Toggle with an icon and a label from presets -->
  <AccordionSection :open-preset="labelPresets.open" :close-preset="labelPresets.close">
    {{ longText }}
  </AccordionSection>

  <!-- Toggle with labels only -->
  <AccordionSection :open-label="$t('more')" :close-label="$t('less')">
    {{ longText }}
  </AccordionSection>

  <!-- Toggle with icons only -->
  <AccordionSection>
    <template #open-icon><SvgTriangleButton direction="down" /></template>
    <template #close-icon><SvgTriangleButton direction="up" /></template>
    {{ longText }}
  </AccordionSection>
</template>
```

##### 🔧 Props

| Prop            | Type          | Description |
| --------------- | ------------- | ----------- |
| `disabled`      | `boolean`     | Disables the toggle. |
| `initialExpand` | `boolean`     | Shows the contents expanded at first. Defaults to `false`. |
| `noGradient`    | `boolean`     | Does not fade the bottom of the collapsed contents. |
| `openLabel`     | `string`      | The label of the toggle while collapsed. |
| `closeLabel`    | `string`      | The label of the toggle while expanded. |
| `openPreset`    | `LabelPreset` | The icon and label of the toggle while collapsed. |
| `closePreset`   | `LabelPreset` | The icon and label of the toggle while expanded. |

> 💡 **Toggle contents**
> * The icon and the label are chosen separately. For each, the slot (icon) or the label prop (label) takes precedence over the preset.
> * The default triangle is shown only when neither an icon nor a label is given.
> * For presets, see [Label Presets](./label-icon.md#label-presets).

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root element.

##### 🧩 Slots

| Slot         | Description |
| ------------ | ----------- |
| `open-icon`  | The icon of the toggle while collapsed. Takes precedence over `openPreset`. |
| `close-icon` | The icon of the toggle while expanded. Takes precedence over `closePreset`. |
| `default`    | The contents. |

##### 🎨 Styling

The toggle is a `<button>` styled with zero specificity (`:where()`).
If your application styles the `button` element globally, those styles take precedence. Reset or restyle them in your own CSS through the `.dwui-accordion-section-toggle` class if needed.

| CSS variable | Description |
| ------------ | ----------- |
| `--dwui-accordion-section-fade` | The color the bottom of the collapsed contents fades into. Set it to the background color behind the component. Defaults to `Canvas`. |
