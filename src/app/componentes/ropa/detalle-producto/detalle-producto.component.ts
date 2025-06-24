import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../sesion/nueva-publicacion/producto.service';

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
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.obtenerProductoPorId(+id).subscribe(
        (res) => {
          this.producto = Array.isArray(res) ? res[0] : res;

          if (res.imagen && typeof res.imagen === 'string') {
            this.producto.imagenes = [res.imagen];
          } else if (Array.isArray(res.imagenes)) {
            this.producto.imagenes = res.imagenes;
          } else {
            this.producto.imagenes = [];
          }

          if (this.producto.imagenes.length > 0) {
            this.imagenSeleccionada = this.producto.imagenes[0];
            this.indiceActual = 0;
          }
        },
        (err) => console.error('Error al cargar producto:', err)
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
}
