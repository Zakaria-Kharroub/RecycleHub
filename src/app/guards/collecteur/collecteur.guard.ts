import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../../services/auth.service';
@Injectable({
  providedIn:'root'
})
export class CollecteurGuard implements CanActivate{
  constructor(private authService:AuthService,private router:Router){}
  canActivate(): boolean{
    const currentUser = this.authService.currentUserValue;
    if(currentUser && currentUser.role === 'collecteur') {
      return true;
    }else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
