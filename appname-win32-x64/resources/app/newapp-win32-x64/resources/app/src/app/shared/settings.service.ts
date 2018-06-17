import { Injectable, OnInit, OnChanges } from '@angular/core';
import { TabService } from './tab.service';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import * as savedSettings from '../../assets/storage/settings.json';

declare var ipcRenderer: any;

declare var __dirname;

@Injectable()
export class SettingsService implements OnInit {

    settings = {
        theme: 0,
        buttonSize: ''
    }

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
    //     this.router.navigate(['/home']);
    // }

    getTheme() {

        if (this.settings.theme === 1) {
            return 'darkMode';
        } else {
            return '';
        }
    }

    getBackGroundTheme() {

        if (this.settings.theme === 1) {
            return 'darkModeBackGround';
        } else {
            return '';
        }
    }

    getTextTheme() {

        if (this.settings.theme  === 1) {
            return 'darkModeText';
        } else {
            return '';
        }
    }

    // TODO clean up logic
    getTextColor(tabName) {
        if (this.settings.theme  === 1) {
            if (tabName === this.tabService.currentTab) {
                return ''
            }
            return '#d5d5d5';
        } else {
            ''
        }
    }
}
