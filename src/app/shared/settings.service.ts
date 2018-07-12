import { Injectable, OnInit, OnChanges } from '@angular/core';
import { TabService } from './tab.service';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import * as savedSettings from '../../assets/storage/settings.json';     ,

declare var ipcRenderer: any;

declare var __dirname;

@Injectable()
export class SettingsService implements OnInit {

    settings = {
        theme: "Light",
        buttonSize: "Normal",
    }

    editHotkeyMode: boolean = false;

    constructor(private tabService: TabService, private http: HttpClient, private sharedService: SharedService, private router: Router) {

        // this.settings = this.mockSettings;

        // this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/settings.json')
        //     .subscribe(data => {
        //         this.settings = data;
        //     });

        // this.settings = savedSettings;
    }

    public getJSON(): Observable<any> {
        return this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/settings.json')
            .map((res) => res);

    }

    changeSettings() {
        this.getJSON().subscribe(
            data => this.settings = data);
    }

    ngOnInit() {
        // this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/settings.json')
        //     .subscribe(data => {
        //         console.log(data)
        //         this.settings = data;
        //     });
        this.getJSON().subscribe(
            data => this.settings = data);
    }

    mockSettings = {
        buttonSize: 0,
        theme: 1,
    }

    updateSettings(updatedSettings: any) {
        this.settings = updatedSettings;

        ipcRenderer.send('update-settings', updatedSettings);

        this.sharedService.sleep(200);

        this.getJSON().subscribe(
            data => this.settings = data);
    }

    // TODO put in shared
    // refresh() {
    //     this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/settings.json')
    //         .subscribe(data => {
    //             console.log(data)
    //             this.settings = data;
    //         });
        // this.router.navigate(['/home']);
    // }

    // getButtonSize() {
    //     if (this.settings.buttonSize)
    // }

    // TODO LINE 7796 clarity css

    getTheme() {
        if (this.settings.theme === 'Dark') {
            return 'darkMode';
        } else {
            return '';
        }
    }

    getGridHeaderTheme() {
        return this.settings.theme === 'Dark' ? 'darkGridHeader' : '';
    }

    getGridIconTheme() {
        return this.settings.theme === 'Dark' ? 'darkGridIcon' : 'editButton';
    }

    getGridTheme() {
        return this.settings.theme === 'Dark' ? 'darkGrid' : '';
    }

    getAddButtonClass() {
        if (this.settings.buttonSize = 'Small') {
            return 'btn btn-outline addbutton btn-sm';
        } else { return 'btn btn-outline addbutton'; }
    }

    getBackGroundTheme() {

        if (this.settings.theme === 'Dark') {
            return 'darkModeBackGround';
        } else {
            return '';
        }
    }

    getTextTheme() {
        if (this.settings.theme === 'Dark') {
            return 'darkModeText';
        } else {
            return '';
        }
    }

    getEditHotkeyClass() {
        if (this.settings.theme === 'Dark') {
            return 'hotkeyLinkDark';
        } else {
            return 'hotkeyLink';
        }
    }

    // TODO clean up logic
    getTextColor(tabName) {
        if (this.settings.theme === 'Dark') {
            if (tabName === this.tabService.currentTab) {
                return ''
            }
            return '#adbbc4';
        } else {
            ''
        }
    }

    getHeaderTheme() {
        if (this.settings.theme === 'Dark') {
            return '#303032';
        } else {
            return '#afb8be';
        }
    }

    getHeaderIconTheme() {
        if (this.settings.theme === 'Dark') {
            return 'darkHeaderIcon'
        } else {
            return 'headerIcon'
        }
    }

    getHeaderSettingsIconTheme() {
        if (this.settings.theme === 'Dark') {
            return 'darkHeaderSettingsIcon'
        } else {
            return 'headerSettingsIcon'
        }
    }

    // Windows Functions

    hide() {
        ipcRenderer.send('hide');
    }

    minimize() {
        ipcRenderer.send('minimize');
    }

    maximize() {
        ipcRenderer.send('maximize');
    }
}
