import { Injectable, NgZone, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';
import { TabService } from './tab.service';

declare var ipcRenderer: any;

declare var __dirname;

@Injectable()
export class ButtonService implements OnChanges {

    buttonList: any = [];
    sortedList: any = [];
    sortOrder: any;
    tabList: any = [];

    allOrder: any = []

    editmodal: boolean = false;

    constructor(private http: HttpClient, private _electronService: ElectronService,
        private _ngZone: NgZone, private router: Router, private tabService: TabService) {

        this.refresh();
    }

    ngOnChanges() {
        this.refresh();
    }

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
                this.buttonList = data;
                this.sortedList = this.getButtons(this.tabService.currentTab);
            });
    }

    refreshTableView() {
        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/buttons.json')
            .subscribe(data => {
                this.buttonList = data;
            });
        this.router.navigate(['/hotkey']);
    }

    getSortOrder(tabname: string): String[] {

        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/tabs.json')
            .subscribe(data => {

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
        let order = this.getSortOrder(tab);
        let sortedList = [];
        let buttons;

        if (tab === 'All') {
            buttons = this.buttonList;
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
                return buttons;
            }
        } else {
            buttons = this.buttonList.filter(button =>
                button.category === tab);
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

    changeOrder(newList, tab) {
        newList = newList.map((button) => {
            return button.id;
        });

        let order = {
            newList: newList,
            tab: tab
        }
        ipcRenderer.send('swap', order);
    }
}
