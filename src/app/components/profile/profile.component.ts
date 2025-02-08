import { Component } from '@angular/core';
import {HeaderComponent} from '../layouts/header/header.component';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
