import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ButtonService } from './shared/button.service';

import { TabService } from './shared/tab.service';
import { SettingsService } from './shared/settings.service';

import { ClarityModule } from '@clr/angular';
import { HomeComponent } from './home/home.component';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxElectronModule } from 'ngx-electron';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { SortablejsModule } from 'angular-sortablejs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeyComponent } from './hotkey/hotkey.component';

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
    HotkeyComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
    ),
    BrowserModule, 
    BrowserAnimationsModule,
    ClarityModule.forRoot(),
    HttpClientModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    SortablejsModule.forRoot({ animation: 500 }),
  ],
  providers: [ButtonService, TabService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
