import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../sesion/inicio-sesion/usuario.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  perfil: any;
  esMiPerfil: boolean = false;
  usuarioActual: any = null; // ✅ NUEVO: propiedad para el usuario logueado

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}'); // ✅ cargar desde localStorage

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
    console.log('🚀 Ejecutando iniciarConversacion()');
    console.log('🧠 Valor de this.perfil:', this.perfil);

    const datos = {
      id_receptor: this.perfil.id_usuario,
      id_emisor: this.usuarioActual.id_usuario // ✅ Corregido
    };

    console.log('📦 Enviando datos a backend:', datos);

    this.http.post<any>('http://localhost:3000/api/conversaciones/iniciar', datos).subscribe({
      next: (res) => {
        console.log('✅ Conversación creada o encontrada:', res);
        const idConversacion = res.conversacion.id_conversacion;
        this.router.navigate(['/conversaciones', idConversacion]);
      },
      error: (err) => {
        console.error('❌ Error al iniciar conversación:', err);
      }
    });
  }
}
