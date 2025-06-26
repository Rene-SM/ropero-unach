import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InicioSesionComponent } from '../sesion/inicio-sesion/inicio-sesion.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule,
    InicioSesionComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('loginComponent') loginComponent!: InicioSesionComponent;

  mostrarModalLogin: boolean = false;
  usuarioAutenticado: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false; // ✅ nueva variable

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      this.usuarioAutenticado = true;
      this.nombreUsuario = usuarioData.nombre || 'Usuario';
      this.esAdmin = usuarioData.rol === 'admin'; // ✅ detectamos si es admin
    }
  }

  abrirModalDesdeHeader() {
    this.loginComponent.abrirModal();
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioAutenticado = false;
    this.nombreUsuario = '';
    this.esAdmin = false;

    // 🔁 Redirigir a inicio antes de recargar (opcional para asegurarse que esté en "/")
    this.router.navigate(['/']).then(() => {
      location.reload(); // 🔄 Recarga completa
    });
  }

  mostrarMenuUsuario: boolean = false;
  timeoutMenu: any;

  abrirMenuUsuario() {
    clearTimeout(this.timeoutMenu);
    this.mostrarMenuUsuario = true;
  }

  cerrarMenuUsuario() {
    this.timeoutMenu = setTimeout(() => {
      this.mostrarMenuUsuario = false;
    }, 200);
  }

  mostrarMenuCategorias: boolean = false;
  timeoutCategorias: any;

  abrirMenuCategorias() {
    clearTimeout(this.timeoutCategorias);
    this.mostrarMenuCategorias = true;
  }

  cerrarMenuCategorias() {
    this.timeoutCategorias = setTimeout(() => {
      this.mostrarMenuCategorias = false;
    }, 200);
  }
}
