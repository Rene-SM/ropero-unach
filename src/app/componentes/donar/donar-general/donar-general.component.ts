import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donar-general',
  templateUrl: './donar-general.component.html',
  styleUrls: ['./donar-general.component.css']
})
export class DonarGeneralComponent {
  constructor(private router: Router) {}

  irANuevaPublicacion(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.router.navigate(['/nueva-publicacion']);
    } else {
      this.router.navigate(['/inicio-sesion']);
    }
  }

  irACatalogoComunidad(): void {
    this.router.navigate(['/donar/comunidad']);
  }
}
