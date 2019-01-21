/* SystemJS module definition */
declare var module: NodeModule;
declare var electron: any;
declare module 'electron-router';

interface NodeModule {
  id: string;
}

interface Window {
  require: NodeRequire;
}