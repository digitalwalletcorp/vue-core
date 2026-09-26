type VueCoreComponents = typeof import('../components');

declare module 'vue' {
  interface GlobalComponents extends VueCoreComponents {}
}

export {};
