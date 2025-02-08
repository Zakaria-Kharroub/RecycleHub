import { Component } from '@angular/core';
import {HeaderComponent} from '../layouts/header/header.component';
import {FooterComponent} from '../layouts/footer/footer.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
