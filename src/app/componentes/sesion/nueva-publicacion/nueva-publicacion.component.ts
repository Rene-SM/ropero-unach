import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProductoService } from './producto.service';

@Component({
  standalone: true,
  selector: 'app-nueva-publicacion',
  templateUrl: './nueva-publicacion.component.html',
  styleUrls: ['./nueva-publicacion.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatButtonToggleModule
  ]
})
export class NuevaPublicacionComponent implements OnInit {
  categoriasGenerales = ['Ropa de Hombre', 'Ropa de Mujer', 'Accesorios'];

  subcategorias: { [key: string]: string[] } = {
    'Ropa de Hombre': ['Deportiva', 'Casual', 'Formal'],
    'Ropa de Mujer': ['Deportiva', 'Casual', 'Formal'],
    'Accesorios': ['Calzado', 'Joyería', 'Maquillaje']
  };

  categoriasDB: { [key: string]: number } = {
    'Ropa de Hombre-Deportiva': 1,
    'Ropa de Hombre-Casual': 2,
    'Ropa de Hombre-Formal': 3,
    'Ropa de Mujer-Deportiva': 4,
    'Ropa de Mujer-Casual': 5,
    'Ropa de Mujer-Formal': 6,
    'Accesorios-Calzado': 7,
    'Accesorios-Joyería': 8,
    'Accesorios-Maquillaje': 9
  };

  tipoDonacionDB: { [key: string]: number } = {
    'Comunidad': 1,
    'Agrupaciones': 2
  };

  tallasCalzado = Array.from({ length: 16 }, (_, i) => (30 + i).toString());

  publicacion: {
    titulo: string;
    estado: string;
    talla: string;
    descripcion: string;
    tipoOperacion: string;
    precio: number;
    tipoDonacion: string;
    categoriaGeneral: string;
    subcategoria: string;
    cantidad: number | null;
  } = {
    titulo: '',
    estado: '',
    talla: '',
    descripcion: '',
    tipoOperacion: '',
    precio: 0,
    tipoDonacion: '',
    categoriaGeneral: '',
    subcategoria: '',
    cantidad: null
  };

  precioFormateado: string = '';
  imagenes: { archivo: File, preview: string }[] = [];

  mostrarModalExito: boolean = false;
  mostrarModalError: boolean = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {}

  onImagenesSeleccionadas(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    if (this.imagenes.length + files.length > 5) {
      this.mostrarModalError = true;
      return;
    }

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenes.push({ archivo: file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }

    input.value = '';
  }

  eliminarImagen(index: number) {
    this.imagenes.splice(index, 1);
  }

  formatearPrecio(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, '');
    const numberValue = parseInt(rawValue, 10);
    this.publicacion.precio = !isNaN(numberValue) ? numberValue : 0;
    this.precioFormateado = this.publicacion.precio.toLocaleString('es-CL');
  }

  soloNumeros(event: KeyboardEvent) {
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }

  evitarPegadoInvalido(event: ClipboardEvent) {
    const textoPegado = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(textoPegado)) event.preventDefault();
  }

  debeMostrarTallaGeneral(): boolean {
    return this.publicacion.categoriaGeneral !== 'Accesorios';
  }

  debeMostrarTallaCalzado(): boolean {
    return this.publicacion.categoriaGeneral === 'Accesorios' && this.publicacion.subcategoria === 'Calzado';
  }

  publicar() {
    const camposBaseIncompletos = !this.publicacion.titulo ||
      !this.publicacion.estado ||
      (!this.debeMostrarTallaCalzado() && !this.debeMostrarTallaGeneral()) ? false : !this.publicacion.talla ||
      !this.publicacion.descripcion ||
      !this.publicacion.tipoOperacion;

    const categoriaIncompleta = !this.publicacion.categoriaGeneral || !this.publicacion.subcategoria;

    const precioInvalido = this.publicacion.tipoOperacion === 'Vender' &&
      (!this.publicacion.precio || this.publicacion.precio <= 0);

    const donacionIncompleta = this.publicacion.tipoOperacion === 'donar' &&
      !this.publicacion.tipoDonacion;

    const sinImagenes = this.imagenes.length === 0;

    if (camposBaseIncompletos || categoriaIncompleta || precioInvalido || donacionIncompleta || sinImagenes) {
      this.mostrarModalError = true;
      return;
    }

    const formData = new FormData();

    const claveCategoria = `${this.publicacion.categoriaGeneral}-${this.publicacion.subcategoria}`;
    const idCategoria = this.categoriasDB[claveCategoria];

    if (!idCategoria) {
      this.mostrarModalError = true;
      return;
    }

    formData.append('id_categoria', idCategoria.toString());

    if (this.publicacion.tipoOperacion.toLowerCase() === 'donar') {
      const idTipoDonacion = this.tipoDonacionDB[this.publicacion.tipoDonacion];
      if (!idTipoDonacion) {
        this.mostrarModalError = true;
        return;
      }
      formData.append('id_tipo_donacion', idTipoDonacion.toString());
    }

    formData.append('nombre', this.publicacion.titulo);
    formData.append('descripcion', this.publicacion.descripcion);
    formData.append('estado', this.publicacion.estado);
    formData.append('talla', this.publicacion.talla);
    formData.append('tipo_operacion', this.publicacion.tipoOperacion.toLowerCase());
    formData.append('precio', this.publicacion.tipoOperacion === 'Vender' ? this.publicacion.precio.toString() : '0');
    formData.append('cantidad', this.publicacion.cantidad !== null ? String(this.publicacion.cantidad) : '');

    this.imagenes.forEach((img) => {
      formData.append('imagenes', img.archivo);
    });

    this.productoService.publicarProducto(formData).subscribe({
      next: () => {
        this.mostrarModalExito = true;
        this.resetearFormulario();
      },
      error: () => {
        this.mostrarModalError = true;
      }
    });
  }

  cerrarModal() {
    this.mostrarModalExito = false;
    this.mostrarModalError = false;
    this.resetearFormulario();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetearFormulario() {
    this.publicacion = {
      titulo: '',
      estado: '',
      talla: '',
      descripcion: '',
      tipoOperacion: '',
      precio: 0,
      tipoDonacion: '',
      categoriaGeneral: '',
      subcategoria: '',
      cantidad: null
    };
    this.precioFormateado = '';
    this.imagenes = [];
  }
}
