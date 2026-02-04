import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-housing-location-form',
  // Nombre del selector HTML que se usa para insertar este componente

  standalone: true,
  // Componente independiente, no necesita NgModule

  imports: [CommonModule, ReactiveFormsModule],
  // Módulos usados en la plantilla:
  // - CommonModule: directivas básicas
  // - ReactiveFormsModule: para usar formularios reactivos

  templateUrl: './housingLocationForm.component.html',
  // Archivo externo de plantilla HTML

  styleUrls: ['./housingLocationForm.css']
  // Archivo CSS asociado
})


export class HousingLocationFormComponent {
  // Clase que representa el formulario para crear una vivienda

  private fb = inject(NonNullableFormBuilder);
  // Inyecta FormBuilder para crear el formulario reactivo

  private http = inject(HttpClient);
  // Inyecta HttpClient para hacer peticiones POST

  private router = inject(Router);
  // Inyecta Router para navegar al home después de crear la vivienda

  // Definición del formulario reactivo
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    // Campo nombre: obligatorio, mínimo 3 caracteres

    city: ['', Validators.required],
    // Campo ciudad: obligatorio

    state: ['', Validators.required],
    // Campo estado: obligatorio

    availableUnits: [1, [Validators.required, Validators.min(1)]],
    // Campo unidades disponibles: obligatorio, mínimo 1

    price: [10000, [Validators.required, Validators.min(10000)]],
    // Campo precio: obligatorio, mínimo 10000

    wifi: [false],
    // Checkbox wifi: false por defecto

    laundry: [false],
    // Checkbox laundry: false por defecto

    available: [true]
    // Campo disponible: true por defecto
  });


  successMsg = '';
  // Mensaje que se muestra cuando la vivienda se crea correctamente

  errorMsg = '';
  // Mensaje que se muestra si ocurre un error al enviar el formulario

  submitting = false;
  // Indica si el formulario se está enviando para deshabilitar botones y evitar envíos múltiples


  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.form.invalid) {
      // Si el formulario no es válido
      this.form.markAllAsTouched();
      // Marca todos los campos como tocados para mostrar errores
      return; // Sale del método
    }

    this.submitting = true;
    this.successMsg = '';
    this.errorMsg = '';
    // Reinicia los mensajes y activa estado de envío


    const newHouse = {
      ...this.form.getRawValue(),
      // Toma los valores del formulario

      photo: '',
      // Foto vacía por defecto

      coordinate: { latitude: 0, longitude: 0 }
      // Coordenadas por defecto (0,0)
    };


    // Hace petición POST a json-server para crear la vivienda
    this.http.post('http://localhost:3000/locations', newHouse).subscribe({
      next: (created: any) => {
        // Si la petición fue exitosa
        this.successMsg = `Vivienda «${created.name}» creada (ID: ${created.id})`;
        // Muestra mensaje de éxito

        this.form.reset({
          availableUnits: 1,
          price: 10000,
          wifi: false,
          laundry: false,
          available: true
        });
        // Resetea el formulario a los valores por defecto

        this.submitting = false;
        // Finaliza el estado de envío

        setTimeout(() => this.router.navigate(['/']), 3000);
        // Redirige al home después de 3 segundos
      },
      error: () => {
        // Si ocurre un error en la petición
        this.errorMsg = 'Error al guardar. ¿Está json-server corriendo?';
        // Muestra mensaje de error
        this.submitting = false;
        // Finaliza el estado de envío
      }
    });
  }


  // Método para cancelar la creación y volver al home
  cancel() {
    this.router.navigate(['/']);
    // Navega programáticamente a la página principal
  }
}

