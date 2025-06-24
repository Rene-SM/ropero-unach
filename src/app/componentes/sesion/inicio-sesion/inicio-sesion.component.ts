import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  mostrarModal: boolean = false;

  correo: string = '';
  contrasena: string = '';
  errorCorreo: string = '';
  mensajeConfirmacion: string = '';
  errorInicio: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.errorCorreo = '';
    this.mensajeConfirmacion = '';
    this.errorInicio = '';
    this.correo = '';
    this.contrasena = '';
  }

  iniciarSesion(): void {
    const dominioValido = ['@alu.unach.cl', '@unach.cl'];
    const correoValido = dominioValido.some(d => this.correo.endsWith(d));

    if (!correoValido) {
      this.errorCorreo = 'Solo se permiten correos @alu.unach.cl o @unach.cl';
      return;
    }

    this.usuarioService.iniciarSesion({
      correo: this.correo,
      contraseña: this.contrasena
    }).subscribe({
      next: (res: any) => {
        // ✅ Guardar usuario y token (incluyendo tipo)
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token);

        this.mensajeConfirmacion = `¡Bienvenido, ${res.usuario.nombre}!`;

        // 🔁 Forzar recarga para que el header se actualice
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err: any) => {
        this.errorInicio = err.error?.error || 'Error al iniciar sesión.';
        this.mensajeConfirmacion = '';
        setTimeout(() => {
          this.errorInicio = '';
        }, 4000);
      }
    });
  }

  irARegistro(): void {
    this.cerrarModal();
    this.router.navigate(['/registro']);
  }
}
