import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductoService } from '../sesion/nueva-publicacion/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = null;
  usuarioEditado: any = {};
  calificaciones: any[] = [];
  promedio: number | null = null;
  editando: boolean = false;

  // ✅ Se agregó 'foto' como opción
  modo: 'foto' | 'datos' | 'calificaciones' | 'password' | 'publicaciones' | 'compras' | 'moderacion' = 'datos';

  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  repetirContrasena: string = '';

  mostrarActual = false;
  mostrarNueva = false;
  mostrarRepetir = false;

  historialPublicaciones: any[] = [];
  historialCompras: any[] = [];
  historialModeracion: any[] = [];

  esAdmin: boolean = false;

  nuevaImagen: File | null = null;

  constructor(
    private http: HttpClient,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idUsuario = this.obtenerIdDesdeToken();
    if (!idUsuario) {
      console.error('No se pudo obtener el ID del usuario desde el token');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/usuario/perfil/${idUsuario}`).subscribe(
      res => {
        this.usuario = res.usuario;
        this.calificaciones = res.calificaciones;
        this.promedio = res.promedio_calificacion;
        this.usuarioEditado = { ...res.usuario };
        this.esAdmin = res.usuario.tipo === 'admin';

        console.log('🧠 Datos del usuariossssssss:', this.usuario);

        if (this.esAdmin) {
          this.cargarHistorialModeracion();
        }
      },
      error => {
        console.error('Error al cargar perfil:', error);
      }
    );

    this.cargarHistorialPublicaciones(idUsuario);
    this.cargarHistorialCompras(idUsuario);
  }

  obtenerIdDesdeToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const decoded = JSON.parse(payloadJson);
      return decoded.id_usuario || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  cargarHistorialModeracion(): void {
    this.productoService.obtenerHistorialModeracion().subscribe(
      res => this.historialModeracion = res,
      err => console.error('Error al obtener historial de moderación:', err)
    );
  }

  habilitarEdicion() {
    this.editando = true;
    this.usuarioEditado = { ...this.usuario };
  }

  guardarCambios() {
    const id = this.usuario.id_usuario;
    this.http.put(`http://localhost:3000/api/usuario/${id}`, this.usuarioEditado).subscribe(
      () => {
        this.usuario = { ...this.usuarioEditado };
        this.editando = false;
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'Tu información ha sido actualizada correctamente.',
          confirmButtonColor: '#2e7d32'
        });
      },
      err => {
        console.error('Error al actualizar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar los cambios.',
          confirmButtonColor: '#c62828'
        });
      }
    );
  }

  validarContrasena(): boolean {
    const pwd = this.nuevaContrasena;
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd) && !/\s/.test(pwd);
  }

  getFuerzaClase(): string {
    const fuerza = this.getFuerzaPorcentaje();
    if (fuerza < 40) return 'avance debil';
    if (fuerza < 80) return 'avance media';
    return 'avance fuerte';
  }

  getFuerzaPorcentaje(): number {
    let fuerza = 0;
    const pwd = this.nuevaContrasena;
    if (pwd.length >= 8) fuerza += 25;
    if (/[A-Z]/.test(pwd)) fuerza += 25;
    if (/[a-z]/.test(pwd)) fuerza += 20;
    if (/\d/.test(pwd)) fuerza += 20;
    if (!/\s/.test(pwd)) fuerza += 10;
    return fuerza;
  }

  cambiarContrasena() {
    const id = this.usuario.id_usuario;
    this.http.put(`http://localhost:3000/api/usuario/cambiar-password/${id}`, {
      contrasenaActual: this.contrasenaActual,
      nuevaContrasena: this.nuevaContrasena
    }).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña se cambió exitosamente.',
          confirmButtonColor: '#2e7d32'
        });
        this.contrasenaActual = '';
        this.nuevaContrasena = '';
        this.repetirContrasena = '';
      },
      err => {
        console.error('Error al cambiar contraseña:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Verifica tu contraseña actual.',
          confirmButtonColor: '#c62828'
        });
      }
    );
  }

  cargarHistorialPublicaciones(idUsuario: number) {
    this.http.get<any[]>(`http://localhost:3000/api/productos/publicaciones/${idUsuario}`).subscribe(
      res => this.historialPublicaciones = res,
      err => console.error('Error al obtener publicaciones:', err)
    );
  }

  cargarHistorialCompras(idUsuario: number) {
    this.http.get<any[]>(`http://localhost:3000/api/usuario/${idUsuario}/compras`).subscribe(
      res => this.historialCompras = res,
      err => console.error('Error al obtener compras:', err)
    );
  }

  confirmarEliminacion() {
    Swal.fire({
      title: '¿Eliminar cuenta?',
      text: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const id = this.usuario.id_usuario;
        this.http.delete(`http://localhost:3000/api/usuario/${id}`).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Cuenta eliminada',
              text: 'Tu cuenta ha sido eliminada correctamente.',
              confirmButtonColor: '#2e7d32'
            }).then(() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            });
          },
          err => {
            console.error('Error al eliminar cuenta:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la cuenta. Intenta nuevamente.',
              confirmButtonColor: '#c62828'
            });
          }
        );
      }
    });
  }

  seleccionarImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'Solo se permiten imágenes JPG, JPEG, PNG o WEBP.',
        confirmButtonColor: '#43a047'
      });
      return;
    }

    this.nuevaImagen = file;
  }

  subirImagen() {
    if (!this.nuevaImagen || !this.usuario?.id_usuario) return;

    const formData = new FormData();
    formData.append('imagen', this.nuevaImagen);

    this.http.put(`http://localhost:3000/api/usuario/subir-imagen/${this.usuario.id_usuario}`, formData).subscribe({
      next: (res: any) => {
        this.usuario.imagen = res.imagen;
        this.nuevaImagen = null;
        Swal.fire('Imagen actualizada', 'Tu foto de perfil fue cambiada correctamente', 'success');
      },
      error: err => {
        console.error('Error al subir imagen:', err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      }
    });
  }

  verPerfilPublico() {
    if (this.usuario && this.usuario.id_usuario) {
      this.router.navigate(['/perfil-publico', this.usuario.id_usuario]);
    }
  }
}
