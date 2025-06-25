import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../sesion/nueva-publicacion/producto.service';
import { SolicitudService } from '../../conversaciones/solicitud.service'; // ✅ Importado

@Component({
  standalone: true,
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css'],
  imports: [CommonModule, RouterModule]
})
export class DetalleProductoComponent implements OnInit {
  producto: any = null;
  imagenSeleccionada: string = '';
  indiceActual: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // ✅ Agregado
    private productoService: ProductoService,
    private solicitudService: SolicitudService // ✅ Agregado
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.obtenerProductoPorId(+id).subscribe(
        (res) => {
          this.producto = Array.isArray(res) ? res[0] : res;
          console.log('📦 Producto recibido:', this.producto); 

          // 🔄 Asegurar que las imágenes se manejen correctamente
          if (this.producto.imagen && typeof this.producto.imagen === 'string') {
            this.producto.imagenes = [this.producto.imagen];
          } else if (!Array.isArray(this.producto.imagenes)) {
            this.producto.imagenes = [];
          }

          // ✅ Seleccionar imagen principal si hay imágenes
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

  // ✅ NUEVO MÉTODO
  iniciarConversacion(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (!usuario?.id_usuario) {
      alert('Debes iniciar sesión para chatear');
      return;
    }

    const data = {
      id_producto: this.producto.id_producto,
      id_usuario: usuario.id_usuario
    };

    this.solicitudService.iniciarSolicitud(data).subscribe({
      next: (res) => {
        const id_solicitud = res.id_solicitud;
        this.router.navigate(['/conversaciones', id_solicitud]);
      },
      error: (err) => {
        console.error('Error al iniciar conversación', err);
      }
    });
  }
}
