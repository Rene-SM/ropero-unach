import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../inicio-sesion/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  /** ---------- Estado del formulario ---------- */
  usuario = {
    correo: '',
    nombre: '',
    apellidos: '',
    rut: '',
    celular: '',
    password: '',
    repetirPassword: '',
    fechaNacimiento: '',
    tipo: 'estudiante'
  };

  aceptaTerminos = false;
  verPassword = false;
  verRepetir = false;

  /** 🔐 Clave secreta si selecciona admin */
  claveAdmin: string = '';
  private CLAVE_ADMIN = 'UNACH2025'; // Puedes cambiar esta clave cuando desees

  /** ---------- Modal ---------- */
  mostrarModal = false;
  tituloModal = '';
  mensajeModal = '';
  redirigirAlInicio = false;

  /* =======================================================
     UTILIDADES
     ======================================================= */
  toggleVerPassword() { this.verPassword = !this.verPassword; }
  toggleVerRepetir()  { this.verRepetir  = !this.verRepetir; }

  correoValido(): boolean {
    const correo = this.usuario.correo.trim().toLowerCase();
    return correo.endsWith('@unach.cl') || correo.endsWith('@alu.unach.cl');
  }

  validarPassword(password: string): boolean {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero    = /[0-9]/.test(password);
    const tieneEspacios  = /\s/.test(password);
    return password.length >= 8 && tieneMayuscula && tieneNumero && !tieneEspacios;
  }

  get passwordStrength(): number {
    const pwd = this.usuario.password;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  rutValido(rut: string): boolean {
    rut = rut.replace(/[^\dkK]/g, '').toUpperCase();
    if (!/^(\d{7,8})([0-9K])$/.test(rut)) return false;

    const cuerpo = rut.slice(0, -1);
    const dv     = rut.slice(-1);

    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto        = 11 - (suma % 11);
    const dvCalculado  = resto === 11 ? '0' : resto === 10 ? 'K' : resto.toString();
    return dv === dvCalculado;
  }

  // ✅ NUEVA FUNCIÓN: Formatear RUT al estilo 12.345.678-K
  formatearRut(rut: string): string {
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();

    if (rut.length < 2) return rut;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);

    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${cuerpoFormateado}-${dv}`;
  }

  get fechaMaxima(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 14);
    return hoy.toISOString().split('T')[0];
  }

  /** Resetea todos los campos y chequeos */
  resetFormulario() {
    this.usuario = {
      correo: '',
      nombre: '',
      apellidos: '',
      rut: '',
      celular: '',
      password: '',
      repetirPassword: '',
      fechaNacimiento: '',
      tipo: 'estudiante'
    };
    this.aceptaTerminos = this.verPassword = this.verRepetir = false;
    this.claveAdmin = '';
  }

  /** Mostrar modal reutilizable */
  mostrarMensaje(titulo: string, mensaje: string, redirigir: boolean = false, limpiar: boolean = false) {
    this.tituloModal       = titulo;
    this.mensajeModal      = mensaje;
    this.mostrarModal      = true;
    this.redirigirAlInicio = redirigir;
    if (limpiar) this.resetFormulario();  // ← limpia si corresponde
  }

  cerrarModal() {
    this.mostrarModal = false;
    if (this.redirigirAlInicio) {
      this.router.navigate(['/']);
      setTimeout(() => {
        const modalLogin = document.getElementById('modalLogin');
        if (modalLogin) modalLogin.click();
      }, 500);
    }
  }

  /* =======================================================
     FLUJO PRINCIPAL DE REGISTRO
     ======================================================= */
  registrarUsuario() {
    if (!this.aceptaTerminos) {
      this.mostrarMensaje('Términos y condiciones',
        'Debes aceptar los términos y condiciones para registrarte.');
      return;
    }

    if (!this.correoValido()) {
      this.mostrarMensaje('Correo inválido',
        'Por favor usa tu correo institucional (<strong>@unach.cl</strong> o <strong>@alu.unach.cl</strong>).');
      return;
    }

    // Paso 1: Validar RUT matemáticamente
    if (!this.rutValido(this.usuario.rut)) {
      this.mostrarMensaje('RUT inválido',
        'El RUT ingresado no es válido. Verifica tu RUT y reinténtalo.');
      return;
    }

      // Paso 2: Verificar si el RUT ya está registrado en la base de datos
    this.usuarioService.verificarRut(this.usuario.rut).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.usuario.rut = ''; // ⬅️ Solo se limpia el campo RUT
          this.mostrarMensaje('RUT duplicado',
            '⚠️ Este RUT ya está registrado. Intenta con otro.', false);
        } else {
          this.verificarCorreoYRegistrar();
        }
      },
      error: () => {
        this.mostrarMensaje('Error',
          '❌ Ocurrió un error al verificar el RUT.');
      }
    });
  }

  verificarCorreoYRegistrar() {
    this.usuarioService.verificarCorreo(this.usuario.correo).subscribe({
      next: (existe: boolean) => {
      if (existe) {
        this.usuario.correo = ''; // ✅ Solo se limpia el campo de correo
        this.mostrarMensaje('Correo duplicado',
          '⚠️ Este correo ya está registrado. Intenta con otro.', false);
      } else {
        this.enviarRegistro();
      }

      },
      error: () => {
        this.mostrarMensaje('Error',
          '❌ Ocurrió un error al verificar el correo.');
      }
    });
  }

  /** Llamada final al backend */
  enviarRegistro() {
    const datos = {
      nombre:            this.usuario.nombre,
      apellidos:         this.usuario.apellidos,
      rut:               this.usuario.rut,
      celular:           this.usuario.celular,
      fecha_nacimiento:  this.usuario.fechaNacimiento,
      tipo:              this.usuario.tipo,
      correo:            this.usuario.correo,
      contraseña:        this.usuario.password
    };

    this.usuarioService.registrar(datos).subscribe({
      next: () => {
        this.mostrarMensaje(
          '¡Registro exitoso!',
          'Gracias por registrarte en <strong>Ropero UNACH</strong>🧥💚<br>Ahora puedes iniciar sesión para comenzar a publicar tus productos.',
          true
        );
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);
        if (err.status === 409) {
          this.mostrarMensaje('Correo duplicado',
            '⚠️ Este correo ya está registrado.', false, true);
        } else {
          this.mostrarMensaje('Error',
            '❌ Ocurrió un error al registrar el usuario.');
        }
      }
    });
  }
}
