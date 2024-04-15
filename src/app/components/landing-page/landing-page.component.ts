import { Component } from "@angular/core";
import { GameService } from "../../services/game.service";
@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent {
  constructor(private service: GameService) {}
  ngOnInit() {
    this.service.connect();
  }
}
