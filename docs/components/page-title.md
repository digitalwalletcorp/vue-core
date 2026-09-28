#### PageTitle

The title bar of a page. The contents of the default slot are shown on its right side.

```vue
<template>
  <!-- Title only -->
  <PageTitle :title="$t('dashboard.title')" />

  <!-- Title with an icon -->
  <PageTitle title="Broadcast">
    <template #icon><SvgEMail /></template>
  </PageTitle>

  <!-- Contents on the right side -->
  <PageTitle :title="$t('report.title')" style="width: 1000px;">
    <LastUpdate />
  </PageTitle>
</template>
```

##### 🔧 Props

| Prop    | Type     | Description |
| ------- | -------- | ----------- |
| `title` | `string` | The title text. Required. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<section>` element. Use `style` to change the width of one title bar.

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `icon`    | An icon shown before the title. |
| `default` | Shown on the right side of the title bar. |

##### 🎨 Styling

| CSS variable | Description |
| ------------ | ----------- |
| `--dwui-page-title-bg`          | Background. |
| `--dwui-page-title-text`        | Text color. |
| `--dwui-page-title-width`       | Width. Defaults to `auto`. |
| `--dwui-page-title-font-size`   | Font size. Defaults to `14px`. |
| `--dwui-page-title-font-weight` | Font weight. Defaults to `normal`. |
