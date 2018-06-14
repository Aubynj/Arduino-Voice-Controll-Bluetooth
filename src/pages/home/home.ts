import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  connection : Subscription;
  disconnection : Subscription;
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
  dataFromArduino : any;
  received : any;
  connected: any;

  //Getting unpaired devices
  unpairedDevices : any;
  pairedDevices : any;
  gettingDevices : boolean;


  constructor(public navCtrl: NavController,private network: Network, private speechReg: SpeechRecognition, public change:ChangeDetectorRef,private btDevice:BluetoothSerial, public alertCtl:AlertController,public toastCtrl:ToastController) { 
    //btDevice.enable();
  }


  ngOnInit(){
      setInterval(()=>{
        this.btDevice.read().then(data =>{
          this.dataFromArduino = data
        });
      },2000);

    
  }

  // Method for start the voice recording process
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
	 this.btDevice.clear();

    }else if(this.isRecording == true){
      this.isRecording = false;
      this.tabStatus = "Tab to Speak to again";
      this.speechReg.stopListening();
    }
}

  

    // Method for scanning BT
scanBT(){    
    if(this.scanStarted == false){
		this.btDevice.isEnabled().then(
			(enab: boolean) => {
			  
			  if(!enab){
				this.btDevice.enable();
			  }
			}
		)
		
		//Setting devices to null
		this.unpairedDevices = null;
		this.pairedDevices = null;
		this.gettingDevices = true;
        this.devices = null;

      //Set unpaired discoverable devices
        this.btDevice.discoverUnpaired().then(
          (success) => {
            this.devices = success;
            this.unpairedDevices = success;
            this.deviceAvailable = true;
            this.gettingDevices = false;       
          },
          (err) => {
            console.log("Error occur in",err);
            this.deviceAvailable = false;
        }
      )
        this.btDevice.list().then((success)=>{
          this.pairedDevices = success;
        },
      (err)=>{
        console.log("Error occur in listing the devices");
	  })
	    
      this.scanStarted = true;
      this.scanStatus = "Disconnect";
    }else if(this.scanStarted == true){
        this.showDisconnectedToast();
        this.btDevice.disconnect();
      }
    }

//   // Start recoding method of void
// public startRecording() : void{
//     this.isRecording = true;
//     this.tabStatus = " Speak now";
//     this.btDevice.clear();
    
//     let options = {
//     language: "en-US"
//     }

//      this.speechReg.startListening(options)
//      .subscribe( matches => {
//          this.matches = matches;
//          console.log(matches[0]);
//          this.change.detectChanges();
//          this.btDevice.write(this.matches[0]);
//          //console.log(matches);
//        (onerror) => console.log('error: Something occurred', onerror);
//        }
//      )
//     this.isRecording = false;
//     this.tabStatus = "Tab to Speak to again";
//     this.speechReg.stopListening();
//   }

  public startRecording() : void{
	this.btDevice.clear();

	let options = {
    language: "en-US",
    matches: 1
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

  // Method to request permission from user
  private requestPermissionFromUser() : void{
    this.speechReg.requestPermission()
     .then(
       () => console.log("Granted"),
       () => console.log("Not Granted")   
     )
  }

  // Method to checkc if voice recognition is available
	private isVoiceAvailable():void{
		this.speechReg.isRecognitionAvailable()
		.then((available: boolean) => {
		this.isAvailable = available;
		console.log(this.isAvailable);
		}
		
	   )
	}

// Method to stop recording
  public stopRecording():void {
    this.tabStatus = "Tab to Speak"; 
    this.speechReg.stopListening().then(() => {
        this.isRecording = false;
      }
    ) 
  }

// Method to select device for connection
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
                this.received = true;
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

  // Method to show toast message
  public showToast(){
    let toast = this.toastCtrl.create({
      message : 'Connected successfully',
      duration : 2000
    });
    this.status = "Connected";
    this.isConnected = true;
    toast.present()
  }

// Method to show toast message for disconnecting from BT
  public showDisconnectedToast(){
    let toast = this.toastCtrl.create({
      message : 'Bluetooth Disconnected Success',
      duration : 2000
    });
      this.received = false;
      this.scanStatus = "Scan";
      this.status = "Not Connected";
      this.isConnected = false;
      this.scanStarted = false;
    toast.present();
  }

	// Method to convert byte into string
	public byteToString(byte: any){
		return String.fromCharCode.apply(null , new Uint8Array(byte));
	}

  ionViewDidEnter(){
    //Check if bt has connected
		this.connected = this.btDevice.isConnected();
		if(!this.connected ){
		this.showDisconnectedToast(); 
		}

		//Check if network is available
		this.connection = this.network.onConnect().subscribe(data=>{
			this.displayNetworkUpdate(data.type);
		})
		//Check if network is disable
		this.disconnection = this.network.onDisconnect().subscribe(data =>{
			this.displayNetworkUpdate(data.type);
		})

    }

	displayNetworkUpdate(connectionType:string){
		let netwrk = this.network.type;
		this.toastCtrl.create({
			message : `You are connected ${connectionType} via ${netwrk}`,
			duration : 3000
		}).present();
	}

	ionViewWillLeave(){
		this.connection.unsubscribe();
		this.disconnection.unsubscribe();
		this.connected.unsubscribe();
	}
}




