import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Subscription } from 'rxjs/Subscription';
import { HomePage } from '../home/home';

@Component({
    templateUrl : 'back.html'
})

export class BackPage {
    connection : Subscription;
    disconnection : Subscription;
    listen:boolean = false;
    isRecording = false;
    fabCheckedForward = false;
    title = false;
    back = false;
    backCount = 0;
    speakText : any;
    command : any = "back";
    report : any;
    matches : any;
    options = {
        language: "en-US",
     }
    
    constructor(public speech: SpeechRecognition, public nav: NavController, private network: Network, public toast:ToastController){

        this.speech.hasPermission().then((hasPermission: boolean)=>{
            console.log(hasPermission);
            if(!hasPermission){
                this.requestPermissionFromUser();
              }
        });
    }


    sayBack():void{
        this.command = "Back";
        this.listen = true;
        this.isRecording = true;
        this.speech.startListening(this.options).subscribe(matches => {
            this.matches = matches[0]
        })
        this.listen = false;
        this.isRecording = false;
        if(this.speakText == undefined) {
            this.speakText = 'Speak';
        }else{
            this.speakText = `You said ${this.matches}`; 
        } 

        if(this.matches == "back"){
            this.backCount += 1;
            if(this.backCount == 2){
                this.report = "You are good, one more time";
            }else{
                this.report = "Good! Try it again.";
            }
        }else{
            this.report = "Oops you didn't get it correct. Try again";
        }
        
        if(this.backCount == 3){
            this.report = "BACK! Successful";
            this.back = false;
            this.report  = "Training mode complete";
            this.fabCheckedForward = true;
            localStorage.setItem("visited", "true");
        }
    }

    
    private requestPermissionFromUser():void{
        this.speech.requestPermission()
        .then(
            () => console.log("Granted"),
            () => console.log("Not Granted")  
        );
    }

    ionViewDidEnter(){
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
        this.toast.create({
            message : `You are connected ${connectionType} via ${netwrk}`,
            duration : 3000
        }).present();
    }

    ionViewWillLeave(){
        this.connection.unsubscribe();
        this.disconnection.unsubscribe();
    }

    homePage(){
        this.nav.setRoot(HomePage);
    }
    
}