import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../sesion/nueva-publicacion/producto.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ComunidadComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];

  filtroCategoria: string = '';
  filtroSubcategoria: string = '';
  filtroEstado: string = '';
  ordenSeleccionado: string = '';

  categorias = ['Ropa Hombre', 'Ropa Mujer', 'Accesorios'];

  usuario: any = null;
  esAdmin: boolean = false;

  mostrarModalEliminar: boolean = false;
  productoSeleccionado: any = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const parsed = JSON.parse(usuario);
      this.usuario = parsed;
      this.esAdmin = parsed.rol === 'admin';
    }

    this.productoService.obtenerDonacionesComunidad().subscribe(
      res => {
        this.productos = res;
        this.aplicarFiltros();
      },
      err => console.error('❌ Error al cargar productos:', err)
    );
  }

  aplicarFiltros(): void {
    let filtrados = this.productos.filter(p => {
      const categoria = p.tipo_categoria?.trim().toLowerCase() || '';
      const subcat = p.subcategoria?.trim().toLowerCase() || '';
      const estado = p.estado?.trim().toLowerCase() || '';

      const coincideCategoria = this.filtroCategoria
        ? categoria === this.filtroCategoria.trim().toLowerCase()
        : true;

      const coincideSubcategoria = this.filtroSubcategoria
        ? subcat === this.filtroSubcategoria.trim().toLowerCase()
        : true;

      const coincideEstado = this.filtroEstado
        ? estado === this.filtroEstado.trim().toLowerCase()
        : true;

      return coincideCategoria && coincideSubcategoria && coincideEstado;
    });

    switch (this.ordenSeleccionado) {
      case 'precio_asc':
        filtrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio_desc':
        filtrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'reciente':
        filtrados.sort((a, b) =>
          new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
        );
        break;
      case 'antiguo':
        filtrados.sort((a, b) =>
          new Date(a.fecha_publicacion).getTime() - new Date(b.fecha_publicacion).getTime()
        );
        break;
    }

    this.productosFiltrados = filtrados;
  }

  aplicarFiltroCategoria(cat: string): void {
    this.filtroCategoria = cat;
    this.filtroSubcategoria = '';
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aplicarFiltroSubcategoria(sub: string): void {
    this.filtroSubcategoria = sub;
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aplicarFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cambiarOrden(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.ordenSeleccionado = select.value;
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  limpiarFiltros(): void {
    this.filtroCategoria = '';
    this.filtroSubcategoria = '';
    this.filtroEstado = '';
    this.ordenSeleccionado = '';
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirModalEliminar(producto: any): void {
    this.productoSeleccionado = producto;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.productoSeleccionado = null;
  }

  confirmarEliminacion(): void {
    if (!this.productoSeleccionado || !this.usuario?.id_usuario) return;

    this.productoService.eliminarProducto(this.productoSeleccionado.id_producto, this.usuario.id_usuario).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id_producto !== this.productoSeleccionado.id_producto);
        this.aplicarFiltros();
        this.mostrarModalEliminar = false;
        this.productoSeleccionado = null;

        Swal.fire({
          icon: 'success',
          title: 'Publicación eliminada',
          text: 'La publicación fue eliminada correctamente.',
          confirmButtonColor: '#10b981'
        });
      },
      error: err => {
        console.error('❌ Error al eliminar producto:', err);
        this.mostrarModalEliminar = false;
        this.productoSeleccionado = null;

        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar la publicación.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
