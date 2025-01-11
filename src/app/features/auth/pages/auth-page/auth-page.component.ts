import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent {
  showLogin = true;  // Variable para determinar qué componente mostrar

  onSwitchToRegister() {
    this.showLogin = false;  // Cambiar a la vista de registro
  }

  onSwitchToLogin() {
    this.showLogin = true;  // Cambiar a la vista de login
  }
}
