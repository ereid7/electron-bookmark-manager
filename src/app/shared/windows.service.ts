import { Injectable } from '@angular/core';

declare var ipcRenderer: any;

declare var electron: any;

@Injectable()
export class WindowsService {

  constructor() { }

  hide() {
    ipcRenderer.send('hide');
  }
}
