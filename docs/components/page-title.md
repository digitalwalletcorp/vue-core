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

| Prop    | Type     | Description               |
| ------- | -------- | ------------------------- |
| `title` | `string` | The title text. Required. |

> 💡 Non-prop attributes (`class`, `style`, `aria-*`, etc.) are applied directly to the root `<section>` element. Use `style` to change the width of one title bar.

##### 🧩 Slots

| Slot      | Description                               |
| --------- | ----------------------------------------- |
| `icon`    | An icon shown before the title.           |
| `default` | Shown on the right side of the title bar. |

##### 🎨 Styling

| CSS variable                    | Description                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `--dwui-background-page-title`  | Background. Defaults to a gradient with #323232 and rgb(32, 32, 31) in light, and #3c3f45 and #2b2d31 in dark. |
| `--dwui-color-text-page-title`  | Text color.                                                                                                    |
| `--dwui-width-page-title`       | Width. Defaults to `auto`.                                                                                     |
| `--dwui-font-size-page-title`   | Font size. Defaults to `14px`.                                                                                 |
| `--dwui-font-weight-page-title` | Font weight. Defaults to `normal`.                                                                             |
