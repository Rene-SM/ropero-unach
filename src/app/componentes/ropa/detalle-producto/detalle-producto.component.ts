import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../sesion/nueva-publicacion/producto.service';
import { SolicitudService } from '../../conversaciones/solicitud.service';
import Swal from 'sweetalert2';
import { InicioSesionComponent } from '../../sesion/inicio-sesion/inicio-sesion.component';
import { HttpClient } from '@angular/common/http'; // ✅ agregado

@Component({
  standalone: true,
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css'],
  imports: [CommonModule, RouterModule, InicioSesionComponent]
})
export class DetalleProductoComponent implements OnInit {
  producto: any = null;
  imagenSeleccionada: string = '';
  indiceActual: number = 0;

  @ViewChild('loginComponent') loginComponent!: InicioSesionComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private solicitudService: SolicitudService,
    private http: HttpClient // ✅ agregado aquí también
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.obtenerProductoPorId(+id).subscribe(
        (res) => {
          this.producto = Array.isArray(res) ? res[0] : res;
          console.log('📦 Producto recibido:', this.producto); 

          if (this.producto.imagen && typeof this.producto.imagen === 'string') {
            this.producto.imagenes = [this.producto.imagen];
          } else if (!Array.isArray(this.producto.imagenes)) {
            this.producto.imagenes = [];
          }

          if (this.producto.imagenes.length > 0) {
            this.imagenSeleccionada = this.producto.imagenes[0];
            this.indiceActual = 0;
          } else {
            this.imagenSeleccionada = '';
          }
        },
        (err) => {
          console.error('❌ Error al cargar producto:', err);
        }
      );
    }
  }

  cambiarImagen(url: string): void {
    this.imagenSeleccionada = url;
    this.indiceActual = this.producto.imagenes.indexOf(url);
  }

  siguienteImagen(): void {
    if (this.producto.imagenes.length > 0) {
      this.indiceActual = (this.indiceActual + 1) % this.producto.imagenes.length;
      this.imagenSeleccionada = this.producto.imagenes[this.indiceActual];
    }
  }

  anteriorImagen(): void {
    if (this.producto.imagenes.length > 0) {
      this.indiceActual = (this.indiceActual - 1 + this.producto.imagenes.length) % this.producto.imagenes.length;
      this.imagenSeleccionada = this.producto.imagenes[this.indiceActual];
    }
  }

  iniciarConversacion(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (!usuario?.id_usuario) {
      Swal.fire({
        title: 'Debes iniciar sesión',
        text: 'Para poder chatear debes iniciar sesión en Ropero UNACH.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Aceptar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.loginComponent.abrirModal();
        }
      });

      return;
    }

    const datos = {
      id_emisor: usuario.id_usuario,
      id_receptor: this.producto.id_usuario // ✅ CORREGIDO
    };

    this.http.post<any>('http://localhost:3000/api/conversaciones/iniciar', datos).subscribe({
      next: (res) => {
        const idConversacion = res.conversacion.id_conversacion;
        this.router.navigate(['/conversaciones', idConversacion]);
      },
      error: (err) => {
        console.error('❌ Error al iniciar conversación:', err);
      }
    });
  }

  esPropietario(): boolean {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuarioLocal?.id_usuario === this.producto?.id_usuario; // ✅ también corregido
  }
}
