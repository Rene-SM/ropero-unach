import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversacionService {
  private apiUrl = 'http://localhost:3000/api/mensajes'; // Ajusta si usas otro dominio o puerto

  constructor(private http: HttpClient) {}

  obtenerConversaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversaciones`);
  }

  obtenerMensajes(idReceptor: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversacion/${idReceptor}`);
  }

  enviarMensaje(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviar`, data);
  }

  enviarImagen(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviar-imagen`, formData);
  }
}
