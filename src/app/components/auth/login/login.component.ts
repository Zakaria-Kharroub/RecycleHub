import { Component } from '@angular/core';
import {HeaderComponent} from '../../layouts/header/header.component';
import {FooterComponent} from '../../layouts/footer/footer.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
