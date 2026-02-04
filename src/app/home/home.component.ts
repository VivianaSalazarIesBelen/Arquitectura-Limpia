import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';
import { RouterModule } from '@angular/router';
import { HousingLocationComponent } from '../housingLocation/housingLocation';

@Component({
  selector: 'app-home',
  // Nombre del selector HTML que se usa para insertar este componente

  standalone: true,
  // Componente independiente que no necesita un NgModule

  imports: [CommonModule, FormsModule, RouterModule, HousingLocationComponent],
  // Importa módulos y componentes necesarios para la plantilla

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
        <!-- Campo de búsqueda:
             [(ngModel)] enlaza el valor al property cityFilter
             (ngModelChange) llama a filterLocations() cada vez que cambia -->

        <button class="primary" type="button" (click)="filterLocations()">
          Search
        </button>
        <!-- Botón que filtra las viviendas cuando se hace clic -->
      </form>
    </section>

    <a routerLink="/add-house" class="btn btn-primary mb-3">
      Añadir nueva vivienda
    </a>
    <!-- Enlace que redirige al formulario para añadir una vivienda nueva -->

    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation">
      </app-housing-location>
      <!-- Renderiza una tarjeta de vivienda por cada elemento filtrado
           usando el componente hijo HousingLocationComponent -->
    </section>
  `,

  styleUrls: ['./home.css']
  // Archivo CSS asociado a este componente
})


export class HomeComponent implements OnInit {
  // Clase principal del componente, implementa OnInit para inicializar datos

  housingLocationList: HousingLocation[] = [];
  // Lista completa de todas las viviendas obtenidas desde el servicio

  filteredLocationList: HousingLocation[] = [];
  // Lista de viviendas que cumplen el filtro (ciudad) y se muestran en la vista

  cityFilter: string = '';
// Texto ingresado en el input de búsqueda

  constructor(private housingService: HousingService) {}
// Inyecta el servicio HousingService para acceder a los datos de viviendas

  ngOnInit(): void {
    this.housingService.getAllHousingLocations().then(list => {
      this.housingLocationList = list;
      this.filteredLocationList = list;
    });
    // Al iniciar el componente:
    // 1. Llama al servicio para obtener todas las viviendas
    // 2. Guarda la lista completa en housingLocationList
    // 3. Inicializa filteredLocationList con todas las viviendas (sin filtrar)
  }

  filterLocations(): void {
    if (!this.cityFilter) {
      this.filteredLocationList = this.housingLocationList;
      // Si el campo de búsqueda está vacío, muestra todas las viviendas
    } else {
      this.filteredLocationList = this.housingLocationList.filter(location =>
        location.city.toLowerCase().includes(this.cityFilter.toLowerCase())
      );
      // Si hay texto en el campo de búsqueda:
      // 1. Convierte a minúsculas el texto del input y el nombre de la ciudad
      // 2. Filtra la lista para que solo queden viviendas cuya ciudad contenga el texto
    }
  }
}
