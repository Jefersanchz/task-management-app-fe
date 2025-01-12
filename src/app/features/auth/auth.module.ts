import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule

@NgModule({
  declarations: [
    AuthPageComponent,
    LoginComponent,
    RegisterComponent,
 
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,  // Asegúrate de agregar FormsModule aquí
    HttpClientModule
   
  ]
})
export class AuthModule { }
