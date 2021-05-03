import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends TranslatableComponent implements OnInit {
  private email: string;
  private returnUrl: string;

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService) {
      super(translateService);
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onLogin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password).then(_ => {
      window.alert('User logged in sucessfully');
      form.reset();
      this.email = email;
      this.router.navigateByUrl(this.returnUrl);
    }).catch((error) => {
    });

  }
  onLogout () {
    this.authService.logout()
    .then(_ => {
      this.email = null;
    }).catch(error => {
      console.log(error);
    });
  }
}
