import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversacionService {
  private apiUrl = 'http://localhost:3000/api/conversaciones'; // ✅ nueva ruta base

  constructor(private http: HttpClient) {}

  // Obtener todas las conversaciones del usuario autenticado
  obtenerConversaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener los mensajes de una conversación por ID
  obtenerMensajes(idConversacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idConversacion}/mensajes`);
  }

  // Enviar un mensaje de texto a una conversación
  enviarMensaje(idConversacion: number, contenido: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idConversacion}/mensajes`, { contenido });
  }

  // Enviar una imagen en una conversación
  enviarImagen(idConversacion: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idConversacion}/mensajes-imagen`, formData);
  }
}
