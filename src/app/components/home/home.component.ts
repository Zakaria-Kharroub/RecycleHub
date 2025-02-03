import { Component } from '@angular/core';
import {HeaderComponent} from '../layouts/header/header.component';
import {FooterComponent} from '../layouts/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
