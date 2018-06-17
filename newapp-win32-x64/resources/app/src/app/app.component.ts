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

declare var ipcRenderer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Input() home: HomeComponent;

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
    private router: Router, private fb: FormBuilder, public settingsService: SettingsService) {
      // this.settingsService.getJSON().subscribe(data => this.settings = data);
    // this.tabList = ipcRenderer.on('get-data', function(event, argument) {

    //   for (let x of argument) {
    //     console.log(x.name);
    //     tabService.pushList(x.name);
    //   }
    //   return argument;
    // });
    // ipcRenderer.send('tab-data', 'poop');
    // this.tabList = this.tabService.getTabs();
    // this.tabService.send();
    // console.log(this.tabService.tabList);
    // console.log(this.tabList);
  }

  currentTab = 'Home';

  pushList(item: any) {
    this.tabList.push(item);
  }

  deleteTab() {
    this.deletemodal = !this.deletemodal;

    this.tabService.delete();

    this.tabService.changeTab('Home'); // TODO change once have all category
    this.currentTab = 'Home';
  }

  changeTab(tab) {
    this.tabService.changeTab(tab);
    this.currentTab = tab;
    // this.router.navigate(['/home', tab])
  }

  isActive(tab: string) {
    if (this.currentTab === tab) {
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
    this.settingsModal = !this.settingsModal
  }

  // open settings modal


  openDeleteModal() {
    this.deletemodal = !this.deletemodal;
  }


  getTabs() {
    return this.tabList;
  }

  ngOnInit() {
    // this.settingsService.getJSON().subscribe(
    //   data => this.settings = data);
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

    this.openSettingsModal()

    let theme: any;

    if (this.settingsForm.value.theme === 'Dark') {
      theme = 1;
    } else {
      theme = 0;
    }

    let settingsChange = {
      theme: theme,
      buttonSize: this.settingsForm.value.buttonSize
    }

    this.settingsForm.reset(); 

    this.settingsService.updateSettings(settingsChange);
    // this.settingsService.changeSettings();
    // this.settingsService.getJSON().subscribe(
    //   data => this.settings = data);
  }

  onSubmit() {
    let newTab = {
      name: this.tabForm.value.name
    }

    this.tabForm.reset();

    this.tabService.add(newTab);
    this.tabService.currentTab = newTab.name;
    this.currentTab = newTab.name;
  }


  // openNewTab(url: string) {
  //   window.open(url, '_system', 'location=yes');
  // }

  // max     = 1;
  // current = 0;

  // start() {
  //   const interval = Observable.interval(100);

  //   interval
  //     .takeWhile(_ => !this.isFinished )
  //     .do(i => this.current += 0.1)
  //     .subscribe();
  // }

  //  /// finish timer
  // finish() {
  //   this.current = this.max;
  // }

  // /// reset timer
  // reset() {
  //   this.current = 0;
  // }


  // /// Getters to prevent NaN errors

  // get maxVal() {
  //   return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max;
  // }

  // get currentVal() {
  //   return isNaN(this.current) || this.current < 0 ? 0 : this.current;
  // }

  // get isFinished() {
  //   return this.currentVal >= this.maxVal;
  // }

}
