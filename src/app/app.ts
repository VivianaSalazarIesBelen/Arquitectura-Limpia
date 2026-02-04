import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details';
import { HousingLocationFormComponent } from './housingLocationForm/housingLocationForm';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'add-house', component: HousingLocationFormComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
