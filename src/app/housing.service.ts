import { Injectable } from '@angular/core';
import { HousingLocation } from './housinglocation';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
// Hace que el servicio sea **singleton** y disponible en toda la app
export class HousingService {


  url = 'http://localhost:3000/locations';
  // URL base para la API o json-server donde se almacenan las viviendas


  // Método que obtiene todas las viviendas
  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(this.url);
    // Hace una petición HTTP GET a la URL para obtener todas las viviendas

    return await data.json() ?? [];
    // Convierte la respuesta a JSON y devuelve un array de HousingLocation
    // Si falla, devuelve un array vacío
  }


  // Método que obtiene una vivienda por ID
  async getHousingLocationById(id: number): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    // Hace petición GET a la URL específica de la vivienda por ID

    return await data.json() ?? {};
    // Convierte la respuesta a JSON y devuelve la vivienda
    // Si no hay datos, devuelve un objeto vacío
  }


  // Método que simula enviar un formulario de solicitud
  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(firstName, lastName, email);
    // Por ahora solo imprime los datos en consola
  }


  // Método que obtiene datos del clima para coordenadas específicas
  async getWeather(lat: number, lon: number): Promise<any> {
    const apiKey = environment.weatherApiKey;
    // Obtiene la API key del archivo de entorno

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
    // Construye la URL de la API de WeatherAPI con latitud y longitud

    const res = await fetch(url);
    // Hace petición GET a la API de clima

    return await res.json();
    // Convierte la respuesta a JSON y devuelve los datos del clima
  }
}
