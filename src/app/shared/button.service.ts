import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';
// import { IpcRenderer } from 'electron';

declare let open: any;

declare var electron: any;

declare var ipcRenderer: any;

declare var __dirname;

@Injectable()
export class ButtonService {
    // private _ipc: IpcRenderer | undefined = void 0;

    buttonList: any;

    editmodal: boolean = false;

    constructor(private http: HttpClient, private _electronService: ElectronService, private _ngZone: NgZone, private router: Router) {

        this.refresh();

    }

    // TODO put this and openlink in seperate service
    guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    add(button: any) {
        ipcRenderer.send('add-data', button);

        // TODO find way to wait for ipc response
        this.sleep(400);

        this.refresh();
    }

    update(button: any, view: number) {
        ipcRenderer.send('update-data', button);

        this.sleep(200);

        view === 0 ? this.refresh() : this.refreshTableView();
    }

    delete(button: any, view: number) {
        ipcRenderer.send('delete-data', button);

        this.sleep(200);

        view === 0 ? this.refresh() : this.refreshTableView();
    }

    //TODO put in shared method service because tab service uses
    refresh() {
        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/buttons.json')
            .subscribe(data => {
                console.log(data)
                this.buttonList = data;
            });
        this.router.navigate(['/home']);
    }

    refreshTableView() {
        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/buttons.json')
            .subscribe(data => {
                console.log(data)
                this.buttonList = data;
            });
        this.router.navigate(['/hotkey']);
    }

    getButtons() {
        return this.buttonList;
    }

    getHotkeyButtons() {
        return this.buttonList.filter(it => {
            if (!it.shortcut || it.shortcut === '') {
                return false;
            } else {
                return true;
            }
        });
    }

    openLink(url: string) {
        open(url, "chrome");
    }

    openHelpLink() {
        open('https://electronjs.org/docs/api/accelerator#available-modifiers', "chrome");
    }
}
