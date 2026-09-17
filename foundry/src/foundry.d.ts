/**
 * Thin ambient types for the Foundry v14 client globals the system touches (core-plan section 7).
 * Signatures are checked against the installed 14.365 client source, not typed here in full.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const foundry: any;
declare const game: any;
declare const CONFIG: any;
declare const Hooks: {
  once(hook: string, fn: (...args: any[]) => unknown): number;
  on(hook: string, fn: (...args: any[]) => unknown): number;
  off(hook: string, id: number): void;
  callAll(hook: string, ...args: any[]): boolean;
};
declare const ui: any;
declare const CONST: any;

declare module 'virtual:wof-config' {
  const config: unknown;
  export default config;
}

declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component<any>;
  export default component;
}
