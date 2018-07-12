import { Component, OnInit, OnChanges } from '@angular/core';
import { SettingsService } from '../shared/settings.service';
import { ButtonService } from '../shared/button.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabService } from '../shared/tab.service';

@Component({
    selector: 'app-hotkey',
    templateUrl: './hotkey.component.html',
    styleUrls: ['./hotkey.component.scss']
})
export class HotkeyComponent implements OnInit, OnChanges {

    // TODO make abstract class for this component and home component

    color: string = '#2889e9';

    buttonUpdateForm: FormGroup;

    selectedButton: any = null;

    sites: any;

    constructor(public settingsService: SettingsService, public buttonService: ButtonService, private fb: FormBuilder,
                public tabService: TabService) {
        this.sites = this.buttonService.getButtons(this.tabService.currentTab);
    }

    ngOnInit() {
        this.sites = this.buttonService.getButtons(this.tabService.currentTab);
        this.buttonUpdateForm = this.fb.group({
            name: ['', Validators.required],
            url: ['', Validators.required],
            shortcut: [''],
        });
    }

    ngOnChanges() {
        this.sites = this.buttonService.getButtons(this.tabService.currentTab);
    }

    // TODO put in shared service
    truncate(url: string) {
        return url.length > 20 ? url.substring(0, 20) + '...' : url
    }

    openEditModal() {
       // console.log('weiners');
        this.buttonService.editmodal = !this.buttonService.editmodal;
    }

    closeModal(modaltype: string) {

        this.buttonUpdateForm.reset();

        this.buttonService.editmodal = !this.buttonService.editmodal;

    }

    onUpdate() {
        this.buttonService.editmodal = !this.buttonService.editmodal;

        let updatedButton = {
            name: this.buttonUpdateForm.value.name,
            url: this.buttonUpdateForm.value.url,
            color: this.selectedButton.color,
            category: this.selectedButton.category,
            shortcut: null,
            id: this.selectedButton.id
        }

        if (this.buttonUpdateForm.value.shortcut) {
            updatedButton.shortcut = this.buttonUpdateForm.value.shortcut
        }

        for (let site of this.sites) {
            if (this.selectedButton.id === site.id) {
                site.name = updatedButton.name;
                site.url= updatedButton.url;
                site.color = updatedButton.color;
                site.category = updatedButton.category;
                site.shortcut = updatedButton.shortcut;
                site.name = updatedButton.name;
                site.id = this.selectedButton.id;
            } 
        }

        this.buttonUpdateForm.reset();

        this.buttonService.update(updatedButton, 1);
        // this.sites = this.buttonService.buttonList;
    }

    buttonClick(site) {
        this.buttonUpdateForm.patchValue({
            name: site.name,
            url: site.url,
            shortcut: site.shortcut,
        });
        this.selectedButton = site;
        this.buttonService.editmodal = !this.buttonService.editmodal;
    }

    // onDelete() {
    //     this.buttonService.editmodal = !this.buttonService.editmodal;

    //     this.buttonUpdateForm.reset();

    //     for (let i = 0; i < this.sites.length; i++) {
    //         if (this.sites[i].id === this.selectedButton.id) {
    //             this.sites.splice(i, 1);
    //         }
    //     }

    //     this.buttonService.delete(this.selectedButton, 1);
    // }
}