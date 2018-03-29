import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  status:string = "Not connected";
  tabStatus:string = "Tab to Speak";
  isAvailable: boolean = false;
  isConnected:boolean = false;
  isRecording:boolean = false;
  matches:string[];
  devices:any;
  deviceAvailable:boolean = false;
  scanStatus:string = "Scan";
  scanStarted:boolean = false;


  constructor(public navCtrl: NavController, private speechReg: SpeechRecognition, public change:ChangeDetectorRef,private btDevice:BluetoothSerial, public alertCtl:AlertController,public toastCtrl:ToastController) {
    this.devices = [{
      name : 'Microsoft',
      id : '10.10.20.33',
      address : '10.10.20.33'
    },{
      name : 'Android',
      id : '11.11.90.33',
      address : '11.11.90.33'
    },{
      name : 'IOS',
      id : '100.20.12.54',
      address : '100.20.12.54'
    }];

    console.log(this.devices); 
    
  }

  action(){

    if(this.isRecording == false){
    this.isVoiceAvailable();
    
    //Let check for Permission
    this.speechReg.hasPermission().then(
        (hasPermission: boolean) =>{ 
        console.log(hasPermission);
        
        if(!hasPermission){
          this.requestPermissionFromUser();
        }
      });
      this.isRecording = true;
      this.tabStatus = " Speak now";
     this.startRecording();

    }else if(this.isRecording == true){
      this.isRecording = false;
      this.tabStatus = "Tab to Speak to again";
      this.speechReg.stopListening();
    }
  }

  scanBT(){
    //Check of BT is turn on
    if(this.scanStarted == false){
     this.btDevice.isEnabled().then(
        (enab: boolean) => {
          
          if(!enab){
            this.btDevice.enable();
          }
        }
      )
  
      //this.btDevice.setDiscoverable(1);
  
     //Set unpaired discoverable devices
      this.btDevice.discoverUnpaired().then(
        (sucess) => {
          this.devices = sucess;
          this.deviceAvailable = true;
        },
        (err) => {
          console.log("Error occur in",err);
          this.deviceAvailable = false;
      }
      ) 
     this.scanStarted = true;
     this.scanStatus = "Disconnect";
    }else if(this.scanStarted == true){
      this.showDisconnectedToast();
      this.btDevice.disconnect();

    }
    
  }



  //Methods to hold whether bluetooth is enabled
  

  public startRecording() : void{
     //document.getElementById(name).style.backgroundColor = "#f53d3d";

     let options = {
       language: "en-US"
     }

     this.speechReg.startListening(options)
     .subscribe( matches => {
         this.matches = matches;
         console.log(matches[0]);
         this.change.detectChanges();
         this.btDevice.write(this.matches[0]);
         //console.log(matches);
       (onerror) => console.log('error: Something occurred', onerror);
       }
     )
  }

  private requestPermissionFromUser() : void{
    this.speechReg.requestPermission()
     .then(
       () => console.log("Granted"),
       () => console.log("Not Granted")   
     )
  }

  private isVoiceAvailable():void{
    this.speechReg.isRecognitionAvailable()
    .then((available: boolean) => {
      this.isAvailable = available;
      console.log(this.isAvailable);
    }
      
  )
}



  public stopRecording():void {
    this.tabStatus = "Tab to Speak"; 
    this.speechReg.stopListening().then(() => {
        this.isRecording = false;
      }
    ) 
  }


  public selectDevice(something:any): void{
    console.log(something);

    //Let show devices in alert box and select
    let alert = this.alertCtl.create({
      title : "Connect Device",
      message : "Do you want to connect "+ something.name+ " ?" ,

      buttons : [
        {
          text : "Cancel",
          role : "Cancel",
          handler : () => {
            console.log("Device disconnected");
          }
          
        },{
          text : "Connect",
          handler:() =>{
            //Let connect devices here
            //Initialise device for connection
            this.btDevice.connect(something.address).subscribe(
              (success)=>{
                //Let pass a toast success to user as device is connect
                this.showToast();
                this.status = "Connected";
              },
              (fail)=>{
                console.log(fail);
                
              }
            );
            this.showToast();
            console.log("Device connected");
          }
        }
      ]
    })
    alert.present(); 
  }

  public showToast(){
    let toast = this.toastCtrl.create({
      message : 'Connected successfully',
      duration : 2000
    });
    this.status = "Connected";
    this.isConnected = true;
    toast.present()
  }

  public showDisconnectedToast(){
    let toast = this.toastCtrl.create({
      message : 'Disconnected Successfully',
      duration : 2000
    });
      this.scanStatus = "Scan";
      this.status = "Not Connected";
      this.isConnected = false;
      this.scanStarted = false;
    toast.present();
  }
}



