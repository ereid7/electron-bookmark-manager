import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ButtonService } from './shared/button.service';

import { TabService } from './shared/tab.service';
import { SharedService } from './shared/shared.service';
import { SettingsService } from './shared/settings.service';

import { FilterPipe } from './home/filter.pipe';
import { ClarityModule } from '@clr/angular';
import { HomeComponent } from './home/home.component';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxElectronModule } from 'ngx-electron';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeyComponent } from './hotkey/hotkey.component';
import { WindowsService } from './shared/windows.service';

const appRoutes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'hotkey', component: HotkeyComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,   
    FilterPipe, 
    HotkeyComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule, 
    BrowserAnimationsModule,
    FormsModule, // <-- here
    ClarityModule.forRoot(),
    HttpClientModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule
  ],
  providers: [ButtonService, TabService, SharedService, SettingsService, WindowsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

// TODO make service with all links and side tabs will filter
// add routing - DONE but still need filter

// TODO make pages launch in chrome
// TODO remove any electron related files - not needed

// TODO - MAKE PW MANAGER WITH LOCK

// disable / change main toolbar
// music player
// tools tab possibly?
// recolor app

// iss video feed
// simple game build in?