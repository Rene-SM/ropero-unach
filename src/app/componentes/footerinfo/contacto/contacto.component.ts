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

    // Validación de campos vacíos
    if (!nombre || !correo || !tipoUsuario || !tipoConsulta || !mensaje) {
      return;
    }

    // Validar correo institucional
    const correoValido = correo.endsWith('@unach.cl') || correo.endsWith('@alu.unach.cl');
    if (!correoValido) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        html: 'Por favor usa tu correo institucional (<b>@unach.cl</b> o <b>@alu.unach.cl</b>).',
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    // Mostrar confirmación de mensaje enviado
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Gracias por contactarnos. Te responderemos pronto.',
      confirmButtonColor: '#4caf50'
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
