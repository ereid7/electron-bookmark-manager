import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../shared/settings.service';
import { ButtonService } from '../shared/button.service';

@Component({
  selector: 'app-hotkey',
  templateUrl: './hotkey.component.html',
  styleUrls: ['./hotkey.component.scss']
})
export class HotkeyComponent implements OnInit {

  mockData = [
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    },
    {
        name: 'weiners',
        shortcut: 'ctrl+g',
        url: 'www.weinerpoop.com'
    }
]

sites: any;

  constructor(public settingsService: SettingsService, private buttonService: ButtonService) { 
    this.sites = this.buttonService.getButtons();
  }

  ngOnInit() {
    this.sites = this.buttonService.getButtons();
  }

  // TODO put in shared service
  truncate(url: string) {
      return url.length > 20 ? url.substring(0, 20) + '...' : url
  }

}
