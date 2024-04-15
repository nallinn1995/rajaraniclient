import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadChildren:() => import('./components/landing-page/landing-page.module').then((m) => m.LandingPageModule)
  },
  {
    path:'lobby',
    loadChildren:() => import('./components/lobby/lobby.module').then((m) => m.LobbyModule)
  },
  {
    path:'game',
    loadChildren:() => import('./components/game/game.module').then((m) => m.GameModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
