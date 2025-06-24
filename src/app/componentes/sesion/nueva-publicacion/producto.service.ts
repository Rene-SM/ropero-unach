import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  // Publicar un nuevo producto
  publicarProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  // 🔍 Obtener un producto por ID (para detalle-producto)
  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ✅ Obtener productos de la categoría "Ropa"
  obtenerRopaGeneral(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ropa`);
  }

  // ✅ Obtener productos de la categoría "Accesorios"
  obtenerAccesorios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accesorios`);
  }

  // ✅ Obtener productos que sean donaciones a la Comunidad
  obtenerDonacionesComunidad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donaciones-comunidad`);
  }

  // ✅ Modificado: Eliminar producto por ID con idAdmin en headers
  eliminarProducto(id: number, idAdmin: number): Observable<any> {
    const headers = new HttpHeaders().set('idadmin', idAdmin.toString());
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // ✅ Obtener historial de moderación
  obtenerHistorialModeracion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial-moderacion`);
  }
}
