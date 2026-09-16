declare module '@foundryvtt/foundryvtt-cli' {
  export function compilePack(
    src: string,
    dest: string,
    options?: { nedb?: boolean; yaml?: boolean; recursive?: boolean; log?: boolean; transformEntry?: (doc: object, context: object) => unknown },
  ): Promise<void>;
}
