/* SystemJS module definition */
declare var module: NodeModule;
declare var electron: any;
declare module 'open';
declare module 'electron-router';

// declare module "*.json" {
//   const value: any;
//   export default value;
// }

interface NodeModule {
  id: string;
}

interface Window {
  require: NodeRequire;
}