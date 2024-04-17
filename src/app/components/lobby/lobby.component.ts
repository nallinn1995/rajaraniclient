import { Component } from "@angular/core";
import { GameService } from "../../services/game.service";
import { v4 as uuidv4 } from "uuid";
import { FormGroup, FormBuilder } from "@angular/forms";
import { io, Socket } from "socket.io-client";
import { ClipboardService } from "ngx-clipboard";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-game",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
})
export class LobbyComponent {
  title = "Lobby Component";
  createRoomForm!: FormGroup;
  joinRoomForm!: FormGroup;
  roomCode: any;
  connectedPlayers: any[] = [];
  selectedAvatar: any;
  joinAvatar: any;
  selectedjoinedAvatar: any;
  selectedAvatars: any[] = [];

  avatars: any[] = [
    {
      id: 1,
      image:
        "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg",
    },
    {
      id: 2,
      image:
        "https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-male-avatar-image-in-the-circle-image_2908803.jpg",
    },
    {
      id: 3,
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/024/183/525/small/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg",
    },
    {
      id: 4,
      image:
        "https://static.vecteezy.com/system/resources/previews/002/002/427/non_2x/man-avatar-character-isolated-icon-free-vector.jpg",
    },
  ];

  constructor(
    private gameService: GameService,
    private fb: FormBuilder,
    private clipboardService: ClipboardService,
    private toastr: ToastrService

  ) {}
  ngOnInit() {
    this.gameService.connect();
    this.createRoomForm = this.fb.group({
      playerName: "",
      roomId: "",
      createAvatar: "",
    });

    this.joinRoomForm = this.fb.group({
      playerName: "",
      roomId: "",
      joinAvatar: "",
    });
  }
  currentPlayer:any

  createRoom(type: any) {
    if (type === "create") {
      let obj:any = {
        playerName:this.createRoomForm.get("playerName")?.value,
        avatar:this.selectedAvatar,
        host:'oraganizer'
      }
      this.currentPlayer = obj;
      this.gameService.createRoom(obj);
      this.gameService.getRoomId().subscribe((id: any) => {
        obj["roomId"] = id;
        this.roomCode = id;
        this.createRoomForm.get("roomId")?.setValue(id);
        this.joinRoom(obj);
      });
    } else {
      const obj = {
        playerName:this.joinRoomForm.get("playerName")?.value,
        roomId:this.joinRoomForm.get("roomId")?.value ? this.joinRoomForm.get("roomId")?.value : this.roomCode,
        avatar:this.selectedAvatar,
        host:'participator'
      }
      this.currentPlayer = obj;
      this.roomCode = this.joinRoomForm.get("roomId")?.value
      this.joinRoom(obj);
    }
  }

  member:any;
  userLength:boolean = false
  async joinRoom(formObj:any) {
    this.gameService.roomFull().subscribe((member:any)=>{
        this.userLength = member
    })
    if(this.userLength){
        alert("gameeeeeee full")
        return
    }
     this.gameService.roomMem().subscribe((data:any) => {
        console.log(data,"memmber")
        this.member= data;
    })
   
    this.gameService.joinRoom(formObj);
    this.gameService.getRoomId().subscribe((id: any) => {
      this.roomCode = id;
    });
    this.gameService.getJoinedPlayers().subscribe((players: any) => {
    this.connectedPlayers = players;

     
    });
  }

  storeAvatar(avatar: any, type: string) {
    this.selectedAvatar = avatar.image;
  }

  playClick(){
    console.log("dddddddddddddd",this.currentPlayer)
    this.gameService.playUpdate(this.currentPlayer);
  }
  copyCode(copyCode: any) {
    this.clipboardService.copy(copyCode);
    this.toastr.info("copied");
  }

  share(code:any){

  }
}
