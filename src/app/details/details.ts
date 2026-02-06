import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { AfterViewInit } from '@angular/core';
import { ResilientHousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';


@Component({
  selector: 'app-details', // Nombre del selector HTML que se usará para este componente
  standalone: true,         // Componente independiente (no necesita NgModule)
  imports: [CommonModule, ReactiveFormsModule], // Importa módulos necesarios para el template
  template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo"
           alt="Exterior photo of {{housingLocation?.name}}"/>
      <!-- Muestra la foto de la vivienda, usa safe navigation (?.) para evitar errores si no hay datos -->

      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
        <!-- Información básica: nombre, ciudad y estado -->
      </section>

      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Price: {{ housingLocation?.price | currency:'EUR' }}</li>
          <li>Is available: {{ housingLocation?.available ? 'Yes' : 'No' }}</li>
          <li>Does this location have wifi: {{ housingLocation?.wifi ? 'Yes' : 'No' }}</li>
          <li>Does this location have laundry: {{ housingLocation?.laundry ? 'Yes' : 'No' }}</li>
        </ul>
        <!-- Lista de características de la vivienda -->
      </section>

      <section class="weather-info" *ngIf="weatherData">
        <h2 class="section-heading">Current Weather</h2>
        <div style="display: flex; align-items: center; gap: 10px;">
          <img [src]="weatherData.current.condition.icon" alt="weather icon">
          <p><strong>{{ weatherData.current.temp_c }}°C</strong> - {{ weatherData.current.condition.text }}</p>
        </div>
        <!-- Información meteorológica solo se muestra si hay datos -->
      </section>

      <section>
        <h2 class="section-heading">Location Map</h2>
        <!-- Aquí iba el div del mapa, comentado actualmente -->
      </section>

      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <!-- Formulario reactivo que usa applyForm -->

          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName">
          <p *ngIf="applyForm.get('firstName')?.invalid && applyForm.get('firstName')?.touched" class="error-text">
            First name is required
          </p>
          <!-- Campo nombre con validación: muestra mensaje si es inválido y tocado -->

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName">
          <p *ngIf="applyForm.get('lastName')?.invalid && applyForm.get('lastName')?.touched" class="error-text">
            Last name is required
          </p>
          <!-- Campo apellido con validación -->

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email">
          <p *ngIf="applyForm.get('email')?.invalid && applyForm.get('email')?.touched" class="error-text">
            Valid email is required
          </p>
          <!-- Campo email con validación de formato y requerido -->

          <button type="submit" class="primary" [disabled]="applyForm.invalid">Apply now</button>
          <!-- Botón que se desactiva si el formulario es inválido -->
        </form>
      </section>
    </article>
  `,

  styleUrl: './details.css'
  // Archivo de estilos CSS asociado al componente
})


export class DetailsComponent implements OnInit, AfterViewInit {

  ngAfterViewInit() {
    this.initMap();
    // AfterViewInit: inicializa el mapa después de que Angular haya renderizado la vista
  }

  route: ActivatedRoute = inject(ActivatedRoute);
  // Inyecta ActivatedRoute para leer parámetros de la URL (ej. ID de vivienda)

  housingService = inject(ResilientHousingService);
  // Inyecta HousingService para obtener datos de vivienda y clima

  housingLocation: HousingLocation | undefined;
  // Propiedad donde se guarda la vivienda actual

  weatherData: any;
  // Propiedad donde se guarda la información del clima

  private map: any;
  // Referencia al mapa Leaflet

  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
// Definición del formulario reactivo con tres campos y validaciones

  ngOnInit() {

    const savedData = localStorage.getItem('applicationData');
    if (savedData) this.applyForm.patchValue(JSON.parse(savedData));
    // Si hay datos guardados en localStorage, los carga al formulario

    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    // Obtiene el ID de la vivienda desde la URL

    this.housingService.getHousingLocationById(housingLocationId).then(location => {
      this.housingLocation = location;
      if (location) {
        this.loadExtras();
      }
    });
    // Obtiene la vivienda por ID usando el servicio y carga datos extras
  }
  private loadExtras() {
    if (!this.housingLocation?.coordinate) return;
    // Si no hay coordenadas, no hace nada

    const { latitude, longitude } = this.housingLocation.coordinate;

    this.housingService.getWeather(latitude, longitude)
      .then(data => this.weatherData = data);
    // Obtiene el clima para la ubicación de la vivienda

    setTimeout(() => {
      this.initMap();
      this.map.invalidateSize(); // fuerza recalculo del tamaño del mapa
    }, 0);
    // Espera un "tick" para asegurarse de que el div del mapa está renderizado antes de inicializarlo
  }
  private initMap(): void {
    const mapDiv = document.getElementById('map');
    // Obtiene el div donde irá el mapa

    if (this.housingLocation?.coordinate && mapDiv && !this.map) {
      const { latitude, longitude } = this.housingLocation.coordinate;

      this.map = L.map('map').setView([latitude, longitude], 13);
      // Crea el mapa centrado en la coordenada de la vivienda

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap' }
      ).addTo(this.map);
      // Añade capa de mapas de OpenStreetMap

      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(this.housingLocation.name)
        .openPopup();
      // Añade un marcador con un popup que muestra el nombre de la vivienda

      setTimeout(() => this.map.invalidateSize(), 200);
      // Corrige el tamaño del mapa después de que se haya renderizado
    }
  }
  submitApplication() {
    if (this.applyForm.valid) {
      localStorage.setItem('applicationData', JSON.stringify(this.applyForm.value));
      // Guarda los datos en localStorage

      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? ''
      );
      // Envía los datos al servicio (simulado)

      alert('¡Solicitud enviada!');
      // Muestra un mensaje de confirmación al usuario
    }
  }
}
