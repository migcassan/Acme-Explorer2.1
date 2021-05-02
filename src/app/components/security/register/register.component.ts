import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  roleList =  ['CLERK', 'CONSUMER'];
  langList = ['en', 'es'];


  constructor(private formBuilder: FormBuilder, private authService: AuthService,
   ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group
      ({
        name: [''],
        surname: [''],
        password: [''],
        email: [''],
        phone: [''],
        address: [''],
        role: [''],
        preferredLanguage: [''],

      });
  }

  onRegister() {
    this.authService.registerUser(this.registerForm.value)
      .then(res => {
        window.alert('User Registered Successfully');
        console.log(res);
      }, err => {
        console.log(err);
      });
 }
}
