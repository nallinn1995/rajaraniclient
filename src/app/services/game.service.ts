import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  socket: Socket | undefined;
  constructor() {}

  connect() {
    this.socket = io(environment.API_URL);
  }

  createRoom(obj: any) {
    this.socket?.emit('createroom', obj);
    this.getRoomId();
  }

  joinRoom(playerDetails: any) {
    this.socket?.emit('joinroom', playerDetails);
  }

  getJoinedPlayers() {
    return new Observable((observer) => {
      this.socket?.on('playersList', (players) => {
        observer.next(players);
      });
    });
  }

  getRoomId() {
    return new Observable((observer) => {
      this.socket?.on('roomCreated', (roomId) => {
        observer.next(roomId);
      });
    });
  }

  getJoinedRoomId() {
    return new Observable((observer) => {
      this.socket?.on('roomid', (roomId) => {
        observer.next(roomId);
      });
    });
  }

  getJoinedNotification() {
    this.socket?.on('playerJoinedNotification', (message) => {
      console.log(message);
    });
  }
  roomFull() {
    return new Observable((observer) => {
      this.socket?.on('roomFull', (data) => {
        observer.next(data);
      });
    });
  }

  playUpdate(obj: any) {
    console.log(obj, 'sssssssssssssssss');
    this.socket?.emit('playUpdate', obj);
  }

  roomMem() {
    return new Observable((observer) => {
      this.socket?.on('roomMem', (data) => {
        observer.next(data);
      });
    });
  }

  getPlayersByRoomId(roomID: string) {
    return new Observable<any[]>((observer) => {
      // Function to handle the list of players received from the server
      const handlePlayersList = (playersList: any[]) => {
        console.log('Received players list:', playersList);
        observer.next(playersList);
        observer.complete();
      };

      // Listen for the 'playerList' event from the server
      this.socket?.on('playerList', handlePlayersList);
      console.log('cccccccccccccc', roomID);
      // Emit a request to the server to get players in the specified room
      this.socket?.emit('getPlayers', roomID);

      // Clean up the subscription when the observable is unsubscribed
      return () => {
        this.socket?.off('playerList', handlePlayersList);
      };
    });
  }

  updateCardDetails(card: any, playerid: any, roomid: any) {
    this.socket?.emit('selectCard', card, playerid, roomid);
  }

  getUpdatedCardDetails() {
    return new Observable((observer) => {
      this.socket?.on('updatedPlayerListCard', (data) => {
        observer.next(data);
      });
    });
  }

  checkAssignedRole() {
    return new Observable((observer) => {
      this.socket?.on('isAssignedRole', (data) => {
        observer.next(data);
      });
    });
  }

  checkCurrentPlayer() {
    return new Observable((observer) => {
      this.socket?.on('isCurrentPlayer', (data) => {
        observer.next(data);
      });
    });
  }
}
