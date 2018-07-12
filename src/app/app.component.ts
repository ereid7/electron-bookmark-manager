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
import { WindowsService } from './shared/windows.service';
import { HotkeyComponent } from './hotkey/hotkey.component';
import { SharedService } from './shared/shared.service';

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

  // theme properties
  backgroundTheme;
  navTheme;

  settings = {
    theme: 0,
    buttonSize: ''
  }


  //settingsIcon: string = __dirname.slice(0, -5) + '\\src\\assets\\storage\\images\\settings.png'

  constructor(public tabService: TabService, public buttonService: ButtonService,
    private router: Router, private fb: FormBuilder, public settingsService: SettingsService,
    private sharedService: SharedService) {
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
  }

  changeTab(tab) {
    this.tabService.changeTab(tab);
    this.currentTab = tab;

    this.buttonService.refresh();
    // if statement if in options path
    // this.router.navigate(['/home', tab])
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
      buttonSize: this.settingsService.settings.buttonSize
    });
  }

  openDeleteModal() {
    this.deletemodal = !this.deletemodal;
  }

  getTabs() {
    return this.tabList;
  }

  ngOnInit() {
    this.settingsService.changeSettings();
    this.tabForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.settingsForm = this.fb.group({
      theme: ['', Validators.required],
      buttonSize: ['', Validators.required],
    });
  }

  onSubmitSettings() {
    this.settingsModal = !this.settingsModal;

    let settingsChange = {
      theme: this.settingsForm.value.theme,
      buttonSize: this.settingsForm.value.buttonSize
    }

    this.settingsForm.reset();

    this.settingsService.updateSettings(settingsChange);
    this.settingsService.changeSettings();
    // this.settingsService.getJSON().subscribe(
    //   data => this.settings = data);
  }

  onSubmit() {
    let newTab = {
      name: this.tabForm.value.name,
      order: []
    }

    this.tabForm.reset();

    this.tabService.add(newTab);
    this.changeTab(newTab.name);
    //this.tabService.currentTab = newTab.name;
    this.currentTab = newTab.name;
  }
}
