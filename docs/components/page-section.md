#### PageSection

A section of a page with a heading.

```vue
<template>
  <!-- Heading with the default icon (a diamond) -->
  <PageSection :title="$t('report.summary')">
    ...
  </PageSection>

  <!-- Preset icon with a variant and a color -->
  <PageSection title="Revenue" icon="circle" icon-variant="small" icon-color="#f09536">
    ...
  </PageSection>

  <!-- Any other icon -->
  <PageSection title="Settings">
    <template #icon><SvgGear /></template>
    ...
  </PageSection>
</template>
```

##### 🔧 Props

| Prop          | Type                                                              | Description |
| ------------- | ----------------------------------------------------------------- | ----------- |
| `title`       | `string`                                                          | The heading text. The heading is not rendered when omitted. |
| `icon`        | `'diamond' \| 'circle' \| 'square' \| 'pushpin' \| 'round-pushpin'` | The icon before the heading. Defaults to `'diamond'`. Use the `#icon` slot for any other icon. |
| `iconVariant` | `'large' \| 'medium' \| 'small'`                                  | The size of `diamond`, `circle` and `square`. The icon's default (`large`) applies when omitted. |
| `iconColor`   | `string`                                                          | The color of `diamond`, `circle` and `square`. Defaults to `#1a44b6` for `diamond`, `#e78b2f` for `circle` and `#d13a2b` for `square`. |
| `titleClass`  | `ClassValue`                                                      | Class for the heading. |
| `titleStyle`  | `StyleValue`                                                      | Style for the heading. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<section>` element.

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `icon`    | Replaces the icon selected by `icon`. |
| `default` | The contents. |

##### 🎨 Styling

| CSS variable | Description |
| ------------ | ----------- |
| `--dwui-page-section-font-size`       | Font size of the section. Defaults to `12px`. |
| `--dwui-page-section-title-font-size` | Font size of the heading. Defaults to `14px`. |
