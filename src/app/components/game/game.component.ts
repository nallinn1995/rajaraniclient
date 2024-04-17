import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service'; 
@Component({
  selector:'app-game',
  templateUrl:'./game.component.html',
  styleUrls:['./game.component.scss']
})

export class GameComponent {
  title = "Game Component";
  roomId: string | null = null;
  players: any = []
  cards = [
    { isFlipped: false, role:'raja' },
    { isFlipped: false, role:'rani'},
    { isFlipped: false, role:'theif'},
    { isFlipped: false, role:'police' },
  ];

  toggleCard(card: any): void {
    card.isFlipped = !card.isFlipped; // Toggle the isFlipped property
  }
  constructor(
      private route: ActivatedRoute,
      private myService: GameService // Inject your service
  ) {}

  ngOnInit() {
     this.myService.connect();
      // Subscribe to the route parameters
      this.route.paramMap.subscribe(params => {
          this.roomId = params.get('id'); // Get the room ID from the URL
          if (this.roomId) {
              // Fetch the list of players
              this.fetchPlayers(this.roomId);
          }
      });
  }

  // Fetch the list of players
  fetchPlayers(roomId: string) {
    console.log("eeeeee",roomId)
      this.myService.getPlayersByRoomId(roomId).subscribe(
          (data) => {
            console.log(data,"com")
              // Update the players array with data from the backend
              this.players = data;
          },
          (error) => {
              // Handle any errors here
              console.error('Error fetching players:', error);
          }
      );
  }
}
