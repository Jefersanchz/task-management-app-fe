import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';  // El componente contenedor
import { LoginComponent } from './components/login/login.component'; // El componente de login
import { RegisterComponent } from './components/register/register.component'; // El componente de registro

const routes: Routes = [
  {
    path: 'auth',  // Ruta principal de autenticación
    component: AuthPageComponent,  // El componente contenedor
    children: [
      {
        path: 'login',  // Ruta hija para el login
        component: LoginComponent  // El componente de login
      },
      {
        path: 'register',  // Ruta hija para el registro
        component: RegisterComponent  // El componente de registro
      }
    ]
  },
  {
    path: '',  // Redirigir al path '/auth/login' al cargar la aplicación
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
