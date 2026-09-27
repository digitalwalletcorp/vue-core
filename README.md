# Vue Core

Basic UI components for Vue 3.

#### ✨ Features

* **Tree-shaking**: Only import what you use. Importing a single component won't bundle the rest of the library.
* **Fully typed**: Type definitions are included, allowing your editor to auto-complete props and default values automatically.
* **Easy overrides**: Default styles use zero specificity (`:where()`), so your own CSS always wins.

#### 📦 Installation

```bash
npm install @digitalwalletcorp/vue-core @digitalwalletcorp/vue-svg-icons
# or
yarn add @digitalwalletcorp/vue-core @digitalwalletcorp/vue-svg-icons
```

> ##### ⚠️ Requirements
>
> * **Vue 3.5.29+**: Props are typed with Vue's `ClassValue`, which is exported since Vue 3.5.29.
> * **@digitalwalletcorp/vue-svg-icons 1.13.0+**: A peer dependency for component icons. Installing it alongside `vue-core` ensures a single shared copy of the icon package in your application.

#### 📖 Usage

There are three ways to use the components.

|     | When to use | Bundled components |
| --- | ----------- | ------------------ |
| [Import individually](#1-import-components-individually)                          | When you want to minimize bundle size or prefer explicit imports      | Only the components you import |
| [Register all components globally (Vue)](#2-register-all-components-globally-vue) | When you want to use components without importing them in each file  | All components              |
| [Register components globally (Nuxt)](#3-register-components-globally-nuxt)       | When you want to use components globally in a Nuxt project            | Only the components you use |

##### 1. Import components individually

```vue
<script setup lang="ts">
import { LabelButton } from '@digitalwalletcorp/vue-core';
</script>

<template>
  <LabelButton class="btn" :preset="labelPresets.search" />
</template>
```

##### 2. Register all components globally (Vue)

```ts
// main.ts
import { createApp } from 'vue';
import { registerComponents } from '@digitalwalletcorp/vue-core/register';
import App from './App.vue';

const app = createApp(App);
registerComponents(app);
app.mount('#app');
```

##### 3. Register components globally (Nuxt)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@digitalwalletcorp/vue-core/nuxt']
});
```

##### 📐 Stylesheet

Import the stylesheets to ensure default alignment and icon styles.

* **Vue:** Import in your entry file.

```ts
// main.ts
import '@digitalwalletcorp/vue-core/style.css';
import '@digitalwalletcorp/vue-svg-icons/style.css'; // Required for components using icons from vue-svg-icons
```

* **Nuxt:** Add to your config array.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '@digitalwalletcorp/vue-core/style.css',
    '@digitalwalletcorp/vue-svg-icons/style.css' // Required for components using icons from vue-svg-icons
  ]
});
```

> **💡 Icon Styles**
>
> Components such as `AccordionFieldset` rely on [@digitalwalletcorp/vue-svg-icons](https://www.npmjs.com/package/@digitalwalletcorp/vue-svg-icons). Importing its stylesheet ensures icons align properly with text.

#### 🧰 Components

| Component | Description |
| --------- | ----------- |
| [`AccordionFieldset`](https://github.com/digitalwalletcorp/vue-core/blob/main/docs/components/accordion-fieldset.md) | A fieldset whose contents can be collapsed and expanded from the legend. |
| [`LabelIcon`](https://github.com/digitalwalletcorp/vue-core/blob/main/docs/components/label-icon.md) | Displays an icon and a text label side by side. |
| [`LabelButton`](https://github.com/digitalwalletcorp/vue-core/blob/main/docs/components/label-button.md) | Renders a button containing an icon and a text label. |

#### 📜 License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) file for details.
