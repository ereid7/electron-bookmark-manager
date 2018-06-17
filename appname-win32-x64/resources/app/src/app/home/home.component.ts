
import { Component, OnInit, OnChanges, NgZone, Output, Input, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonService } from '../shared/button.service';
import { TabService } from '../shared/tab.service';
import { FilterPipe } from './filter.pipe';

import { ClarityModule } from '@clr/angular';

import { NgForm, FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SettingsService } from '../shared/settings.service';

// import { ElectronService } from 'ngx-electron';

// import * as open from '../../../node_modules/open/lib/open.js'

declare var ipcRenderer: any;
declare var remote: any;

declare let open: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

    // TODO add browser in settings
    // TODO add table view of shortcuts
    // add shortcut toggle when adding task

    // TODO normalize button positon in modals
    // TODO add edit mode help text
    // TODO create settings service
    // TODO change all to Home
    // TODO dissallow the same keyboard shortcuts
    // TODO fix input line spacing from word
    // TODO create models for objects
    // TODO create settings file, btn-sm toggle and color settings
    @Input() guy: string = "Home"

    private ipc_info: string;
    private remote_info: string;
    private count: number;

    buttonForm: FormGroup;
    buttonUpdateForm: FormGroup;

    modal: boolean = false;
    editmodal: boolean = false;
    selectedButton: any = null;

    sites: any[];
    tab: any;

    // Default Color for Picker
    color: string = '#2889e9';

    settings = {
        theme: '',
        buttonSize: ''
    }

    constructor(public buttons: ButtonService, public tabService: TabService, private router: Router, private fb: FormBuilder, public settingsService: SettingsService) {
        // ipcRenderer.on('tab-data', function (event, argument) {
        //     console.log(argument);
        // });

        this.tab = tabService.currentTab;
        this.sites = this.buttons.getButtons();
    }

    ngOnInit() {
        // this.settingsService.getJSON().subscribe(
        //     data => this.settings = data);
        this.settingsService.changeSettings();
        this.sites = this.buttons.getButtons();
        this.tab = this.tabService.currentTab;

        this.buttonForm = this.fb.group({
            name: ['', Validators.required],
            url: ['', Validators.required],
            color: ['', Validators.required],
            shortcut: [''],
            category: ['']
        });

        this.buttonUpdateForm = this.fb.group({
            name: ['', Validators.required],
            url: ['', Validators.required],
            color: ['', Validators.required],
            shortcut: [''],
            category: ['']
        });
    }

    ngOnChanges() {
        this.sites = this.buttons.getButtons();
        this.tab = this.tabService.currentTab;
    }

    openModal(modaltype: string) {
        if (modaltype === 'addbutton') {
            if (this.tabService.currentTab !== 'All') {
                this.buttonForm.patchValue({
                    category: this.tabService.currentTab
                });
            }
            this.modal = !this.modal;
        } else if (modaltype === 'editbutton') {
            this.editmodal = !this.editmodal;
        }
    }

    closeModal(modaltype: string) {
        if (modaltype === 'addbutton') {
            this.modal = !this.modal;
            this.buttonForm.reset();
            this.buttonUpdateForm.reset();
        } else if (modaltype === 'editbutton') {
            this.editmodal = !this.editmodal;
            this.buttonUpdateForm.reset();
            this.buttonForm.reset();
        }
    }

    getClass() {
        if (this.tabService.editMode) {
            if (this.settingsService.settings.buttonSize === 'Small') {
                return ['btn-sm', 'edit'];
            } else {
                return 'edit';
            }
        } else {
            if (this.settingsService.settings.buttonSize === 'Small') {
                return 'btn-sm';
            } else {
                return '';
            }
        }
    }

    onUpdate() {
        this.editmodal = !this.editmodal;

        let updatedButton = {
            name: this.buttonUpdateForm.value.name,
            url: this.buttonUpdateForm.value.url,
            color: this.buttonUpdateForm.value.color,
            category: this.buttonUpdateForm.value.category,
            shortcut: null,
            id: this.selectedButton.id
        }

        if (this.buttonUpdateForm.value.shortcut) {
            updatedButton.shortcut = this.buttonUpdateForm.value.shortcut
        }

        this.buttonUpdateForm.reset();

        this.buttons.update(updatedButton);
    }

    onSubmit() {
        // TODO add validation

        this.modal = !this.modal;

        let newButton = {
            name: this.buttonForm.value.name,
            url: this.buttonForm.value.url,
            color: this.buttonForm.value.color,
            category: this.buttonForm.value.category,
            shortcut: null,
            id: this.buttons.guidGenerator(),
        }

        if (this.buttonForm.value.shortcut) {
            newButton.shortcut = this.buttonForm.value.shortcut
        }

        this.buttonForm.reset();

        this.buttons.add(newButton);
    }

    onDelete() {
        this.editmodal = !this.editmodal;

        this.buttonUpdateForm.reset();

        this.buttons.delete(this.selectedButton)
    }

    public send() {

    }

    buttonClick(site) {
        if (!this.tabService.editMode) {
            this.openLink(site.url);
        } else {
            this.buttonUpdateForm.patchValue({
                name: site.name,
                url: site.url,
                color: site.color,
                shortcut: site.shortcut,
                category: site.category
            });
            this.selectedButton = site;
            this.openModal('editbutton');
        }
    }

    isSelected(tabname: string) {
        if (this.selectedButton) {
            if (tabname === this.selectedButton.category) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // TODO add to service
    openLink(url: string) {
        open(url, "chrome");
    }

}



// buttonGuys = [
//     {
//         name: 'GitHub',
//         url: 'https://github.com/',
//         color: '#24292E',
//         category: 'dev'
//     },
//     {
//         name: 'Scotch.io',
//         url: 'https://scotch.io/',
//         color: '#C7A242',
//         category: 'dev'
//     },
//     {
//         name: 'Alligator.io',
//         url: 'https://alligator.io/',
//         color: '#33A369',
//         category: 'dev'
//     },
//     {
//         name: 'Hackernoon',
//         url: 'https://hackernoon.com/',
//         color: '#00FF00',
//         category: 'dev'
//     }, {
//         name: 'Stack OvFlw',
//         url: 'https://stackoverflow.com/',
//         color: '#F48024',
//         category: 'dev'
//     },
//     {
//         name: 'Pluralsight',
//         url: 'https://app.pluralsight.com/library/',
//         color: '#https://stackoverflow.com/',
//         category: 'dev'
//     },
//     {
//         name: 'Heroku',
//         url: 'https://www.heroku.com/',
//         color: '#79589F',
//         category: 'dev'
//     },
//     {
//         name: 'Robinhood',
//         url: 'https://www.robinhood.com/',
//         color: '#21CE99',
//         category: 'finance'
//     },
//     {
//         name: 'Mint',
//         url: 'https://mint.intuit.com/',
//         color: '#0CADB5',
//         category: 'finance'
//     },
//     {
//         name: 'TCF Bank',
//         url: 'https://tcfbank.com/',
//         color: '#FAAC18',
//         category: 'finance'
//     },
//     {
//         name: 'Gmail',
//         url: 'https://mail.google.com/mail',
//         color: '#https://mail.google.com/mail',
//         category: 'home'
//     },
//     {
//         name: 'Keep',
//         url: 'https://keep.google.com/',
//         color: '#FFBB00',
//         category: 'home'
//     },
//     {
//         name: 'Calendar',
//         url: 'https://calendar.google.com/calendar/',
//         color: '#E67C73',
//         category: 'home'
//     },
//     {
//         name: 'LinkedIn',
//         url: 'https://www.linkedin.com/',
//         color: '0077B5',
//         category: 'home'
//     },
//     {
//         name: 'Reddit',
//         url: 'https://www.reddit.com/',
//         color: '#FF4500',
//         category: 'home'
//     },
//     {
//         name: 'Soundcloud',
//         url: 'https://www.soundcloud.com/',
//         color: '#FF5500',
//         category: 'home'
//     },
//     {
//         name: 'Youtube',
//         url: 'https://www.youtube.com/',
//         color: '#FF0000',
//         category: 'home'
//     },
//     {
//         name: 'Reuters',
//         url: 'https://www.reuters.com/',
//         color: '#EF7A04',
//         category: 'home'
//     },
//     {
//         name: 'D2L',
//         url: 'https://uwstout.courses.wisconsin.edu/d2l/home',
//         color: '#004283',
//         category: 'school'
//     },
//     {
//         name: 'Outlook',
//         url: 'https://login.microsoftonline.com/common/oauth2/authorize?client_id=00000002-0000-0ff1-ce00-000000000000&redirect_uri=https%3a%2f%2foutlook.office365.com%2fowa%2f&resource=00000002-0000-0ff1-ce00-000000000000&response_mode=form_post&response_type=code+id_token&scope=openid&msafed=0&client-request-id=f555c433-d47a-4f96-9e27-7a4274703ac0&protectedtoken=true&domain_hint=my.uwstout.edu&nonce=636614237307464534.4fdb4ff1-52a3-44b9-a534-973a1ec19046&state=DYtBDoMgEABBf9KDNxDcdQkH41vWAomJxMRKTX_fPcwcJhmtlOqFTtBOpAIBkccJAriAhDOgxZI2LMWbeWIwiFs0LN3EAOzz20eHpOV9jefD43plPupSf7Y9n_tst82pDd-0VN6PPw&sso_reload=true',
//         color: '#007DC2',
//         category: 'school'
//     },
//     {
//         name: 'Access',
//         url: 'https://access.uwstout.edu/psp/ps/EMPLOYEE/HRMS/h/?tab=DEFAULT',
//         color: '#004283',
//         category: 'school'
//     },
//     {
//         name: 'Career Link',
//         url: 'https://www.uwstout.edu/academics/career-services/careerlink',
//         color: '#004990',
//         category: 'school'
//     },
//     {
//         name: 'Logins',
//         url: 'http://logins.uwstout.edu/links.aspx',
//         color: '#004283',
//         category: 'school'
//     },
// ]

