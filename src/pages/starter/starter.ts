import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Subscription } from 'rxjs/Subscription';
import { LeftPage } from '../leftPage/left';

@Component({
    templateUrl : 'starter.html'
})

export class Starter {
    connection : Subscription;
    disconnection : Subscription;
    listen:boolean = false;
    isRecording = false;
    fabChecked = false;
    title = false;
    forward = true;
    left = false;
    right = false;
    back = false;
    speakText : any;
    forCounter = 0;
    lefCounter = 0;
    rightCount = 0;
    backCount = 0;
    command : any = "forward";
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


    sayForward():void{
        this.command = "Forward";
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

        if(this.matches == "forward"){
            this.forCounter += 1;
            if(this.forCounter == 2){
                this.report = "You are good, one more time";
            }else{
                this.report = "Good! Try it again.";
            }
        }else{
            this.report = "Oops you didn't get it correct. Try again";
        }
        
        if(this.forCounter == 3){
            this.report = "FORWARD! Success";
            this.command = "Left";
            this.forward = false;
            this.fabChecked = true;
        }
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
            this.report = "LEFT! Success";
            this.command = "right";
            this.left = false;
            this.right = true;
        }
    }

    sayRight():void{
        this.command = "Right";
        this.listen = true;
        this.isRecording = true;
        this.speech.startListening(this.options).subscribe(matches => {
            this.matches = matches[0]
        })
        this.listen = false;
        this.isRecording = false;

        if(this.matches == "right"){
            this.rightCount += 1;
            if(this.rightCount == 2){
                this.report = "You are good, one more time";
            }else{
                this.report = "Good! Try it again.";
            }
        }else{
            this.report = "Oops you didn't get it correct. Try again";
        }
        
        if(this.rightCount == 3){
            this.report = "RIGHT! Success";
            this.command = "back";
            this.right = false;
            this.back = true;
        }
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
            this.report = "BACK! Success";
            this.back = false;
            this.report  = "Training mode complete";
            this.fabChecked = true;
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

    leftPage(){
        this.nav.setRoot(LeftPage);
    }
    
}