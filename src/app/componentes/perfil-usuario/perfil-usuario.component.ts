import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../sesion/inicio-sesion/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  perfil: any;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.usuarioService.obtenerPerfilPublico(id).subscribe(
        (data) => {
          this.perfil = data;
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
}
