import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root'
})
export class ActorRoleGuard implements CanActivate {

  private currentActor: Actor;

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise ((resolve, reject) => {
      const expectedRole = next.data.expectedRole;
      const currentActor = this.authService.getCurrentActor();
      let result = false;
      if (currentActor) {
        console.log('Valor del currentActor: ' + currentActor);
        const activeRole = new RegExp(currentActor.role.toString(), 'i');
        if (expectedRole.search(activeRole) !== -1 ) {
          result = true;
        } else {
          this.router.navigate(['denied-access'], { queryParams: {previousURL: state.url }});
        }
        resolve(result);
      } else {
        if (expectedRole.indexOf('anonymous') !== -1 ) {
          result = true;
        } else {
          this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
        }
        resolve(result);
      }
    });
  }
}
