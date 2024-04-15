import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  socket:Socket | undefined;
  constructor() { }

  connect(){
    this.socket = io(environment.API_URL);
  }

  createRoom(obj: any){
    this.socket?.emit('createroom',obj);
    this.getRoomId();
  }

  joinRoom(playerDetails: any){
    this.socket?.emit('joinroom',playerDetails);
  }

  getJoinedPlayers(){
    return new Observable((observer) => {
      this.socket?.on("playersList", players => {
        observer.next(players);
      })
    })
  }

  getRoomId(){
    return new Observable((observer) => {
      this.socket?.on("roomCreated", roomId => {
        observer.next(roomId);
      })
    })
  }


  getJoinedRoomId(){
    return new Observable((observer) => {
      this.socket?.on("roomid", roomId => {
        observer.next(roomId);
      })
    })
  }

  getJoinedNotification(){
    this.socket?.on('playerJoinedNotification', (message) => {
      console.log(message);
  });
  }
}
