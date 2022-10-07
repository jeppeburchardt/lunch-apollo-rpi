export function log(...args: any[]) {
  // tslint:disable-next-line:no-console
  console.log.apply(console, [new Date().toISOString(), ...args]);
}
