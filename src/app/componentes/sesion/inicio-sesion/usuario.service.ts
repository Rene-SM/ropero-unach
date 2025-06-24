import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuario';

  constructor(private http: HttpClient) {}

  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  iniciarSesion(datos: { correo: string; contraseña: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, datos);
  }

  verificarCorreo(correo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar-correo/${encodeURIComponent(correo)}`);
  }

  // 🔍 Obtener perfil público por ID de usuario
  obtenerPerfilPublico(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfil-publico/${id}`);
  }
}
