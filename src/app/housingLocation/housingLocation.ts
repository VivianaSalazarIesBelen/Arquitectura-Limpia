import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  // Nombre del selector HTML que se usa para insertar este componente

  standalone: true,
  // Indica que es un componente independiente, no necesita NgModule

  imports: [CommonModule, RouterModule],
  // Módulos que se necesitan en la plantilla:
  // - CommonModule para directivas básicas
  // - RouterModule para enlaces a otras rutas

  template: `
    <section class="listing">
      <!-- Contenedor principal de la tarjeta de vivienda -->

      <div class="image-container">
        <!-- Contenedor de la imagen -->
        <img class="listing-photo"
             [src]="housingLocation.photo"
             alt="Exterior photo of {{housingLocation.name}}">
        <!-- Imagen de la vivienda:
             - [src] enlaza la foto desde el objeto housingLocation
             - alt muestra un texto alternativo con el nombre de la vivienda -->
      </div>

      <div class="content">
        <!-- Contenedor del contenido textual de la tarjeta -->

        <h2 class="listing-heading">{{ housingLocation.name }}</h2>
        <!-- Nombre de la vivienda -->

        <p class="listing-location">
          {{ housingLocation.city }}, {{ housingLocation.state }}
        </p>
        <!-- Ciudad y estado de la vivienda -->

        <a [routerLink]="['/details', housingLocation.id]" class="btn-details">
          Learn More >
        </a>
        <!-- Enlace que lleva a la página de detalles de la vivienda
             - [routerLink] genera la ruta dinámica '/details/:id'
             - housingLocation.id pasa el ID de la vivienda -->
      </div>
    </section>
  `,

  styleUrl: './housingLocation.css'
  // Archivo CSS asociado al componente donde se definen los estilos
})

export class HousingLocationComponent {
  // Clase que representa el componente de una sola vivienda

  @Input() housingLocation!: HousingLocation;
  // Propiedad de entrada:
  // - Recibe un objeto de tipo HousingLocation desde el componente padre (HomeComponent)
  // - El signo ! indica que nunca será null o undefined al usarlo en la plantilla
}
