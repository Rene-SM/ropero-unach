import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/solicitudes';

  constructor(private http: HttpClient) {}

  iniciarSolicitud(data: { id_producto: number, id_usuario: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, data);
  }
}
