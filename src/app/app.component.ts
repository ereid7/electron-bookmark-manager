import { Component, OnInit, OnChanges, AfterViewInit, AfterContentInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import { TabService } from './shared/tab.service';
import { HomeComponent } from './home/home.component';
import { ButtonService } from './shared/button.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SettingsService } from './shared/settings.service';
import { HotkeyComponent } from './hotkey/hotkey.component';

declare var ipcRenderer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Input() home: HomeComponent;
  @Input() hotkey: HotkeyComponent;

  tabList = [];

  buttonList: any;
  editMode: boolean = false;

  tabForm: FormGroup;
  settingsForm: FormGroup;

  modal: boolean = false;
  deletemodal: boolean = false;
  settingsModal: boolean = false;

  options;

  // theme properties
  backgroundTheme;
  navTheme;

  settings = {
    theme: 0,
    buttonSize: '',
    linkBrowser: ''
  }

  // Default Color for Picker
  color: string = '#2889e9';

  constructor(public tabService: TabService, public buttonService: ButtonService,
    private router: Router, private fb: FormBuilder, public settingsService: SettingsService) {
      this.options = {
        onUpdate: (event: any) => {
          this.tabService.changeTabOrder(this.tabService.tabList);
        }
      };
  }

  ngOnInit() {
    this.settingsService.changeSettings();
    this.tabForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.settingsForm = this.fb.group({
      theme: ['', Validators.required],
      buttonSize: ['', Validators.required],
      linkBrowser: ['', Validators.required]
    });
  }

  currentTab = this.tabService.currentTab; // TODO remove?
 
  pushList(item: any) {
    this.tabList.push(item);
  }

  deleteTab() {
    this.deletemodal = !this.deletemodal;

    this.tabService.delete();

    this.tabService.changeTab('All'); // TODO change once have all category
    this.currentTab = 'All';
    this.buttonService.refresh();
  }

  changeTab(tab) {
    this.tabService.changeTab(tab);
    this.currentTab = tab;

    this.buttonService.refresh();
  }

  editHotkeys() {
    this.settingsModal = false;
    if (!this.tabService.expanded) { 
      this.tabService.openNav();
    }
    this.router.navigate(['/hotkey']);
  }

  isActive(tab: string) {
    if (this.tabService.currentTab === tab) {
      return 'active';
    } else {
      return '';
    }
  }

  openModal() {
    this.modal = !this.modal;
  }

  // TODO make into one method
  openSettingsModal() {
    this.settingsModal = !this.settingsModal;
    this.settingsForm.setValue({
      theme: this.settingsService.settings.theme,
      buttonSize: this.settingsService.settings.buttonSize,
      linkBrowser: this.settingsService.settings.browser
    });
  }

  openDeleteModal() {
    this.deletemodal = !this.deletemodal;
  }

  getTabs() {
    return this.tabList;
  }

  onSubmitSettings() {
    this.settingsModal = !this.settingsModal;

    let settingsChange = {
      theme: this.settingsForm.value.theme,
      buttonSize: this.settingsForm.value.buttonSize,
      browser: this.settingsForm.value.linkBrowser
    }

    this.settingsForm.reset();

    this.settingsService.updateSettings(settingsChange);
    this.settingsService.changeSettings();
  }

  onSubmit() {
    let newTab = {
      name: this.tabForm.value.name,
      order: []
    }

    this.tabForm.reset();

    this.tabService.add(newTab);
    this.changeTab(newTab.name);
    this.currentTab = newTab.name;
  }
}
