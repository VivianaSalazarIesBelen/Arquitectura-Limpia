import { Injectable } from '@angular/core';
import { HousingLocation } from './housinglocation';

export interface HousingProvider {
  getAllHousingLocations(): Promise<HousingLocation[]>;
}

@Injectable({
  providedIn: 'root'
})
export class ResilientHousingService implements HousingProvider {

  // URL de la API (si estuviera disponible)
  private readonly apiUrl = 'http://localhost:3000/locations';

  // JSON local de respaldo
  private readonly localUrl = 'assets/db.json';

  // API key para obtener clima (opcional según enunciado)
  private readonly weatherApiKey = '3fb0b08a688a4a9d96c115901260801';

  // Obtener todas las viviendas
  async getAllHousingLocations(): Promise<HousingLocation[]> {
    try {
      // Intento de obtener datos desde la API
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Servidor fuera de servicio');
      return await response.json();
    } catch {
      // Si falla la API, usar el JSON local
      console.warn('API caída. Cargando datos locales...');
      try {
        const fallback = await fetch(this.localUrl);
        const data = await fallback.json();
        return data.locations ? data.locations : data;
      } catch {
        console.error('Error total: ni API ni JSON local');
        return [];
      }
    }
  }

  // Obtener vivienda por ID
  async getHousingLocationById(id: number): Promise<HousingLocation | undefined> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      return await response.json();
    } catch {
      const all = await this.getAllHousingLocations();
      return all.find(loc => loc.id === id);
    }
  }

  // Obtener clima (opcional)
  async getWeather(lat: number, lon: number): Promise<any> {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${this.weatherApiKey}&q=${lat},${lon}&lang=es`
    );
    return await response.json();
  }

  // Simulación de envío de formulario
  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Solicitud guardada localmente: ${firstName} ${lastName}`);
  }
}
