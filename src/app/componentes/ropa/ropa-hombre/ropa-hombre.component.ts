import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../sesion/nueva-publicacion/producto.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-ropa-hombre',
  templateUrl: './ropa-hombre.component.html',
  styleUrls: ['./ropa-hombre.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RopaHombreComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];

  filtroEstado: string = '';
  filtroOperacion: string = '';
  filtroSubcategoria: string = '';
  ordenSeleccionado: string = '';

  // ✅ usuario y admin
  usuario: any = null;
  esAdmin: boolean = false;

  // ✅ modal eliminación
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

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerRopaGeneral().subscribe(
      (res: any[]) => {
        this.productos = res.filter((p: any) =>
          (p.tipo_categoria ?? '').toLowerCase().includes('hombre')
        );
        this.aplicarFiltros();
      },
      (err: HttpErrorResponse) => {
        console.error('❌ Error al cargar productos:', err.message);
      }
    );
  }

  aplicarFiltros(): void {
    let filtrados = this.productos.filter((p: any) => {
      const subcat = (p.subcategoria ?? '').toLowerCase();
      const estado = (p.estado ?? '').trim().toLowerCase();
      const operacion = (p.tipo_operacion ?? '').toLowerCase();

      const coincideEstado = this.filtroEstado
        ? estado === this.filtroEstado.toLowerCase()
        : true;

      const coincideOperacion = this.filtroOperacion
        ? operacion === this.filtroOperacion.toLowerCase()
        : true;

      const coincideSubcategoria = this.filtroSubcategoria
        ? subcat.includes(this.filtroSubcategoria.toLowerCase())
        : true;

      return coincideEstado && coincideOperacion && coincideSubcategoria;
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

  aplicarFiltroSubcategoria(subcategoria: string): void {
    this.filtroSubcategoria = subcategoria;
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
    this.filtroEstado = '';
    this.filtroOperacion = '';
    this.filtroSubcategoria = '';
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

        // ✅ Éxito
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

        // ❌ Error
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar la publicación. Intenta nuevamente.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
