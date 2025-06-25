import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ContactoComponent {
  contacto = {
    nombre: '',
    correo: '',
    tipoUsuario: '',
    tipoConsulta: '',
    mensaje: ''
  };

  enviado = false;

  enviarMensaje() {
    this.enviado = true;

    const { nombre, correo, tipoUsuario, tipoConsulta, mensaje } = this.contacto;
    if (!nombre || !correo || !tipoUsuario || !tipoConsulta || !mensaje) {
      return;
    }

    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Gracias por contactarnos. Te responderemos pronto.'
    });

    // Limpiar campos
    this.contacto = {
      nombre: '',
      correo: '',
      tipoUsuario: '',
      tipoConsulta: '',
      mensaje: ''
    };

    // Reiniciar la bandera de validación
    this.enviado = false;
  }
}
