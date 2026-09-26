import type { App, Component } from 'vue';
import * as components from '@/components';

type VueCoreComponents = typeof components;

declare module 'vue' {
  interface GlobalComponents extends VueCoreComponents {}
}

export function registerComponents(app: App) {
  for (const [name, component] of Object.entries<Component>(components)) {
    app.component(name, component);
  }
}
