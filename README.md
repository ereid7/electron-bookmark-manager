# Basic Bookmark Manager

A desktop application built with [Angular](https://angular.io/), [Electron js](https://electronjs.org/), and [Clarity by VMware](https://github.com/vmware/clarity). Made for people who want quick access to their favorite links stored locally with the ability to create global shortcuts to launch their favorite sites. 

## Features
- Customizable, sortable categories
- Customizable bookmark names and colors
- Sortable button layout for bookmarks
- Global shortcuts to launch a website/websites
- Table view for viewing all bookmarks
- Settings for Light/Dark theme, button size, and browser

# Installation

I have not created a signed installer because this application was mainly for practice and personal use. However you can download the packaged electron application with Windows executable [here](https://mega.nz/#!TrRVyAAL!IipjWUBKZNDtZpRJcjZ0O9i18fHizf_HmuAWa0EDAuQ) or package the app yourself as seen the below.

## Run using npm
In the applications directory:
- Run ```npm install```
- Run ```npm build --prod```
- Run ```electron .```

## Package the app using [electron-packager](https://github.com/electron-userland/electron-packager)
- Windows: ```electron-packager . application-name --platform=win32```
- Mac: ```electron-packager . application-name --platform=darwin```

<br>

<img src='new_pic_6.png' width="500px">
<img src='new_pic_4.jpg' width="500px">
<img src='new_pic_1.jpg' width="500px">
<img src='new_pic_3.jpg' width="500px">
<img src='new_pic_5.jpg' width="500px">