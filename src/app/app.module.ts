import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Starter } from '../pages/starter/starter';
import { LeftPage } from '../pages/leftPage/left';
import { RightPage } from '../pages/rightPage/right';
import { BackPage } from '../pages/backpage/back';

import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    Starter,
    LeftPage,
    RightPage,
    BackPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Starter,
    LeftPage,
    RightPage,
    BackPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SpeechRecognition,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network
  ]
})
export class AppModule {}
