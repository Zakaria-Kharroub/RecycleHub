import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {LoginComponent} from './components/auth/login/login.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ParticulierComponent} from './components/particulier/particulier.component';
import {CollecteurComponent} from './components/collecteur/collecteur.component';
import {AuthGuard} from './guards/auth/auth.guard';
import {ParticulierGuard} from './guards/particulier/particulier.guard';
import {CollecteurGuard} from './guards/collecteur/collecteur.guard';

export const routes: Routes = [
  {path: '',component:HomeComponent},
  {path: 'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'particulier',component:ParticulierComponent,canActivate: [AuthGuard,ParticulierGuard]},
  {path:'profile',component:ProfileComponent,canActivate: [AuthGuard]},
  {path:'collecteur',component:CollecteurComponent,canActivate: [AuthGuard,CollecteurGuard]}
];
