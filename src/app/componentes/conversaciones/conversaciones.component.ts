import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversacionService } from './conversacion.service';
import { io } from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';

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
  idConversacion: number = 0;


  constructor(
    private conversacionService: ConversacionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');

    this.route.params.subscribe(params => {
      this.idConversacion = Number(params['id_conversacion']);
      if (this.idConversacion) {
        this.cargarMensajes(this.idConversacion);
      }

      this.socket.on('mensajeNuevo', (nuevoMensaje: any) => {
        if (nuevoMensaje.id_conversacion === this.idConversacion) {
          this.mensajes.push(nuevoMensaje);
        }
      });
    });

    this.obtenerConversaciones();
  }

  obtenerConversaciones() {
    this.conversacionService.obtenerConversaciones().subscribe((data) => {
      this.conversaciones = data;

      if (this.idConversacion) {
        const activa = data.find(c => c.id_conversacion === this.idConversacion);
        if (activa) {
          this.abrirConversacion(activa); // ✅ Esta línea activa la vista del chat
        }
      }
    });
  }

  abrirConversacion(conv: any) {
    this.usuarioActivo = conv.receptor || conv;
    this.idConversacion = conv.id_conversacion;
    this.socket.emit('unirseConversacion', this.idConversacion); // ✅ UNIRSE A LA SALA
    this.cargarMensajes(this.idConversacion);
  }

  cargarMensajes(id: number) {
    this.conversacionService.obtenerMensajes(id).subscribe((data) => {
      this.mensajes = data;
    });
  }

  enviarMensaje() {
    if (this.mensaje.trim() && this.idConversacion) {
      this.conversacionService.enviarMensaje(this.idConversacion, this.mensaje).subscribe((res) => {
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
    if (!this.imagenSeleccionada || !this.usuarioActivo || !this.idConversacion) return;

    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada);

    this.conversacionService.enviarImagen(this.idConversacion, formData).subscribe((res) => {
      this.mensajes.push(res);
      this.socket.emit('mensajeEnviado', res);
      this.imagenSeleccionada = null;
    });
  }

  esImagen(nombre: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(nombre);
  }
}
