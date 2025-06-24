import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../sesion/nueva-publicacion/producto.service';
import Swal from 'sweetalert2'; // ✅ AGREGADO

@Component({
  standalone: true,
  selector: 'app-ropa-general',
  templateUrl: './ropa-general.component.html',
  styleUrls: ['./ropa-general.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RopaGeneralComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];

  filtroGenero: string = '';
  filtroEstado: string = '';
  filtroOperacion: string = '';
  filtroSubcategoria: string = '';
  ordenSeleccionado: string = '';

  esAdmin: boolean = false;
  usuario: any = null;

  mostrarModalEliminar: boolean = false;
  productoSeleccionado: any = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const parsed = JSON.parse(usuario);
      this.usuario = parsed;
      this.esAdmin = parsed.tipo === 'admin';
    }

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerRopaGeneral().subscribe(
      res => {
        this.productos = res;
        this.aplicarFiltros();
      },
      err => {
        console.error('❌ Error al cargar productos:', err);
      }
    );
  }

  aplicarFiltros(): void {
    let filtrados = this.productos.filter(p => {
      const categoriaCruda = (p.tipo_categoria || '').trim().toLowerCase();
      const subcat = (p.subcategoria || '').trim().toLowerCase();
      const estado = (p.estado || '').trim().toLowerCase();
      const operacion = (p.tipo_operacion || '').trim().toLowerCase();

      const coincideGenero = this.filtroGenero
        ? categoriaCruda.includes(this.filtroGenero.toLowerCase())
        : true;

      const coincideSubcategoria = this.filtroSubcategoria
        ? subcat.includes(this.filtroSubcategoria.trim().toLowerCase())
        : true;

      const coincideEstado = this.filtroEstado
        ? estado === this.filtroEstado
        : true;

      const coincideOperacion = this.filtroOperacion
        ? operacion === this.filtroOperacion.trim().toLowerCase()
        : true;

      return coincideGenero && coincideSubcategoria && coincideEstado && coincideOperacion;
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

  aplicarFiltroGenero(genero: string): void {
    this.filtroGenero = genero;
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aplicarFiltroSubcategoria(subcat: string): void {
    this.filtroSubcategoria = subcat;
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aplicarFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aplicarFiltroOperacion(operacion: string): void {
    this.filtroOperacion = operacion;
    this.ordenSeleccionado = '';
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
    this.filtroGenero = '';
    this.filtroSubcategoria = '';
    this.filtroEstado = '';
    this.filtroOperacion = '';
    this.ordenSeleccionado = '';
    this.aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirModalEliminar(producto: any): void {
    this.productoSeleccionado = producto;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminacion(): void {
    if (!this.productoSeleccionado || !this.usuario?.id_usuario) return;

    this.productoService.eliminarProducto(this.productoSeleccionado.id_producto, this.usuario.id_usuario).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id_producto !== this.productoSeleccionado.id_producto);
        this.aplicarFiltros();
        this.mostrarModalEliminar = false;
        this.productoSeleccionado = null;

        // ✅ Alerta de éxito
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

        // ❌ Alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar la publicación.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.productoSeleccionado = null;
  }
}
