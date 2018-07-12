import { Injectable, NgZone, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';
import { TabService } from './tab.service';
// import { IpcRenderer } from 'electron';

declare let open: any;

declare var electron: any;

declare var ipcRenderer: any;

declare var __dirname;

@Injectable()
export class ButtonService implements OnChanges {
    // private _ipc: IpcRenderer | undefined = void 0;

    // this.buttonOrder = this.getSortOrder(tab);
    // this.sortedList = [];
    // for (let button of this.buttonOrder) {
    //     for (let but of this.buttonList) {
    //         if (button === but.id) {
    //             this.sortedList.push(but);
    //         }
    //     }
    // }
    // return this.sortedList;

    buttonList: any = [];
    sortedList: any = [];
    sortOrder: any;
    tabList: any = [];

    allOrder: any = []

    editmodal: boolean = false;

    constructor(private http: HttpClient, private _electronService: ElectronService,
        private _ngZone: NgZone, private router: Router, private tabService: TabService) {

        this.refresh();
        // this.sortOrder = this.getSortOrder(this.tabService.currentTab);
    }

    ngOnChanges() {
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
        this.sleep(600);

        this.sortedList = this.getButtons(this.tabService.currentTab);
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
                // console.log(data)
                this.buttonList = data;
                this.sortedList = this.getButtons(this.tabService.currentTab);
            });
        //this.router.navigate(['/home']);
    }

    refreshTableView() {
        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/buttons.json')
            .subscribe(data => {
                //  console.log(data)
                this.buttonList = data;
            });
        this.router.navigate(['/hotkey']);
    }

    getSortOrder(tabname: string): String[] {

        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/tabs.json')
            .subscribe(data => {

                //console.log(data)
                this.tabList = data;
                this.allOrder = this.tabList.all;
                this.tabList = this.tabList.tabs;
            });
        if (tabname === 'All') {
            return this.allOrder;
        } else {
            for (let tab of this.tabList) {
                if (tab.name === tabname) {
                    if (tab.order) {
                        //console.log(tab.order);
                        return tab.order;
                    } else {
                        return [];
                    }
                }
            }
        }
        //this.sleep(400);
    }

    getButtons(tab: string) {
        // fix some shitg here
        // let order: any[] = this.getSortOrder(tab); // figure out
        let order = this.getSortOrder(tab);
        let sortedList = [];
        let buttons;

        if (tab === 'All') {
            buttons = this.buttonList;
            if (order.length < 0) {
                for (let id of order) {
                    for (let but of buttons) {
                        if (id === but.id) {
                            sortedList.push(but);
                        }
                    }
                }

                this.sortedList = sortedList;
                return sortedList;
            } else {
                return buttons;
            }
        } else {
            buttons = this.buttonList.filter(button =>
                button.category === tab);
            //console.log(buttons);
            if (order) { // todo create order if not there possibly?
                if (order.length > 0) {
                    for (let id of order) {
                        for (let but of buttons) {
                            if (id === but.id) {
                                sortedList.push(but);
                            }
                        }
                    }
                    this.sortedList = sortedList;
                    return sortedList;
                } else {
                    this.sortedList = sortedList;
                    return buttons;
                }
            } else return buttons;
        }
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
