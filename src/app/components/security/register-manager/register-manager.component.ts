import { Component, OnInit, NgModule } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { TranslatableComponent } from '../../shared/translatable/translatable.component'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-manager',
  templateUrl: './register-manager.component.html',
  styleUrls: ['./register-manager.component.css']
})
export class RegisterManagerComponent extends TranslatableComponent implements OnInit {

  // Creamos un atributo que va a ser el propio formulario (un grupo de campos formulario)
  registerForm: FormGroup;
  submitted = false;
  // Arrays que indican las opciones que tendrán el combo del rol y idioma dentro del formulario de creación de manager
  roleList = ['Manager'];
  idiomlist = ['en', 'es'];

  // Para poder construir el formulario necesitamos el FormBuilder
  constructor(private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router) {
    super(translateService);
  }

  // Cuando se esté inicializando el componente, lo primero que vamos a hacer es crear el formulario
  // A diferencia del formulario del Profile, en este caso no necesitamos rellenar el valor de los campos con el actor
  ngOnInit() {
    this.registerForm = this.formBuilder.group
      ({
        name: [''],
        surname: [''],
        role: [''],
        password: [''],
        email: [''],
        countrycode: [''],
        phone: [''],
        address: [''],
        preferredLanguage: [''],
      });
  }

  // Método que se ejecuta al hacer click en el botón de enviar el formulario
  onRegister() {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log (this.registerForm.value);
      // El método registerUser almacena un nuevo usuario dentro del Json Server
      this.authService.registerUser(this.registerForm.value)
      .then(res => {
        console.log(res );
      }, err => { console.log(err + 'Real error'); });
  }
  }
}
