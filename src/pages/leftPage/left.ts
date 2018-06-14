import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Subscription } from 'rxjs/Subscription';
import { RightPage } from '../rightPage/right';

@Component({
    templateUrl : 'left.html'
})

export class LeftPage {
    connection : Subscription;
    disconnection : Subscription;
    listen:boolean = false;
    isRecording = false;
    fabCheckedRight = false;
    title = false;
    left = false;
    lefCounter = 0;
    speakText : any;
    command : any = "left";
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


    sayLeft():void{
        this.command = "Left";
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

        if(this.matches == "left"){
            this.lefCounter += 1;
            if(this.lefCounter == 2){
                this.report = "You are good, one more time";
            }else{
                this.report = "Good! Try it again.";
            }
        }else{
            this.report = "Oops you didn't get it correct. Try again";
        }
        
        if(this.lefCounter == 3){
            this.report = "LEFT! Successful";
            this.command = "right";
            this.left = false;
            this.fabCheckedRight = true;
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

    rightPage(){
        this.nav.setRoot(RightPage);
    }
    
}