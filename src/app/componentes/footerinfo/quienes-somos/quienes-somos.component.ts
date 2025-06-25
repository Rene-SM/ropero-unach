import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent {
  constructor(private router: Router) {}

  irAContribuir() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.router.navigate(['/nueva-publicacion']);
    } else {
      this.router.navigate(['/inicio-sesion']);
    }
  }
}
