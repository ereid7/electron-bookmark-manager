import { Injectable, NgZone, OnChanges } from '@angular/core';
import { ButtonService } from './button.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var ipcRenderer: any;
declare var remote: any;
declare var __dirname;

@Injectable()
export class TabService {

  tabList: any;

  // ipcRenderer.on('tab-data', function(event, argument) {
  //   console.log(argument);
  //   this.tablist = argument;
  // });

  currentTab = 'All';

  expanded = true;
  editMode = false;

  constructor(private buttons: ButtonService, zone: NgZone, private http: HttpClient, private router: Router) {

    this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/tabs.json')
      .subscribe(data => {
        console.log(data)
        this.tabList = data;
      });
  }

  // ngOnChanges() {
  //   this.sites = this.buttons.getButtons();
  //   this.tab = this.tabService.currentTab;

  //   this.currentTab = 
  // }

  openNav() {
    this.expanded = !this.expanded;
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }

  getCurrentTab() {
    return this.currentTab;
  }


  pushList(item: any) {
    this.tabList.push(item);
  }

  public send() {
    // ipcRenderer.on('tab-data', function(event, argument) {
    //   ipcRenderer.send('tab-data', 'poop');
    //   console.log(argument);
    //   this.tablist = argument;
    // });
    ipcRenderer.send('tab-data', 'poop');
  }

  public getTabs() {
    // this.send();
    return this.tabList;
  }

  // TODO put in shared service
  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  add(tab: any) {
    ipcRenderer.send('tabs-data', tab)

    this.sleep(200);

    this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/tabs.json')
      .subscribe(data => {
        console.log(data)
        this.tabList = data;
      });
    this.router.navigate(['/home']);
  }

  delete() {

    let deletedTab = {
      name: this.currentTab
    }

    ipcRenderer.send('tabs-delete', deletedTab);

    this.sleep(200);

    this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/tabs.json')
      .subscribe(data => {
        console.log(data)
        this.tabList = data;
      });
    this.router.navigate(['/home']);

  }

}
