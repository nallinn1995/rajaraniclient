import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GameService } from "../../services/game.service";
@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  title = "Game Component";
  roomId: string | null = null;
  players: any = [];
  cards = [
    { isFlipped: false, role: "raja",selected:false },
    { isFlipped: false, role: "rani",selected:false },
    { isFlipped: false, role: "theif",selected:false },
    { isFlipped: false, role: "police",selected:false },
  ];
  currentPlayerId!:number;

  constructor(
    private route: ActivatedRoute,
    private myService: GameService // Inject your service
  ) {}


  ngOnInit() {
      this.currentPlayerId = Number(sessionStorage.getItem('playerId'));

    this.myService.connect();
    // Subscribe to the route parameters
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get("id"); // Get the room ID from the URL
      if (this.roomId) {
        // Fetch the list of players
        this.fetchPlayers(this.roomId);
      }
    });
  }

  // Fetch the list of players
  fetchPlayers(roomId: string) {
    console.log("eeeeee", roomId);
    this.myService.getPlayersByRoomId(roomId).subscribe(
      (data) => {
        console.log(data, "com");
        // Update the players array with data from the backend
        this.players = data;
      },
      (error) => {
        // Handle any errors here
        console.error("Error fetching players:", error);
      }
    );
  }

toggleCard(card: any): void {
  card.selected = true;
    console.log(card,this.players,this.currentPlayerId);

    this.myService.updateCardDetails(card,this.currentPlayerId,this.roomId);
    console.log(this.myService.getUpdatedCardDetails());
    this.myService.getUpdatedCardDetails().subscribe((players:any)=>{
      console.log(players);
      // let player = players.filter((x:any) => x.playerId === this.currentPlayerId).pop();
      // console.log(player);
      // if(player.selected && player.role === card.role){

      // }
    })
    // card.isFlipped = !card.isFlipped; // Toggle the isFlipped property
  }


  shuffle() {
    const cardContainer = document.getElementById("cardContainer");
    if (cardContainer) {
      const cards = cardContainer.children;
      console.log(cards);
      const cardArray = Array.from(cards);
      var hiddenClass = 'hidden';

      for (var i = cardArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cardArray[i];
        cardArray[i] = cardArray[j];
        cardArray[j] = temp;
      }

      // Add a delay between each card movement for animation effect
      cardArray.forEach(function (card, index) {
        if(card instanceof HTMLDivElement){
          setTimeout(function () {
            card.style.transform = "translateY(-100%)";
            card.classList.add(hiddenClass);
            setTimeout(function () {
              cardContainer.appendChild(card);
              setTimeout(function () {
                card.style.transform = "translateY(0)";
                card.classList.remove(hiddenClass);
              }, 10);
            }, 500); // This delay should match the transition duration in CSS
          }, index * 100); // Delay each card by 100ms
        }

      });
    }
  }
}
