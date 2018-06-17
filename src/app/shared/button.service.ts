import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';
// import { IpcRenderer } from 'electron';

declare let open: any;

declare var electron: any;

declare var ipcRenderer: any;

declare var __dirname;

@Injectable()
export class ButtonService {
    // private _ipc: IpcRenderer | undefined = void 0;

    buttonList: any;

    editmodal: boolean = false;

    constructor(private http: HttpClient, private _electronService: ElectronService, private _ngZone: NgZone, private router: Router) {

        this.refresh();

    }

    // TODO put this and openlink in seperate service
    guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    add(button: any) {
        ipcRenderer.send('add-data', button);

        // TODO find way to wait for ipc response
        this.sleep(200);

        this.refresh();
    }

    update(button: any) {
        ipcRenderer.send('update-data', button);

        this.sleep(200);

        this.refresh();
    }

    delete(button: any) {
        ipcRenderer.send('delete-data', button);

        this.sleep(200);

        this.refresh();
    }

    //TODO put in shared method service because tab service uses
    refresh() {
        this.http.get(__dirname.slice(0, -5) + '/src/assets/storage/buttons.json')
            .subscribe(data => {
                console.log(data)
                this.buttonList = data;
            });
        this.router.navigate(['/home']);
    }

    getButtons() {
        return this.buttonList;
    }

    getHotkeyButtons() {
        return this.buttonList.filter(it => {
            if (!it.shortcut || it.shortcut === '') {
                return false;
            } else {
                return true;
            }
        });
    }

    openLink(url: string) {
        open(url, "chrome");
    }

    // IPC Methods

    // public on(channel: string, listener: IpcCallback): void {
    //     if (!this._ipc) {
    //       return;
    //     }
    //     this._ipc.on(channel, listener);
    //   }

    //   public send(channel: string, ...args): void {
    //     if (!this._ipc) {
    //       return;
    //     }
    //     this._ipc.send(channel, ...args);
    //   }

}

const BUTTONS = [
    {
        name: 'GitHub',
        url: 'https://github.com/',
        color: '#24292E',
        category: 'dev'
    },
    {
        name: 'Scotch.io',
        url: 'https://scotch.io/',
        color: '#C7A242',
        category: 'dev'
    },
    {
        name: 'Alligator.io',
        url: 'https://alligator.io/',
        color: '#33A369',
        category: 'dev'
    },
    {
        name: 'Hackernoon',
        url: 'https://hackernoon.com/',
        color: '#00FF00',
        category: 'dev'
    }, {
        name: 'Stack OvFlw',
        url: 'https://stackoverflow.com/',
        color: '#F48024',
        category: 'dev'
    },
    {
        name: 'Pluralsight',
        url: 'https://app.pluralsight.com/library/',
        color: '#https://stackoverflow.com/',
        category: 'dev'
    },
    {
        name: 'Heroku',
        url: 'https://www.heroku.com/',
        color: '#79589F',
        category: 'dev'
    },
    {
        name: 'Robinhood',
        url: 'https://www.robinhood.com/',
        color: '#21CE99',
        category: 'finance'
    },
    {
        name: 'Mint',
        url: 'https://mint.intuit.com/',
        color: '#0CADB5',
        category: 'finance'
    },
    {
        name: 'TCF Bank',
        url: 'https://tcfbank.com/',
        color: '#FAAC18',
        category: 'finance'
    },
    {
        name: 'Gmail',
        url: 'https://mail.google.com/mail',
        color: '#https://mail.google.com/mail',
        category: 'home'
    },
    {
        name: 'Keep',
        url: 'https://keep.google.com/',
        color: '#FFBB00',
        category: 'home'
    },
    {
        name: 'Calendar',
        url: 'https://calendar.google.com/calendar/',
        color: '#E67C73',
        category: 'home'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/',
        color: '0077B5',
        category: 'home'
    },
    {
        name: 'Reddit',
        url: 'https://www.reddit.com/',
        color: '#FF4500',
        category: 'home'
    },
    {
        name: 'Soundcloud',
        url: 'https://www.soundcloud.com/',
        color: '#FF5500',
        category: 'home'
    },
    {
        name: 'Youtube',
        url: 'https://www.youtube.com/',
        color: '#FF0000',
        category: 'home'
    },
    {
        name: 'Reuters',
        url: 'https://www.reuters.com/',
        color: '#EF7A04',
        category: 'home'
    },
    {
        name: 'D2L',
        url: 'https://uwstout.courses.wisconsin.edu/d2l/home',
        color: '#004283',
        category: 'school'
    },
    {
        name: 'Outlook',
        url: 'https://login.microsoftonline.com/common/oauth2/authorize?client_id=00000002-0000-0ff1-ce00-000000000000&redirect_uri=https%3a%2f%2foutlook.office365.com%2fowa%2f&resource=00000002-0000-0ff1-ce00-000000000000&response_mode=form_post&response_type=code+id_token&scope=openid&msafed=0&client-request-id=f555c433-d47a-4f96-9e27-7a4274703ac0&protectedtoken=true&domain_hint=my.uwstout.edu&nonce=636614237307464534.4fdb4ff1-52a3-44b9-a534-973a1ec19046&state=DYtBDoMgEABBf9KDNxDcdQkH41vWAomJxMRKTX_fPcwcJhmtlOqFTtBOpAIBkccJAriAhDOgxZI2LMWbeWIwiFs0LN3EAOzz20eHpOV9jefD43plPupSf7Y9n_tst82pDd-0VN6PPw&sso_reload=true',
        color: '#007DC2',
        category: 'school'
    },
    {
        name: 'Access',
        url: 'https://access.uwstout.edu/psp/ps/EMPLOYEE/HRMS/h/?tab=DEFAULT',
        color: '#004283',
        category: 'school'
    },
    {
        name: 'Career Link',
        url: 'https://www.uwstout.edu/academics/career-services/careerlink',
        color: '#004990',
        category: 'school'
    },
    {
        name: 'Logins',
        url: 'http://logins.uwstout.edu/links.aspx',
        color: '#004283',
        category: 'school'
    },
]
