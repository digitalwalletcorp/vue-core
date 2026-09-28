#### HourglassLoading

Shows a rotating hourglass ([`SvgHourglass`](https://www.npmjs.com/package/@digitalwalletcorp/vue-svg-icons)) while `loading` is `true`, and the slot contents once it becomes `false`.
It does not rely on the CSS `:empty` selector, so the loading indicator does not remain even when the loaded value is an empty string.

```vue
<template>
  <!-- Show the value once it has been loaded -->
  <td><HourglassLoading :loading="isLoading">{{ value }}</HourglassLoading></td>

  <!-- Change the speed of the falling sand and the size -->
  <HourglassLoading :loading="isLoading" :duration="3" size="16px">{{ value }}</HourglassLoading>
</template>
```

##### 🔧 Props

| Prop       | Type               | Description |
| ---------- | ------------------ | ----------- |
| `loading`  | `boolean`          | Shows the hourglass while `true`. Required. |
| `duration` | `number`           | Seconds for the sand to fall. The default of `SvgHourglass` applies when omitted. |
| `size`     | `number \| string` | Height of the hourglass. Numbers are treated as px. Defaults to `1.2em`. |

##### 🧩 Slots

| Slot      | Description |
| --------- | ----------- |
| `default` | The contents shown once `loading` becomes `false`. |
