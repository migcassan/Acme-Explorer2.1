
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './components/security/login/login.component';
import { RegisterComponent } from './components/security/register/register.component';


const appRoutes: Routes = [

  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  }];

  @NgModule({
    imports: [
      CommonModule,
      RouterModule.forRoot(appRoutes),
     ],
     exports: [
       RouterModule
     ],
     declarations: []
  })
export class AppRoutingModule { }




