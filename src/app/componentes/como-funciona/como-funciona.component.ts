import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [HeaderComponent, RouterModule], 
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.css'
})
export class ComoFuncionaComponent {}