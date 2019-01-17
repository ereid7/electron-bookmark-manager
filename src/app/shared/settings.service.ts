import { Injectable, OnInit, OnChanges } from '@angular/core';
import { TabService } from './tab.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';

declare var ipcRenderer: any;

declare var __dirname;

// TODO use built in electron for opening links. then cleanup code and remove open package

// Validation for shortcuts
export function hasValid(input: FormControl) {
    if (input.value === '' || input.value === null || input.value === undefined) {
        return null;
    }

    const modifiers = ['command', 'cmd', 'control', 'ctrl', 'commandorcontrol',
        'cmdorctrl', 'alt', 'option', 'altgr', 'shift', 'super'];
    const second = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20', 'f21', 'f22', 'f23', 'f24',
        '!', '@', '#', '`', '$', '%', '^', "&", '*', '(', ')', '-', '=', '+', '_', '~', '{', '}', '[', ']', '\\', '|', '\'', ';', ':', '"', '<', ',', '>', '.', '?', '/', 'plus', 'space', 'tab',
        'backspace', 'delete', 'insert', 'return', 'enter', 'up', 'down', 'left', 'right', 'home', 'end', 'pageup', 'pagedown', 'escape', 'esc', 'volumeup', 'volumedown', 'volumemute', 'medianexttrack', 'mediaprevioustrack',
        'mediastop', 'mediaplaypause', 'printscreen', 'command', 'cmd', 'control', 'ctrl', 'commandorcontrol',
        'cmdorctrl', 'alt', 'option', 'altgr', 'shift', 'super'];
    // if array does not contain a plus or spaces
    // validate if the strinng matches a valid shortcut 
    // else if array has one or more pluses but no spaces
    // validate that first section of string is a valid, and that second buttons are valid
    // verify that none of the strings are duplicate
    // return valid
    // else return null/false

    const bool = true;
    const value = input.value.toLowerCase();

    if (!hasSpace(value)) {
        if (!hasPlus(value)) {
            // TODO find library method that does this easer
            for (let string of modifiers) {
                if (value.toLowerCase() === string) {
                    return null;
                }
            }

            for (let string of second) {
                if (value.toLowerCase() === string) {
                    return null;
                }
            }

            return { needsValid: true };
        } else if (hasPlus(value)) {
            const wordArray = value.toLowerCase().split('+');
            const validArray = [];
            for (let word of wordArray) {
                validArray.push(false);
            }

            for (let string of modifiers) {
                if (wordArray[0] === string) {
                    validArray[0] = true;
                }
            }

            for (let i = 1; i < validArray.length; i++) {
                for (let string of second) {
                    if (wordArray[i] === string) {
                        validArray[i] = true;
                    }
                }
            }

            const validNum = validArray.length;
            let numValid = 0;
            for (let bool of validArray) {
                if (bool) {
                    numValid++;
                }
            }

            return validNum === numValid ? null : { needsValid: true };

        }
    }
    return { notValid: true };
}

export function hasPlus(str: string) {
    for (let char of str) {
        if (char === '+') {
            return true;
        }
    }

    return false;
}

export function hasSpace(str: string) {
    for (let char of str) {
        if (char === ' ') {
            return true;
        }
    }

    return false;
}

@Injectable()
export class SettingsService implements OnInit {

    settings = {
        theme: "Light",
        buttonSize: "Normal",
        browser: 'chrome'
    }

    editHotkeyMode: boolean = false;

    constructor(private tabService: TabService, private http: HttpClient, private router: Router) { }

    public getJSON(): Observable<any> {
        return this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/settings.json')
            .map((res) => res);

    }

    openLink(url: string) {
        open(url, this.settings.browser);
    }

    openHelpLink() {
        open('https://electronjs.org/docs/api/accelerator#available-modifiers', this.settings.browser);
    }

    changeSettings() {
        this.getJSON().subscribe(
            data => this.settings = data);
    }

    ngOnInit() {
        this.getJSON().subscribe(
            data => this.settings = data);
    }

    mockSettings = {
        buttonSize: 0,
        theme: 1,
    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    updateSettings(updatedSettings: any) {
        this.settings = updatedSettings;

        ipcRenderer.send('update-settings', updatedSettings);

        this.sleep(200);

        this.getJSON().subscribe(
            data => this.settings = data);
    }

    // Theme Toggle

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
            return ''
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
