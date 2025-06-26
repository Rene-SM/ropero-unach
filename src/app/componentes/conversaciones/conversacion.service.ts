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
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const id_emisor = usuario?.id_usuario;

    return this.http.get<any[]>(`${this.apiUrl}?id_emisor=${id_emisor}`);
  }

  // Obtener los mensajes de una conversación por ID
  obtenerMensajes(idConversacion: number): Observable<any[]> {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const id_emisor = usuario?.id_usuario;

    return this.http.get<any[]>(`${this.apiUrl}/${idConversacion}/mensajes?id_emisor=${id_emisor}`);
  }


  // Enviar un mensaje de texto a una conversación
  enviarMensaje(idConversacion: number, contenido: string): Observable<any> {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const id_emisor = usuario?.id_usuario;

    return this.http.post<any>(`${this.apiUrl}/${idConversacion}/mensajes`, {
      contenido,
      id_emisor
    });
  }

  // Enviar una imagen en una conversación
  enviarImagen(idConversacion: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idConversacion}/mensajes-imagen`, formData);
  }

  // Buscar o crear conversación entre dos usuarios
  iniciarConversacion(idEmisor: number, idReceptor: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iniciar`, { id_emisor: idEmisor, id_receptor: idReceptor });
  }

}
