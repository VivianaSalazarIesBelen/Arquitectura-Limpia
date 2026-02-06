import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';
import { ResilientHousingService } from '../housing.service';
import { RouterModule } from '@angular/router';
import { HousingLocationComponent } from '../housingLocation/housingLocation';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HousingLocationComponent],
  template: `
    <section class="search-section">
      <form>
        <input
          type="text"
          placeholder="Filter by city"
          [(ngModel)]="cityFilter"
          (ngModelChange)="filterLocations()"
          name="city"
        >

        <button class="primary" type="button" (click)="filterLocations()">
          Search
        </button>
      </form>
    </section>

    <a routerLink="/add-house" class="btn btn-primary mb-3">
      Añadir nueva vivienda
    </a>

    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation">
      </app-housing-location>
    </section>
  `,
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  cityFilter: string = '';

  constructor(private housingService: ResilientHousingService) {}

  ngOnInit(): void {
    this.housingService.getAllHousingLocations().then(list => {
      this.housingLocationList = list;
      this.filteredLocationList = list;
    });
  }

  filterLocations(): void {
    if (!this.cityFilter) {
      this.filteredLocationList = this.housingLocationList;
    } else {
      this.filteredLocationList = this.housingLocationList.filter(location =>
        location.city.toLowerCase().includes(this.cityFilter.toLowerCase())
      );
    }
  }
}
