import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  frases: string[] = [
    '♻️ Cada prenda cuenta. Reutiliza, no desperdicies.',
    '👚 Tu ropa usada puede ser el tesoro de alguien más.',
    '🌍 Viste con propósito. Piensa en el planeta.',
    '🎁 Donar es compartir. Tu gesto puede cambiar un día.',
    '🧵 La moda consciente comienza contigo.',
    '🌱 Reutilizar es revolucionar la forma en que consumimos.',
    '💚 Haz del consumo responsable tu nuevo estilo.',
    '👖 Un jeans reutilizado, un paso hacia un futuro más limpio.',
    '🤝 Compartir ropa también es compartir valores.',
    '🔄 Reutilizar no es viejo, es sabio.',
    '🪡 Cada hilo tiene una historia. Dale una segunda vida.',
    '✨ Estilo no es comprar nuevo, es saber elegir con conciencia.',
    '🔥 Lo que ya no usas puede inspirar a otros.',
    '📦 Cambia el armario, no el planeta.',
    '🌤️ Con cada prenda donada, el mundo respira mejor.',
    '🌺 Vestir con conciencia es vestir con amor.',
    '💫 La economía circular comienza en tu clóset.',
    '💬 Tu ropa habla de ti. Haz que diga algo bueno.',
    '🚪 Dale salida a tu ropa. Abre la puerta a la solidaridad.',
    '🌎 No hay planeta B, pero sí hay forma B de vestir.'
  ];

  fraseActual: string = '';
  indiceFrase: number = 0;

  ngOnInit(): void {
    this.fraseActual = this.frases[0];

    setInterval(() => {
      this.indiceFrase = (this.indiceFrase + 1) % this.frases.length;
      this.fraseActual = this.frases[this.indiceFrase];
    }, 20000); 
  }
}
