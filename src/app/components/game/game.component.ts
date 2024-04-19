import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  title = 'Game Component';
  roomId: string | null = null;
  players: any = [];
  cards = [
    { id: 1, isFlipped: false, role: 'raja', selected: false },
    { id: 2, isFlipped: false, role: 'rani', selected: false },
    { id: 3, isFlipped: false, role: 'theif', selected: false },
    { id: 4, isFlipped: false, role: 'police', selected: false },
  ];
  currentPlayerId!: number;
  currentPlayer: any;

  constructor(
    private route: ActivatedRoute,
    private myService: GameService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentPlayerId = Number(sessionStorage.getItem('playerId'));
    this.myService.connect();
    // Subscribe to the route parameters
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get('id'); // Get the room ID from the URL
      if (this.roomId) {
        // Fetch the list of players
        this.fetchPlayers(this.roomId);
      }
    });
  }

  // Fetch the list of players
  fetchPlayers(roomId: string) {
    console.log('eeeeee', roomId);
    this.myService.getPlayersByRoomId(roomId).subscribe(
      (data) => {
        console.log(data, 'com');
        // Update the players array with data from the backend
        this.players = data;
        this.currentPlayer = this.players.find(
          (c: any) => c.playerId === this.currentPlayerId
        );
      },
      (error) => {
        // Handle any errors here
        console.error('Error fetching players:', error);
      }
    );
  }

  async toggleCard(card: any): Promise<void> {
    this.currentPlayer = this.players.find(
      (c: any) => c.playerId === this.currentPlayerId
    );

    let assignedRole = this.players.filter((p: any) => p.role === card.role);

    let playersUpdated = false;

    console.log(assignedRole, this.currentPlayer);

    if (
      assignedRole.length > 0 &&
      assignedRole[0].playerId !== this.currentPlayerId
    ) {
      this.toastr.warning('This card is already taken by someone');
      return;
    }

    if (this.currentPlayer?.selected) {
      if (card.role === this.currentPlayer.role) {
        card.isFlipped = !card.isFlipped;
      }
      this.toastr.warning(
        "Once card is locked and you can't select again",
        'You are already selected the card'
      );
      return;
    }

    console.log('Contine');

    try {
      await this.myService.updateCardDetails(
        card,
        this.currentPlayerId,
        this.roomId
      );

      this.myService.getUpdatedCardDetails().subscribe((players: any) => {
        this.players = players;
        console.log('Updated players inside subscription:', this.players);
        let currentPlayer = players.find(
          (c: any) => c.playerId === this.currentPlayerId
        );
        console.log(currentPlayer);
        if (currentPlayer?.selected) {
          if (card.role === currentPlayer.role) {
            card.isFlipped = !card.isFlipped;
          }
        }

        console.log(
          players.filter(
            (x: any) =>
              x.role === card.role && x.playerId != this.currentPlayerId
          )
        );

        playersUpdated = true;
        // Use the updated players list here
      });

      // this.players = [...players];
      // console.log(this.players);
    } catch (error) {
      console.error('Error occurred:', error);
    }

    setTimeout(() => {
      if (playersUpdated) {
        console.log('Updated players outside subscription:', this.players);
      }
    }, 2);

    console.log(this.players);

    // card.isFlipped = !card.isFlipped; // Toggle the isFlipped property
  }

  shuffle() {
    const cardContainer = document.getElementById('cardContainer');
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
        if (card instanceof HTMLDivElement) {
          setTimeout(function () {
            card.style.transform = 'translateY(-100%)';
            card.classList.add(hiddenClass);
            setTimeout(function () {
              cardContainer.appendChild(card);
              setTimeout(function () {
                card.style.transform = 'translateY(0)';
                card.classList.remove(hiddenClass);
              }, 10);
            }, 500); // This delay should match the transition duration in CSS
          }, index * 100); // Delay each card by 100ms
        }
      });
    }
  }
}
