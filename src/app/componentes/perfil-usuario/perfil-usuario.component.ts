import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../sesion/inicio-sesion/usuario.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  perfil: any;
  esMiPerfil: boolean = false;
  usuarioActual: any = null;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const miId = Number(localStorage.getItem('id_usuario'));
    if (id) {
      this.usuarioService.obtenerPerfilPublico(id).subscribe(
        (data) => {
          this.perfil = data;
          this.esMiPerfil = id === miId;
          console.log('📦 Datos del perfil cargado:', this.perfil);
        },
        (err) => {
          console.error('❌ Error al cargar perfil público:', err);
        }
      );
    }
  }

  obtenerPorcentaje(estrella: number): number {
    const total = this.perfil.total || 0;
    const cantidad = this.perfil.distribucion?.[estrella] || 0;
    return total > 0 ? (cantidad / total) * 100 : 0;
  }

  obtenerCantidad(estrella: number): number {
    return this.perfil.distribucion?.[estrella] || 0;
  }

  iniciarConversacion() {
    const datos = {
      id_receptor: this.perfil.id_usuario,
      id_emisor: this.usuarioActual.id_usuario
    };

    this.http.post<any>('http://localhost:3000/api/conversaciones/iniciar', datos).subscribe({
      next: (res) => {
        const idConversacion = res.conversacion?.id_conversacion;
        if (!idConversacion) {
          console.error('❌ No se obtuvo id_conversacion desde el backend');
          return;
        }
        this.router.navigate(['/conversaciones', idConversacion]);
      },
      error: (err) => {
        console.error('❌ Error al iniciar conversación:', err);
      }
    });
  }

  enviarCalificacionModal() {
    Swal.fire({
      title: '<h2 style="font-size: 22px; font-weight: 600; margin-bottom: 16px; color: #2d3748;">Deja una calificación</h2>',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; text-align: left; max-width: 500px; margin: auto;">
          <label for="puntaje" style="display:block; margin-bottom: 6px; font-weight: 600; color: #2d3748;">Puntuación:</label>
          <select id="puntaje" style="
            width: 100%;
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #cbd5e0;
            margin-bottom: 20px;
            font-size: 15px;
            font-family: 'Segoe UI', sans-serif;
            background-color: #f9fafb;">
            <option value="5">⭐️⭐️⭐️⭐️⭐️ (5 estrellas)</option>
            <option value="4">⭐️⭐️⭐️⭐️ (4 estrellas)</option>
            <option value="3">⭐️⭐️⭐️ (3 estrellas)</option>
            <option value="2">⭐️⭐️ (2 estrellas)</option>
            <option value="1">⭐️ (1 estrella)</option>
          </select>

          <label for="comentario" style="display:block; margin-bottom: 6px; font-weight: 600; color: #2d3748;">Comentario:</label>
          <textarea id="comentario" rows="4" style="
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #cbd5e0;
            font-size: 15px;
            font-family: 'Segoe UI', sans-serif;
            resize: vertical;
            background-color: #f9fafb;" placeholder="Escribe tu comentario..."></textarea>
        </div>
      `,
      width: 600,
      background: '#ffffff',
      showCancelButton: true,
      confirmButtonText: '✅ Enviar calificación',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-xl shadow',
        confirmButton: 'bg-green-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-green-700',
        cancelButton: 'bg-gray-300 text-black px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-400'
      },
      focusConfirm: false,
      preConfirm: () => {
        const puntaje = Number((<HTMLInputElement>document.getElementById('puntaje'))?.value);
        const comentario = (<HTMLTextAreaElement>document.getElementById('comentario'))?.value?.trim();

        if (!comentario) {
          Swal.showValidationMessage('Por favor, escribe un comentario.');
          return false;
        }

        return { puntaje, comentario };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const datos = {
          id_emisor: this.usuarioActual.id_usuario,
          id_receptor: this.perfil.id_usuario,
          puntuacion: result.value.puntaje,
          comentario: result.value.comentario,
          tipo_calificacion: 'como_vendedor',
          id_transaccion: null
        };

        this.http.post('http://localhost:3000/api/calificaciones', datos).subscribe({
          next: () => {
          Swal.fire('¡Gracias!', 'Tu calificación fue registrada.', 'success').then(() => {
            window.location.reload(); // fuerza la recarga completa del componente
          });
          },
          error: (err) => {
            if (err.status === 403) {
              Swal.fire('Error', 'No puedes calificarte a ti mismo.', 'warning');
            } else {
              Swal.fire('Error', 'No se pudo guardar la calificación.', 'error');
            }
          }
        });
      }
    });
  }
}
