import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  @Output() switchToRegister = new EventEmitter<void>();  // Creamos un EventEmitter para cambiar a la vista de registro

  login() {
    // Lógica para iniciar sesión
    console.log("Iniciar sesión con", this.username, this.password);
  }

  goToRegister() {
    this.switchToRegister.emit();  // Emitimos el evento cuando se hace clic en "Regístrate"
  }
}
