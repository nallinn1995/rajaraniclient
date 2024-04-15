import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';
import { Routes,RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes:Routes = [
  {
    path:'',
    component:LobbyComponent
  }
]
@NgModule({
  declarations:[
    LobbyComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})

export class LobbyModule{}
