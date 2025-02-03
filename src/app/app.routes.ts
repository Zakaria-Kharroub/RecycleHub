import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {LoginComponent} from './components/auth/login/login.component';

export const routes: Routes = [
  {path: '',component:HomeComponent},
  {path: 'register',component:RegisterComponent},
  {path:'login',component:LoginComponent}
];
