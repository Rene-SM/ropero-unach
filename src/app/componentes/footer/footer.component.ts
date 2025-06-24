import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InicioSesionComponent } from '../sesion/inicio-sesion/inicio-sesion.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule,
    InicioSesionComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild('loginComponent') loginComponent!: InicioSesionComponent;
  sesionIniciada: boolean = false;

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario'); // o 'token', según tu lógica
    this.sesionIniciada = !!usuario;
  }

  abrirModalDesdeFooter(): void {
    this.loginComponent.abrirModal();
  }
}
