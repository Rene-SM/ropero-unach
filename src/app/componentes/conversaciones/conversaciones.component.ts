import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversacionService } from './conversacion.service';
import { io } from 'socket.io-client';
import { ActivatedRoute } from '@angular/router'; // ✅ agregado

@Component({
  selector: 'app-conversaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversaciones.component.html',
  styleUrls: ['./conversaciones.component.css']
})
export class ConversacionesComponent implements OnInit {
  conversaciones: any[] = [];
  mensajes: any[] = [];
  mensaje: string = '';
  usuarioActivo: any = null;
  socket: any;
  imagenSeleccionada: File | null = null;

  constructor(
    private conversacionService: ConversacionService,
    private route: ActivatedRoute // ✅ agregado
  ) {}

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');

    this.route.params.subscribe(params => {
      const idSolicitud = params['id_solicitud'];

      if (idSolicitud) {
        this.cargarMensajesPorSolicitud(idSolicitud);
      } else {
        this.obtenerConversaciones();
      }

      this.socket.on('mensajeNuevo', (nuevoMensaje: any) => {
        if (nuevoMensaje.id_solicitud === Number(idSolicitud)) {
          this.mensajes.push(nuevoMensaje);
        }
      });
    });
  }

  obtenerConversaciones() {
    this.conversacionService.obtenerConversaciones().subscribe((data) => {
      this.conversaciones = data;
    });
  }

  abrirConversacion(usuario: any) {
    this.usuarioActivo = usuario;
    this.conversacionService.obtenerMensajes(usuario.id_usuario).subscribe((data) => {
      this.mensajes = data;
    });
  }

  enviarMensaje() {
    if (this.mensaje.trim()) {
      const nuevo = {
        contenido: this.mensaje,
        receptor: this.usuarioActivo.id_usuario
      };

      this.conversacionService.enviarMensaje(nuevo).subscribe((res) => {
        this.mensajes.push(res);
        this.socket.emit('mensajeEnviado', res);
        this.mensaje = '';
      });
    }
  }

  seleccionarImagen(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }

  enviarImagen() {
    if (!this.imagenSeleccionada || !this.usuarioActivo) return;

    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada);
    formData.append('receptor', this.usuarioActivo.id_usuario);

    this.conversacionService.enviarImagen(formData).subscribe((res) => {
      this.mensajes.push(res);
      this.socket.emit('mensajeEnviado', res);
      this.imagenSeleccionada = null;
    });
  }

  esImagen(nombre: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(nombre);
  }

  // ✅ NUEVO MÉTODO
  cargarMensajesPorSolicitud(idSolicitud: number) {
    this.conversacionService.obtenerMensajesPorSolicitud(idSolicitud).subscribe((res: any) => {
      console.log('🧾 Respuesta del backend:', res); // ✅ Aquí se imprime toda la respuesta
      this.mensajes = res.mensajes;
      this.usuarioActivo = res.receptor;
    });
  }
}
